# VetPMS MVP System Design

**Version**: 1.0  
**Last Updated**: May 2025  
**Purpose**: Define minimum viable product for first paying customer

## Overview

This document outlines the Minimum Viable Product (MVP) for VetPMS PMS, focusing on essential features needed to acquire our first paying customer. The MVP prioritizes simplicity and rapid deployment over architectural complexity.

## MVP Core Principle: Build Only What's Essential

The MVP delivers core veterinary practice functionality with minimal complexity, prioritizing speed to market over architectural perfection.

## MVP Technology Stack

### Simplified Stack for Rapid Development

#### Frontend

- **React** with TypeScript (basic setup, no complex state management)
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Router** for navigation
- **Shadcn/ui** for UI components (pre-built, accessible)

#### Backend

- **ASP.NET Core 8** (monolithic API, no microservices)
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** (simple implementation)
- **Basic CORS and security middleware**

#### Infrastructure (Minimal)

- **Azure App Service** for hosting (single instance)
- **Azure Database for PostgreSQL** (single instance)
- **Azure Blob Storage** for file storage
- **n8n self-hosted** for workflow automation
- **SendGrid** for email notifications

### What We're NOT Building for MVP

❌ Microservices architecture  
❌ Kubernetes orchestration  
❌ Complex multi-tenant hierarchy  
❌ AI integration (beyond basic n8n workflows)  
❌ Real-time features (SignalR)  
❌ Advanced caching strategies  
❌ Mobile app  
❌ Offline functionality  
❌ Advanced reporting  
❌ Complex role hierarchies

## MVP Feature Set

### 1. User Management & Authentication

```csharp
// Simple user model
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; } // "Admin", "Veterinarian", "Receptionist"
    public Guid PracticeId { get; set; }
}

// Basic authentication controller
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userService.ValidateCredentialsAsync(dto.Email, dto.Password);
        if (user == null) return Unauthorized();

        var token = _tokenService.GenerateToken(user);
        return Ok(new { token, user });
    }
}
```

**Features:**

- Simple email/password login
- Basic role support (Admin, Veterinarian, Receptionist)
- Single practice per deployment
- Password reset via email

### 2. Client & Patient Management

```csharp
// Simplified client model
public class Client
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public List<Patient> Patients { get; set; }
}

// Simplified patient model
public class Patient
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public string Name { get; set; }
    public string Species { get; set; }
    public string Breed { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public decimal? Weight { get; set; }
}
```

**Features:**

- Add/edit/view clients
- Multiple pets per client
- Basic search by name/phone
- Simple patient medical history (list view)

### 3. Appointment Scheduling

```csharp
// Simple appointment model
public class Appointment
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid VeterinarianId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Type { get; set; }
    public string Status { get; set; } // "Scheduled", "Completed", "Cancelled"
    public string Notes { get; set; }
}
```

**Features:**

- Calendar view (week/day only)
- Create/edit/cancel appointments
- Basic time slot management (30-min slots)
- Simple resource allocation (vet + room)
- Email reminders via n8n

### 4. Medical Records

```csharp
// Simplified medical record
public class MedicalRecord
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid VeterinarianId { get; set; }
    public DateTime VisitDate { get; set; }
    public string ChiefComplaint { get; set; }
    public string Subjective { get; set; }
    public string Objective { get; set; }
    public string Assessment { get; set; }
    public string Plan { get; set; }
    public string Prescriptions { get; set; } // Simple text field
}
```

**Features:**

- Create consultation notes
- Basic SOAP format
- Text-based prescriptions
- Simple document upload
- Print functionality

### 5. Basic Billing

```csharp
// Simplified invoice model
public class Invoice
{
    public Guid Id { get; set; }
    public Guid AppointmentId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public string Status { get; set; } // "Draft", "Sent", "Paid"
    public DateTime CreatedDate { get; set; }
    public List<InvoiceItem> Items { get; set; }
}
```

**Features:**

- Create basic invoices
- Mark as paid/unpaid
- Simple payment recording
- Basic PDF generation
- Email invoice option

## MVP Database Schema

```sql
-- Simplified schema for MVP
CREATE TABLE practices (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    settings JSONB
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    practice_id UUID REFERENCES practices(id),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);

CREATE TABLE clients (
    id UUID PRIMARY KEY,
    practice_id UUID REFERENCES practices(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT
);

CREATE TABLE patients (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    name VARCHAR(100),
    species VARCHAR(50),
    breed VARCHAR(100),
    date_of_birth DATE,
    weight DECIMAL
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    practice_id UUID REFERENCES practices(id),
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

## n8n Automation Workflows

Instead of coding complex automation, we leverage n8n for MVP:

### 1. Appointment Reminders

```json
{
  "name": "Appointment Reminder",
  "nodes": [
    {
      "name": "Daily Trigger",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "item": [{ "hour": 8, "minute": 0 }]
        }
      }
    },
    {
      "name": "Get Tomorrow's Appointments",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM appointments WHERE date(start_time) = CURRENT_DATE + 1"
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "subject": "Appointment Reminder",
        "text": "Dear {{client_name}}, this is a reminder for {{pet_name}}'s appointment tomorrow at {{appointment_time}}."
      }
    }
  ]
}
```

### 2. Follow-up Communications

```json
{
  "name": "Post-Visit Follow-up",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "consultation-completed"
      }
    },
    {
      "name": "Wait 24 Hours",
      "type": "n8n-nodes-base.wait",
      "parameters": {
        "amount": 24,
        "unit": "hours"
      }
    },
    {
      "name": "Send Follow-up Email",
      "type": "n8n-nodes-base.emailSend"
    }
  ]
}
```

### 3. Basic Animana Sync

```json
{
  "name": "Animana Data Sync",
  "nodes": [
    {
      "name": "Every 15 Minutes",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "item": [{ "minutes": 15 }]
        }
      }
    },
    {
      "name": "Get Animana Updates",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.animana.com/v2/updates",
        "authentication": "oAuth2"
      }
    },
    {
      "name": "Update Local Database",
      "type": "n8n-nodes-base.postgres"
    }
  ]
}
```

## MVP API Structure (Monolithic)

````csharp
// Simple, controller-based architecture
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    [HttpGet]
    public async Task<IActionResult> GetAppointments([FromQuery] DateTime date)
    {
        var appointments = await _context.Appointments
            .Include(a => a.Patient)
            .ThenInclude(p => p.Client)
            .Where(a => a.StartTime.Date == date.Date)
            .OrderBy(a => a.StartTime)
            .ToListAsync();

        return Ok(appointments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var appointment = new Appointment
        {
            PatientId = dto.PatientId,
            VeterinarianId = dto.VeterinarianId,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Type = dto.Type,
            Status = "Scheduled",
            Notes = dto.Notes
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return Ok(appointment);
    }
}

// Simple service pattern (no CQRS for MVP)
public class AppointmentService
{
    private readonly ApplicationDbContext _context;

    public async Task<List<TimeSlot>> GetAvailableSlots(DateTime date, Guid veterinarianId)
    {
        var existingAppointments = await _context.Appointments
            .Where(a => a.StartTime.Date == date.Date &&
                       a.VeterinarianId == veterinarianId &&
                       a.Status != "Cancelled")
            .ToListAsync();

        var slots = new List<TimeSlot>();
        var startTime = date.Date.AddHours(9); // 9 AM
        var endTime = date.Date.AddHours(17); // 5 PM

        while (startTime < endTime)
        {
            var slotEnd = startTime.AddMinutes(30);

            if (!existingAppointments.Any(a =>
                (a.StartTime < slotEnd && a.EndTime > startTime)))
            {
                slots.Add(new TimeSlot { Start = startTime, End = slotEnd });
            }

            startTime = slotEnd;
        }

        return slots;
    }
}

## MVP Frontend Structure

### Simple React Setup

```typescript
// App.tsx - Simple routing structure
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="patients/:id" element={<PatientDetailPage />} />
          <Route path="medical-records/new" element={<NewMedicalRecordPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Simple dashboard component
const Dashboard: React.FC = () => {
  const { data: todayAppointments } = useQuery(['appointments', 'today'],
    () => appointmentService.getTodayAppointments());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Today's Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayAppointments?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => navigate('/appointments/new')}>
                New Appointment
              </Button>
              <Button className="w-full" onClick={() => navigate('/clients/new')}>
                New Client
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        <AppointmentList appointments={todayAppointments} />
      </div>
    </div>
  );
};

// Simple appointment calendar
const AppointmentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: appointments } = useQuery(['appointments', selectedDate],
    () => appointmentService.getAppointmentsByDate(selectedDate));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button onClick={() => navigate('/appointments/new')}>
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent>
            <DaySchedule date={selectedDate} appointments={appointments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
````

## MVP Deployment Architecture

### Simple Azure Setup

```
[React Frontend] → [Azure Static Web Apps]
        ↓
[ASP.NET Core API] → [Azure App Service]
        ↓
[PostgreSQL] → [Azure Database for PostgreSQL]
        ↓
[n8n Workflows] → [Azure Container Instance]
        ↓
[File Storage] → [Azure Blob Storage]
```

### Deployment Configuration

```yaml
# Simple Docker Compose for local development
version: "3.8"
services:
  api:
    build: ./backend
    ports:
      - "5000:80"
    environment:
      - ConnectionStrings__DefaultConnection=Host=db;Database=VetPMS;Username=postgres;Password=postgres
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=VetPMS
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  n8n_data:
```

## MVP Development Timeline

### Month 1: Foundation

- ✅ Set up development environment
- ✅ Basic authentication system
- ✅ Database schema and migrations
- ✅ Client/Patient CRUD operations
- ✅ Simple UI framework

### Month 2: Core Features

- ✅ Appointment scheduling
- ✅ Basic calendar interface
- ✅ Medical records (SOAP notes)
- ✅ Simple search functionality
- ✅ Initial n8n workflows

### Month 3: Integration & Polish

- ✅ Basic Animana data import
- ✅ Invoice generation
- ✅ Email notifications via n8n
- ✅ User testing with partner clinic
- ✅ Bug fixes and UI improvements

### Month 4: Deployment & Launch

- ✅ Azure deployment setup
- ✅ Security hardening
- ✅ Performance testing
- ✅ Documentation
- ✅ First customer onboarding

## Minimum Viable Clinic Requirements

### Staff Roles Needed

- **Practice Admin**: System setup and user management (1 person)
- **Veterinarian(s)**: Medical records and consultations (1-3 people)
- **Receptionist**: Appointments and client management (1-2 people)

### Basic Workflows Supported

1. **Client Registration**: Add new clients and pets
2. **Appointment Booking**: Schedule and manage appointments
3. **Consultation**: Record medical notes and prescriptions
4. **Billing**: Generate and track invoices
5. **Follow-up**: Basic reminder system via n8n

### Technical Requirements

- Modern web browser (Chrome, Firefox, Safari)
- Stable internet connection
- Email access for notifications
- PDF reader for invoices/reports

## MVP Success Metrics

### Functional Metrics

- ✅ Complete appointment workflow (book → consult → bill)
- ✅ Data migration from Animana successful
- ✅ All core features working reliably
- ✅ Less than 5 critical bugs

### Performance Metrics

- ✅ Page load time < 3 seconds
- ✅ Search results < 1 second
- ✅ System available 99% of time
- ✅ Can handle 20 concurrent users

### User Metrics

- ✅ Staff can complete tasks without training
- ✅ Positive feedback from pilot clinic
- ✅ 80% of daily tasks supported
- ✅ Less than 10 support tickets in first month

## Post-MVP Roadmap

### Phase 1 (Months 5-6): Stability & Polish

- Performance optimizations
- Enhanced error handling
- Improved UI/UX based on feedback
- Basic reporting features

### Phase 2 (Months 7-8): Enhanced Features

- Multi-practice support
- Advanced scheduling (resource management)
- Inventory management basics
- Enhanced search capabilities

### Phase 3 (Months 9-10): Advanced Capabilities

- Real-time notifications (SignalR)
- AI integration for SOAP notes
- Client portal
- Mobile responsiveness improvements

### Phase 4 (Months 11-12): Enterprise Features

- Advanced reporting and analytics
- API for third-party integrations
- Enhanced security features
- Performance monitoring

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
