# VetPMS MVP System Design

**Version**: 1.1  
**Last Updated**: May 2025  
**Purpose**: Define minimum viable product for first paying customer

## Overview

This document outlines the Minimum Viable Product (MVP) for VetPMS PMS, focusing on essential features needed to acquire our first paying customer. The MVP prioritizes simplicity and rapid deployment while ensuring core functionality for multi-tenant veterinary practices.

## MVP Core Principles

1. **Build Only What's Essential**: Deliver core veterinary practice functionality with minimal complexity
2. **Multi-Tenant First**: Support multiple veterinary practices from day one
3. **Role-Based Access**: Implement comprehensive role-based access control
4. **Security First**: Ensure proper data isolation between tenants

## MVP Technology Stack

### Frontend

- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Router** for navigation
- **Shadcn/ui** for UI components
- **JWT** for authentication

### Backend

- **ASP.NET Core 8** (monolithic API)
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** with role-based claims
- **Multi-tenant middleware**
- **Basic CORS and security middleware**

### Infrastructure

- **Azure App Service** for hosting
- **Azure Database for PostgreSQL** (multi-tenant)
- **Azure Blob Storage** for file storage
- **n8n self-hosted** for workflow automation
- **SendGrid** for email notifications

## MVP Feature Set

### 1. Multi-Tenant Architecture

```csharp
// Tenant model
public class Tenant
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Subdomain { get; set; }
    public string ConnectionString { get; set; }
    public Dictionary<string, string> Settings { get; set; }
    public bool IsActive { get; set; }
}

// Multi-tenant middleware
public class TenantMiddleware
{
    private readonly RequestDelegate _next;

    public async Task InvokeAsync(HttpContext context)
    {
        var tenant = await _tenantService.GetTenantFromRequest(context);
        if (tenant == null)
        {
            context.Response.StatusCode = 404;
            return;
        }

        context.Items["Tenant"] = tenant;
        await _next(context);
    }
}
```

### 2. Role-Based Access Control

```csharp
// User model with roles
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; } // "PetOwner", "Veterinarian", "Nurse", "Receptionist", "Manager", "CEO"
    public Guid TenantId { get; set; }
    public Guid? PracticeId { get; set; } // For multi-practice tenants
}

// Role-based authorization attribute
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequireRoleAttribute : AuthorizeAttribute
{
    public RequireRoleAttribute(params string[] roles)
    {
        Roles = string.Join(",", roles);
    }
}

// Example usage
[RequireRole("Veterinarian", "Nurse")]
public class MedicalRecordsController : ControllerBase
{
    // Controller methods
}
```

### 3. Client & Patient Management

```csharp
// Client model with tenant
public class Client
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public List<Patient> Patients { get; set; }
}

// Patient model with tenant
public class Patient
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid ClientId { get; set; }
    public string Name { get; set; }
    public string Species { get; set; }
    public string Breed { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public decimal? Weight { get; set; }
}
```

### 4. Appointment Scheduling

```csharp
// Appointment model with tenant
public class Appointment
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid PatientId { get; set; }
    public Guid VeterinarianId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Type { get; set; }
    public string Status { get; set; }
    public string Notes { get; set; }
}
```

### 5. Medical Records

```csharp
// Medical record model with tenant
public class MedicalRecord
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid PatientId { get; set; }
    public Guid VeterinarianId { get; set; }
    public DateTime VisitDate { get; set; }
    public string ChiefComplaint { get; set; }
    public string Subjective { get; set; }
    public string Objective { get; set; }
    public string Assessment { get; set; }
    public string Plan { get; set; }
    public string Prescriptions { get; set; }
}
```

### 6. Basic Billing

```csharp
// Invoice model with tenant
public class Invoice
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid AppointmentId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public string Status { get; set; }
    public DateTime CreatedDate { get; set; }
    public List<InvoiceItem> Items { get; set; }
}
```

## MVP Database Schema

```sql
-- Multi-tenant schema
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    subdomain VARCHAR(255) UNIQUE,
    connection_string TEXT,
    settings JSONB,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE practices (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(255),
    settings JSONB
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    practice_id UUID REFERENCES practices(id),
    email VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);

CREATE TABLE clients (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT
);

CREATE TABLE patients (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    client_id UUID REFERENCES clients(id),
    name VARCHAR(100),
    species VARCHAR(50),
    breed VARCHAR(100),
    date_of_birth DATE,
    weight DECIMAL
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    patient_id UUID REFERENCES patients(id),
    veterinarian_id UUID REFERENCES users(id),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(50),
    type VARCHAR(50),
    notes TEXT
);

CREATE TABLE medical_records (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    patient_id UUID REFERENCES patients(id),
    veterinarian_id UUID REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    visit_date TIMESTAMP,
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    prescriptions TEXT
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    appointment_id UUID REFERENCES appointments(id),
    total_amount DECIMAL,
    paid_amount DECIMAL,
    status VARCHAR(50),
    created_date TIMESTAMP
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id),
    description VARCHAR(255),
    quantity DECIMAL,
    unit_price DECIMAL,
    total_price DECIMAL
);
```

## Role-Based Access Matrix

| Feature                  | Pet Owner | Veterinarian | Nurse | Receptionist | Manager | CEO |
| ------------------------ | --------- | ------------ | ----- | ------------ | ------- | --- |
| View own pets            | ✓         | ✓            | ✓     | ✓            | ✓       | ✓   |
| View all pets            | -         | ✓            | ✓     | ✓            | ✓       | ✓   |
| Create appointments      | ✓         | ✓            | ✓     | ✓            | ✓       | ✓   |
| View appointments        | ✓         | ✓            | ✓     | ✓            | ✓       | ✓   |
| Create medical records   | -         | ✓            | ✓     | -            | -       | -   |
| View medical records     | ✓         | ✓            | ✓     | ✓            | ✓       | ✓   |
| Create invoices          | -         | ✓            | -     | ✓            | ✓       | ✓   |
| View invoices            | ✓         | ✓            | ✓     | ✓            | ✓       | ✓   |
| Manage users             | -         | -            | -     | -            | ✓       | ✓   |
| View reports             | -         | ✓            | ✓     | ✓            | ✓       | ✓   |
| Manage practice settings | -         | -            | -     | -            | ✓       | ✓   |

## MVP Development Timeline

### Month 1: Foundation

- Set up multi-tenant architecture
- Implement role-based access control
- Basic authentication system
- Database schema and migrations
- Client/Patient CRUD operations

### Month 2: Core Features

- Appointment scheduling
- Basic calendar interface
- Medical records (SOAP notes)
- Simple search functionality
- Initial n8n workflows

### Month 3: Integration & Polish

- Basic Animana data import
- Invoice generation
- Email notifications via n8n
- User testing with partner clinic
- Bug fixes and UI improvements

### Month 4: Deployment & Launch

- Azure deployment setup
- Security hardening
- Performance testing
- Documentation
- First customer onboarding

## MVP Success Metrics

### Functional Metrics

- Complete appointment workflow (book → consult → bill)
- Data migration from Animana successful
- All core features working reliably
- Less than 5 critical bugs
- Proper multi-tenant isolation
- Role-based access working correctly

### Performance Metrics

- Page load time < 3 seconds
- Search results < 1 second
- System available 99% of time
- Can handle 20 concurrent users per tenant
- Proper tenant isolation

### User Metrics

- Staff can complete tasks without training
- Positive feedback from pilot clinic
- 80% of daily tasks supported
- Less than 10 support tickets in first month
- Clear role-based interfaces

## Post-MVP Roadmap

### Phase 1 (Months 5-6): Stability & Polish

- Performance optimizations
- Enhanced error handling
- Improved UI/UX based on feedback
- Basic reporting features
- Advanced multi-tenant features

### Phase 2 (Months 7-8): Enhanced Features

- Advanced scheduling
- Inventory management basics
- Enhanced search capabilities
- Advanced tenant management

### Phase 3 (Months 9-10): Advanced Capabilities

- Real-time notifications
- AI integration for SOAP notes
- Enhanced client portal
- Mobile responsiveness improvements

### Phase 4 (Months 11-12): Enterprise Features

- Advanced reporting and analytics
- API for third-party integrations
- Enhanced security features
- Performance monitoring
- Advanced tenant analytics

## MVP Cost Structure

### Development Costs (4 months)

- Solo developer time: $0 (founder equity)
- UI/UX contractor (part-time): $5,000
- Testing & QA: $2,000
- **Total Development**: $7,000

### Infrastructure Costs (Monthly)

- Azure App Service: ~$50
- Azure Database for PostgreSQL: ~$100
- Azure Blob Storage: ~$20
- n8n hosting: ~$30
- SendGrid: ~$15
- SSL Certificate: ~$10
- **Total Monthly**: ~$225

### Tools & Services

- Development tools (VS Code, etc.): Free
- GitHub (private repos): $4/month
- Monitoring (basic): Free tier
- **Total Tools**: ~$4/month

### Marketing & Sales (Initial)

- Website: $500
- Initial marketing materials: $1,000
- Demo environment: $200
- **Total Marketing**: $1,700

**Total MVP Budget**: ~$9,000 + $229/month

## Risk Mitigation

### Technical Risks

- **Animana API limitations**: Use n8n for flexible integration
- **Performance issues**: Start with simple architecture, optimize later
- **Data migration errors**: Manual verification for first customers

### Business Risks

- **Slow adoption**: Focus on one pilot clinic for feedback
- **Feature creep**: Strict MVP scope management
- **Competition**: Fast iteration based on user feedback

### Mitigation Strategies

1. Weekly progress reviews
2. Direct customer feedback loop
3. Incremental feature releases
4. Conservative infrastructure scaling

## MVP Development Principles

1. **YAGNI** (You Aren't Gonna Need It): Build only what's needed now
2. **KISS** (Keep It Simple, Stupid): Simplest solution that works
3. **Iterate Fast**: Release early, get feedback, improve
4. **Customer Focus**: Direct line to pilot customers
5. **Technical Debt is OK**: Document it, plan to address it later

## Conclusion

This MVP design provides a realistic path to launch VetPMS within 4 months with minimal budget. By leveraging:

- Simple monolithic architecture
- n8n for automation instead of custom code
- Basic Azure services
- Proven technologies (ASP.NET Core, React)

We can deliver a functional veterinary PMS that solves core problems for our first paying customer, while laying the foundation for future growth and architectural improvements.
