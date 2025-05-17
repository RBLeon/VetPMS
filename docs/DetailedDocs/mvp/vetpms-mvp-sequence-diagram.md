# VetPMS MVP Sequence Diagram

This sequence diagram shows the simplified interaction flow for the MVP version of VetPMS, focusing on core functionality without complex multi-tenancy or role switching.

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React Frontend
    participant API as ASP.NET Core API
    participant DB as PostgreSQL
    participant N8N as n8n Workflows
    
    %% Simple Authentication Flow
    Note over U,DB: Simple Authentication (No Multi-tenant)
    U->>UI: Access login page
    U->>UI: Enter credentials
    UI->>API: POST /auth/login
    API->>DB: Validate credentials
    DB-->>API: User data + role
    API-->>UI: JWT token + user info
    UI->>UI: Store token, redirect to dashboard
    UI-->>U: Show role-based dashboard
    
    %% Basic Appointment Creation
    Note over U,DB: Create Appointment (No Resource Management)
    U->>UI: Click "New Appointment"
    UI->>API: GET /patients (for dropdown)
    API->>DB: Query patients
    DB-->>API: Patient list
    API-->>UI: Patient data
    UI-->>U: Show appointment form
    
    U->>UI: Fill appointment details
    UI->>API: POST /appointments
    API->>DB: Check time slot availability
    DB-->>API: Slot available
    API->>DB: Insert appointment
    DB-->>API: Appointment created
    API-->>UI: Success response
    UI-->>U: Show confirmation
    
    %% Automated Reminder via n8n
    Note over API,N8N: Daily Reminder Workflow
    N8N->>DB: Query tomorrow's appointments
    DB-->>N8N: Appointment list
    N8N->>N8N: Process each appointment
    N8N->>External: Send email via SendGrid
    External-->>N8N: Email sent confirmation
    
    %% Simple Medical Record Creation
    Note over U,DB: Create Medical Record (Basic SOAP)
    U->>UI: Open patient record
    UI->>API: GET /patients/{id}
    API->>DB: Query patient details
    DB-->>API: Patient data
    API-->>UI: Patient info
    UI-->>U: Show patient details
    
    U->>UI: Click "New Medical Record"
    UI-->>U: Show SOAP form
    U->>UI: Fill SOAP fields
    UI->>API: POST /medical-records
    API->>DB: Insert medical record
    DB-->>API: Record created
    API-->>UI: Success response
    UI-->>U: Show confirmation
    
    %% Basic Invoice Generation
    Note over U,DB: Generate Invoice (Manual Process)
    U->>UI: Complete appointment
    UI->>UI: Show "Generate Invoice" button
    U->>UI: Click generate invoice
    UI->>API: POST /invoices
    API->>DB: Create invoice with items
    DB-->>API: Invoice created
    API-->>UI: Invoice data
    UI-->>U: Show invoice preview
    
    U->>UI: Click "Send Invoice"
    UI->>API: POST /invoices/{id}/send
    API->>External: Send email with PDF
    External-->>API: Email sent
    API-->>UI: Success response
    UI-->>U: Show confirmation
```

## Key Differences from Full System

### Authentication
- **MVP**: Simple login with single role per user
- **Full**: Multi-tenant with role selection and complex permissions

### Appointment Management
- **MVP**: Basic time slot checking, no resource management
- **Full**: Intelligent scheduling with resource allocation and conflict resolution

### Medical Records
- **MVP**: Simple SOAP note with text fields
- **Full**: AI-assisted documentation with structured data

### Integration
- **MVP**: Basic n8n workflows for automation
- **Full**: Complex integration hub with multiple connectors

### Client Communication
- **MVP**: Simple email notifications via n8n
- **Full**: Multi-channel communication with templates and tracking

## MVP User Flows

### 1. Daily Workflow for Receptionist
```mermaid
sequenceDiagram
    participant R as Receptionist
    participant UI as VetPMS
    participant API as Backend
    
    R->>UI: Login
    UI->>UI: Show dashboard
    R->>UI: View today's appointments
    UI->>API: GET /appointments?date=today
    API-->>UI: Appointment list
    
    Note over R,API: Client Check-in
    R->>UI: Mark appointment as "Checked In"
    UI->>API: PUT /appointments/{id}
    API-->>UI: Updated status
    
    Note over R,API: New Client Registration
    R->>UI: Click "New Client"
    R->>UI: Fill client form
    UI->>API: POST /clients
    API-->>UI: Client created
    
    R->>UI: Add patient for client
    UI->>API: POST /patients
    API-->>UI: Patient created
```

### 2. Veterinarian Consultation Flow
```mermaid
sequenceDiagram
    participant V as Veterinarian
    participant UI as VetPMS
    participant API as Backend
    
    V->>UI: View appointment details
    UI->>API: GET /appointments/{id}
    API-->>UI: Appointment with patient info
    
    V->>UI: Open patient record
    UI->>API: GET /patients/{id}/medical-records
    API-->>UI: Medical history
    
    V->>UI: Create new SOAP note
    V->>UI: Fill examination details
    UI->>API: POST /medical-records
    API-->>UI: Record saved
    
    V->>UI: Complete appointment
    UI->>API: PUT /appointments/{id}/complete
    API-->>UI: Status updated
```

### 3. n8n Automation Flows
```mermaid
sequenceDiagram
    participant N8N as n8n
    participant DB as Database
    participant Email as Email Service
    
    Note over N8N,Email: Daily Appointment Reminders
    N8N->>N8N: Trigger at 8 AM daily
    N8N->>DB: SELECT appointments WHERE date = tomorrow
    DB-->>N8N: Tomorrow's appointments
    
    loop For each appointment
        N8N->>DB: Get client contact info
        DB-->>N8N: Client email/phone
        N8N->>Email: Send reminder email
        Email-->>N8N: Sent confirmation
    end
    
    Note over N8N,Email: Post-Visit Follow-up
    N8N->>N8N: Webhook trigger on appointment completion
    N8N->>N8N: Wait 24 hours
    N8N->>Email: Send follow-up email
    Email-->>N8N: Sent confirmation
```

## MVP Architecture Overview

```mermaid
graph TD
    subgraph "Frontend"
        UI[React App]
        Auth[Auth Context]
        API_Client[API Client]
    end
    
    subgraph "Backend"
        API[ASP.NET Core API]
        Services[Business Services]
        Repos[Repositories]
    end
    
    subgraph "Data"
        DB[(PostgreSQL)]
        Cache[(Redis Cache)]
    end
    
    subgraph "Automation"
        N8N[n8n Workflows]
        Email[SendGrid]
    end
    
    UI --> Auth
    UI --> API_Client
    API_Client --> API
    API --> Services
    Services --> Repos
    Repos --> DB
    API --> Cache
    N8N --> DB
    N8N --> Email
    API --> Email
```

This simplified architecture focuses on delivering core functionality quickly while laying the foundation for future enhancements.
