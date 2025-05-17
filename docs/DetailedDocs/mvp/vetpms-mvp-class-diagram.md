# VetPMS MVP Class Diagram

This simplified class diagram represents the MVP domain model, focusing only on essential entities and relationships needed for the minimum viable product.

```mermaid
classDiagram
    %% Core User and Practice
    class User {
        +Guid Id
        +string Email
        +string PasswordHash
        +string FirstName
        +string LastName
        +string Role
        +Guid PracticeId
        +bool IsActive
        +DateTime CreatedAt
    }

    class Practice {
        +Guid Id
        +string Name
        +JsonDocument Settings
        +DateTime CreatedAt
    }

    %% Client and Patient Management
    class Client {
        +Guid Id
        +Guid PracticeId
        +string FirstName
        +string LastName
        +string Email
        +string Phone
        +string Address
        +DateTime CreatedAt
        +DateTime UpdatedAt
    }

    class Patient {
        +Guid Id
        +Guid ClientId
        +string Name
        +string Species
        +string Breed
        +DateTime? DateOfBirth
        +decimal? Weight
        +DateTime CreatedAt
        +DateTime UpdatedAt
    }

    %% Appointments
    class Appointment {
        +Guid Id
        +Guid PracticeId
        +Guid PatientId
        +Guid VeterinarianId
        +DateTime StartTime
        +DateTime EndTime
        +string Type
        +string Status
        +string Notes
        +DateTime CreatedAt
        +DateTime UpdatedAt
    }

    %% Medical Records
    class MedicalRecord {
        +Guid Id
        +Guid PatientId
        +Guid VeterinarianId
        +Guid? AppointmentId
        +DateTime VisitDate
        +string ChiefComplaint
        +string Subjective
        +string Objective
        +string Assessment
        +string Plan
        +string Prescriptions
        +DateTime CreatedAt
        +DateTime UpdatedAt
    }

    %% Billing
    class Invoice {
        +Guid Id
        +Guid AppointmentId
        +decimal TotalAmount
        +decimal PaidAmount
        +string Status
        +DateTime CreatedDate
        +DateTime UpdatedDate
    }

    class InvoiceItem {
        +Guid Id
        +Guid InvoiceId
        +string Description
        +decimal Quantity
        +decimal UnitPrice
        +decimal TotalPrice
    }

    %% Relationships
    Practice "1" -- "*" User : has
    Practice "1" -- "*" Client : has
    Client "1" -- "*" Patient : owns
    Practice "1" -- "*" Appointment : has
    Patient "1" -- "*" Appointment : has
    User "1" -- "*" Appointment : handles
    Patient "1" -- "*" MedicalRecord : has
    User "1" -- "*" MedicalRecord : creates
    Appointment "1" -- "0..1" MedicalRecord : generates
    Appointment "1" -- "0..1" Invoice : generates
    Invoice "1" -- "*" InvoiceItem : contains
```

## Key Differences from Full System

The MVP class diagram simplifies the architecture by:

1. **Removing Multi-tenant Hierarchy**: No franchise/department structure, just single practice
2. **Simplifying User Management**: Single role per user instead of complex role-permission system
3. **Basic Medical Records**: Text-based prescriptions instead of complex prescription management
4. **Simplified Appointments**: No resource management or complex scheduling
5. **No Integration Framework**: Direct database operations instead of integration hub
6. **Basic Billing**: Simple invoice structure without complex payment processing

## MVP Entity Details

### User
- Simple authentication with email/password
- Single role (Admin, Veterinarian, Receptionist)
- Belongs to one practice

### Practice
- Basic settings stored as JSON
- No multi-location support

### Client
- Basic contact information
- Can have multiple patients

### Patient
- Essential demographics only
- Weight as simple decimal value

### Appointment
- Basic scheduling with start/end times
- Simple status tracking
- No resource allocation

### MedicalRecord
- SOAP format stored as text fields
- Prescriptions as simple text
- Optional link to appointment

### Invoice
- Simple invoice with line items
- Basic status tracking
- Manual payment recording

## Data Access Patterns

The MVP uses a simple repository pattern with Entity Framework Core:

```csharp
public interface IRepository<T> where T : class
{
    Task<T> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
}

public class AppointmentRepository : IRepository<Appointment>
{
    private readonly ApplicationDbContext _context;

    public async Task<IEnumerable<Appointment>> GetByDateAsync(DateTime date)
    {
        return await _context.Appointments
            .Where(a => a.StartTime.Date == date.Date)
            .Include(a => a.Patient)
            .OrderBy(a => a.StartTime)
            .ToListAsync();
    }
}
```

This simplified architecture allows for rapid development while providing a foundation for future expansion to the full system architecture.
