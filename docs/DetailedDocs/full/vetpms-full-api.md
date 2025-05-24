# VetPMS Full API Documentation

## Overview

This document provides comprehensive API documentation for the complete VetPMS system, including all features beyond the MVP. The API is built on ASP.NET Core 8 following Clean Architecture principles with CQRS pattern.

## Base URL

```
https://api.vetpms.com/v1
```

## Authentication

VetPMS uses JWT (JSON Web Tokens) with OAuth 2.0 for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password",
  "tenantId": "tenant_123" // Optional for multi-tenant users
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "abc123...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": [
      {
        "tenantId": "tenant_123",
        "roleName": "Veterinarian"
      }
    ],
    "permissions": ["patients:read", "patients:write", ...]
  }
}
```

#### Role Selection
```http
POST /auth/select-role
Content-Type: application/json

{
  "tenantId": "tenant_123",
  "roleId": "role_456"
}
```

## API Sections

### 1. Multi-Tenant Management

#### List Tenants
```http
GET /tenants
```

Query Parameters:
- `type` (optional): Filter by tenant type (FRANCHISE, PRACTICE, DEPARTMENT)
- `parentId` (optional): Filter by parent tenant
- `page` (optional): Page number
- `pageSize` (optional): Items per page

#### Create Tenant
```http
POST /tenants
Content-Type: application/json

{
  "name": "Downtown Veterinary Clinic",
  "type": "PRACTICE",
  "parentTenantId": "franchise_123",
  "settings": {
    "timezone": "America/New_York",
    "defaultLanguage": "en",
    "currencyCode": "USD"
  }
}
```

### 2. User & Role Management

#### Create User
```http
POST /users
Content-Type: application/json

{
  "email": "vet@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1234567890",
  "tenantRoles": [
    {
      "tenantId": "tenant_123",
      "roleId": "role_veterinarian"
    }
  ]
}
```

#### Assign Role
```http
POST /users/{userId}/roles
Content-Type: application/json

{
  "tenantId": "tenant_123",
  "roleId": "role_456"
}
```

### 3. Advanced Patient Management

#### Search Patients
```http
GET /patients/search
```

Query Parameters:
- `query` (required): Search term
- `includeArchived` (optional): Include inactive patients
- `tenantId` (optional): Search within specific tenant

Response includes relevance scoring and highlights.

#### Patient Medical History
```http
GET /patients/{patientId}/history
```

Returns comprehensive medical history with timeline view.

### 4. Intelligent Scheduling

#### Get Smart Schedule Suggestions
```http
POST /appointments/suggest
Content-Type: application/json

{
  "patientId": "patient_123",
  "appointmentTypeId": "type_456",
  "preferredDateRange": {
    "start": "2025-05-01",
    "end": "2025-05-15"
  },
  "preferredTimeSlots": ["morning", "afternoon"]
}
```

#### Check Resource Availability
```http
POST /appointments/check-availability
Content-Type: application/json

{
  "startTime": "2025-05-02T09:00:00Z",
  "endTime": "2025-05-02T10:00:00Z",
  "requiredResources": ["room_exam1", "vet_123", "tech_456"]
}
```

### 5. Medical Records with AI

#### Generate SOAP Note
```http
POST /medical-records/generate-soap
Content-Type: application/json

{
  "patientId": "patient_123",
  "visitData": {
    "chiefComplaint": "Vomiting for 2 days",
    "symptoms": ["lethargy", "decreased appetite"],
    "vitalSigns": {
      "temperature": 102.5,
      "heartRate": 120,
      "respiratoryRate": 24
    }
  }
}
```

Response:
```json
{
  "soapNote": {
    "subjective": "Patient presented with 2-day history of vomiting...",
    "objective": "T: 102.5°F, HR: 120 bpm, RR: 24 bpm...",
    "assessment": "Possible gastroenteritis, rule out foreign body...",
    "plan": "1. Radiographs recommended\n2. Start on bland diet..."
  },
  "confidence": 0.92,
  "suggestedDiagnoses": [
    {
      "diagnosis": "Gastroenteritis",
      "probability": 0.75
    },
    {
      "diagnosis": "Foreign body obstruction",
      "probability": 0.15
    }
  ]
}
```

### 6. Inventory Management

#### Track Inventory
```http
GET /inventory
```

Query Parameters:
- `location` (optional): Filter by location
- `category` (optional): Filter by category
- `lowStock` (optional): Show only low stock items

#### Process Stock Transaction
```http
POST /inventory/transactions
Content-Type: application/json

{
  "itemId": "item_123",
  "quantity": -1,
  "transactionType": "DISPENSED",
  "referenceId": "prescription_456",
  "notes": "Dispensed for patient Max"
}
```

### 7. Financial Management

#### Generate Financial Report
```http
POST /reports/financial
Content-Type: application/json

{
  "reportType": "REVENUE_ANALYSIS",
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-03-31"
  },
  "groupBy": "MONTH",
  "includeComparison": true
}
```

#### Process Payment
```http
POST /payments
Content-Type: application/json

{
  "invoiceId": "invoice_123",
  "amount": 150.00,
  "paymentMethod": "CREDIT_CARD",
  "paymentDetails": {
    "cardToken": "tok_visa",
    "cardLast4": "4242"
  }
}
```

### 8. Communication Hub

#### Send Client Communication
```http
POST /communications/send
Content-Type: application/json

{
  "recipientType": "CLIENT",
  "recipientId": "client_123",
  "templateId": "appointment_reminder",
  "channel": ["EMAIL", "SMS"],
  "variables": {
    "appointmentDate": "2025-05-02",
    "appointmentTime": "09:00 AM",
    "petName": "Max"
  }
}
```

### 9. Integration Management

#### List Available Integrations
```http
GET /integrations
```

#### Configure Integration
```http
POST /integrations/{integrationId}/configure
Content-Type: application/json

{
  "credentials": {
    "apiKey": "key_123",
    "apiSecret": "secret_456"
  },
  "settings": {
    "syncInterval": 15,
    "enabledEntities": ["patients", "appointments"]
  }
}
```

#### Trigger Sync
```http
POST /integrations/{integrationId}/sync
Content-Type: application/json

{
  "entityType": "PATIENTS",
  "direction": "IMPORT",
  "since": "2025-05-01T00:00:00Z"
}
```

### 10. Analytics & Reporting

#### Get Practice Analytics
```http
GET /analytics/practice
```

Query Parameters:
- `metrics` (required): Comma-separated list of metrics
- `dateRange` (required): Date range for analysis
- `groupBy` (optional): Grouping dimension

Response:
```json
{
  "metrics": {
    "appointmentsPerDay": 24.5,
    "averageVisitDuration": 32,
    "revenuePerVisit": 125.50,
    "clientRetentionRate": 0.85
  },
  "trends": [
    {
      "date": "2025-05-01",
      "appointments": 26,
      "revenue": 3265.00
    }
  ]
}
```

## Webhooks

Configure webhooks to receive real-time notifications:

```http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["appointment.created", "patient.updated"],
  "secret": "webhook_secret_123"
}
```

Supported events:
- `appointment.*` - Appointment lifecycle events
- `patient.*` - Patient record changes
- `invoice.*` - Financial events
- `inventory.*` - Stock level changes
- `integration.*` - Integration status updates

## Rate Limiting

API requests are limited based on your subscription tier:

- **Basic**: 1,000 requests/hour
- **Professional**: 10,000 requests/hour
- **Enterprise**: Custom limits

Rate limit headers:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## GraphQL API

VetPMS also offers a GraphQL API for flexible data querying:

```graphql
query GetPatientDetails($patientId: ID!) {
  patient(id: $patientId) {
    id
    name
    species
    breed
    medicalHistory {
      records {
        id
        visitDate
        diagnosis
        veterinarian {
          name
        }
      }
    }
    upcomingAppointments {
      id
      startTime
      appointmentType
    }
  }
}
```

## SDKs and Client Libraries

Official SDKs available for:
- C#/.NET
- JavaScript/TypeScript
- Python
- Java
- PHP

Example using the C# SDK:
```csharp
var client = new VetPMSClient(apiKey);
var appointments = await client.Appointments.ListAsync(
    date: DateTime.Today,
    status: AppointmentStatus.Scheduled
);
```

## API Versioning

The API uses URL versioning. Always specify the version in your requests:
- Current version: `v1`
- Legacy support: Version `v1` will be supported for 24 months after `v2` release

## Error Responses

Standard error response format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "traceId": "abc123xyz"
  }
}
```

Error codes:
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTEGRATION_ERROR` - External system error
- `INTERNAL_ERROR` - Server error

## API Health & Status

Check API health:
```http
GET /health
```

Get API status and metrics:
```http
GET /status
```

## Contact & Support

For API support:
- Email: api-support@vetpms.com
- Developer Portal: https://developers.vetpms.com
- Status Page: https://status.vetpms.com
