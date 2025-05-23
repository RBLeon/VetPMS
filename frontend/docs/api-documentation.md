# VetPMS API Documentation

**Version**: 2.0  
**Last Updated**: May 2025  
**Base URL**: `https://api.vetpms.com/v1`

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [API Conventions](#api-conventions)
4. [Core Endpoints (MVP)](#core-endpoints)
   - [Clients](#clients)
   - [Patients](#patients)
   - [Appointments](#appointments)
   - [Medical Records](#medical-records)
   - [Invoices](#invoices)
5. [Advanced Endpoints](#advanced-endpoints)
   - [Multi-Tenant Management](#multi-tenant-management)
   - [User & Role Management](#user--role-management)
   - [Advanced Patient Management](#advanced-patient-management)
   - [Intelligent Scheduling](#intelligent-scheduling)
   - [Medical Records with AI](#medical-records-with-ai)
   - [Inventory Management](#inventory-management)
   - [Financial Management](#financial-management)
   - [Communication Hub](#communication-hub)
   - [Integration Management](#integration-management)
   - [Analytics & Reporting](#analytics--reporting)
6. [Webhooks](#webhooks)
7. [GraphQL API](#graphql-api)
8. [Client Libraries](#client-libraries)
9. [Rate Limiting](#rate-limiting)
10. [Error Handling](#error-handling)
11. [API Health & Status](#api-health--status)
12. [Support](#support)

## Introduction

The VetPMS API provides programmatic access to the VetPMS veterinary practice management system. This documentation covers both the MVP (Minimum Viable Product) endpoints and the advanced features available in the full system.

- **MVP Endpoints**: Core functionality available in the initial release
- **Advanced Endpoints**: Additional features available in the full system

## Authentication

All API endpoints require authentication using JSON Web Tokens (JWT).

### Authentication Methods

#### Standard Login (MVP)

```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Response**

```json
{
  "token": "string",
  "user": {
    "id": "uuid",
    "email": "string",
    "role": "string",
    "firstName": "string",
    "lastName": "string"
  }
}
```

#### Multi-Tenant Login (Full Version)

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password",
  "tenantId": "tenant_123" // Optional for multi-tenant users
}
```

**Response**

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

#### Role Selection (Full Version)

```http
POST /auth/select-role
Content-Type: application/json

{
  "tenantId": "tenant_123",
  "roleId": "role_456"
}
```

### Token Usage

Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## API Conventions

### Role-Based Access

Each endpoint specifies which roles can access it. The roles are:

- `PetOwner`: Pet owners accessing the client portal
- `Veterinarian`: Veterinary doctors
- `Nurse`: Veterinary nurses/paravets
- `Receptionist`: Front desk staff
- `Manager`: Practice managers
- `CEO`: Clinic owners/CEOs

### Pagination

List endpoints support pagination:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

Example response format:

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Filtering

Most list endpoints support filtering via query parameters.

### Versioning

The API uses URL versioning (`/v1/`). Each version is supported for at least 24 months after a new version is released.

## Core Endpoints

These endpoints are available in the MVP version.

### Clients

#### List Clients

```http
GET /clients
```

**Query Parameters**

- `search`: Search by name or email
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response**

```json
{
  "items": [
    {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "patientCount": "number"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

**Access**: Veterinarian, Nurse, Receptionist, Manager, CEO

#### Get Client

```http
GET /clients/{id}
```

**Response**

```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "patients": [
    {
      "id": "uuid",
      "name": "string",
      "species": "string",
      "breed": "string",
      "dateOfBirth": "date",
      "weight": "number"
    }
  ]
}
```

**Access**:

- PetOwner (own pets only)
- Veterinarian, Nurse, Receptionist, Manager, CEO (all clients)

#### Create Client

```http
POST /clients
Content-Type: application/json

{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string"
}
```

**Access**: Receptionist, Manager, CEO

#### Update Client

```http
PUT /clients/{id}
Content-Type: application/json

{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string"
}
```

**Access**: Receptionist, Manager, CEO

### Patients

#### List Patients

```http
GET /patients
```

**Query Parameters**

- `clientId`: Filter by client
- `search`: Search by name
- `page`: Page number
- `limit`: Items per page

**Response**

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "species": "string",
      "breed": "string",
      "clientName": "string",
      "dateOfBirth": "date",
      "weight": "number"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

**Access**:

- PetOwner (own pets only)
- Veterinarian, Nurse, Receptionist, Manager, CEO (all patients)

#### Get Patient

```http
GET /patients/{id}
```

**Response**

```json
{
  "id": "uuid",
  "name": "string",
  "species": "string",
  "breed": "string",
  "dateOfBirth": "date",
  "weight": "number",
  "client": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string"
  },
  "medicalRecords": [
    {
      "id": "uuid",
      "visitDate": "date",
      "chiefComplaint": "string",
      "veterinarianName": "string"
    }
  ]
}
```

**Access**:

- PetOwner (own pets only)
- Veterinarian, Nurse, Receptionist, Manager, CEO (all patients)

#### Create Patient

```http
POST /patients
Content-Type: application/json

{
  "name": "string",
  "species": "string",
  "breed": "string",
  "dateOfBirth": "date",
  "weight": "number",
  "clientId": "uuid"
}
```

**Access**: Receptionist, Manager, CEO

#### Update Patient

```http
PUT /patients/{id}
Content-Type: application/json

{
  "name": "string",
  "species": "string",
  "breed": "string",
  "dateOfBirth": "date",
  "weight": "number"
}
```

**Access**: Receptionist, Manager, CEO

### Appointments

#### List Appointments

```http
GET /appointments
```

**Query Parameters**

- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `veterinarianId`: Filter by veterinarian
- `status`: Filter by status
- `page`: Page number
- `limit`: Items per page

**Response**

```json
{
  "items": [
    {
      "id": "uuid",
      "startTime": "datetime",
      "endTime": "datetime",
      "type": "string",
      "status": "string",
      "patient": {
        "id": "uuid",
        "name": "string",
        "species": "string"
      },
      "client": {
        "id": "uuid",
        "firstName": "string",
        "lastName": "string"
      },
      "veterinarian": {
        "id": "uuid",
        "firstName": "string",
        "lastName": "string"
      }
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

**Access**:

- PetOwner (own pets only)
- Veterinarian, Nurse, Receptionist, Manager, CEO (all appointments)

#### Create Appointment

```http
POST /appointments
Content-Type: application/json

{
  "patientId": "uuid",
  "veterinarianId": "uuid",
  "startTime": "datetime",
  "endTime": "datetime",
  "type": "string",
  "notes": "string"
}
```

**Access**: PetOwner, Receptionist, Manager, CEO

#### Update Appointment

```http
PUT /appointments/{id}
Content-Type: application/json

{
  "startTime": "datetime",
  "endTime": "datetime",
  "type": "string",
  "status": "string",
  "notes": "string"
}
```

**Access**: Receptionist, Manager, CEO

### Medical Records

#### List Medical Records

```http
GET /medical-records
```

**Query Parameters**

- `patientId`: Filter by patient
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `page`: Page number
- `limit`: Items per page

**Response**

```json
{
  "items": [
    {
      "id": "uuid",
      "visitDate": "datetime",
      "chiefComplaint": "string",
      "patient": {
        "id": "uuid",
        "name": "string"
      },
      "veterinarian": {
        "id": "uuid",
        "firstName": "string",
        "lastName": "string"
      }
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

**Access**:

- PetOwner (own pets only)
- Veterinarian, Nurse, Receptionist, Manager, CEO (all records)

#### Get Medical Record

```http
GET /medical-records/{id}
```

**Response**

```json
{
  "id": "uuid",
  "patientId": "uuid",
  "veterinarianId": "uuid",
  "visitDate": "datetime",
  "chiefComplaint": "string",
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string",
  "prescriptions": "string"
}
```

**Access**:

- PetOwner (own pets only)
- Veterinarian, Nurse, Receptionist, Manager, CEO (all records)

#### Create Medical Record

```http
POST /medical-records
Content-Type: application/json

{
  "patientId": "uuid",
  "visitDate": "datetime",
  "chiefComplaint": "string",
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string",
  "prescriptions": "string"
}
```

**Access**: Veterinarian, Nurse

#### Update Medical Record

```http
PUT /medical-records/{id}
Content-Type: application/json

{
  "chiefComplaint": "string",
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string",
  "prescriptions": "string"
}
```

**Access**: Veterinarian, Nurse

### Invoices

#### List Invoices

```http
GET /invoices
```

**Query Parameters**

- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `status`: Filter by status
- `page`: Page number
- `limit`: Items per page

**Response**

```json
{
  "items": [
    {
      "id": "uuid",
      "appointmentId": "uuid",
      "totalAmount": "number",
      "paidAmount": "number",
      "status": "string",
      "createdDate": "datetime",
      "client": {
        "id": "uuid",
        "firstName": "string",
        "lastName": "string"
      }
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

**Access**:

- PetOwner (own invoices only)
- Veterinarian, Nurse, Receptionist, Manager, CEO (all invoices)

#### Get Invoice

```http
GET /invoices/{id}
```

**Response**

```json
{
  "id": "uuid",
  "appointmentId": "uuid",
  "totalAmount": "number",
  "paidAmount": "number",
  "status": "string",
  "createdDate": "datetime",
  "items": [
    {
      "id": "uuid",
      "description": "string",
      "quantity": "number",
      "unitPrice": "number",
      "totalPrice": "number"
    }
  ]
}
```

**Access**:

- PetOwner (own invoices only)
- Veterinarian, Nurse, Receptionist, Manager, CEO (all invoices)

#### Create Invoice

```http
POST /invoices
Content-Type: application/json

{
  "appointmentId": "uuid",
  "items": [
    {
      "description": "string",
      "quantity": "number",
      "unitPrice": "number"
    }
  ]
}
```

**Access**: Veterinarian, Receptionist, Manager, CEO

#### Update Invoice Status

```http
PUT /invoices/{id}/status
Content-Type: application/json

{
  "status": "string",
  "paidAmount": "number"
}
```

**Access**: Receptionist, Manager, CEO

## Advanced Endpoints

These endpoints are available in the full version of VetPMS.

### Multi-Tenant Management

#### List Tenants

```http
GET /tenants
```

**Query Parameters**
- `type` (optional): Filter by tenant type (FRANCHISE, PRACTICE, DEPARTMENT)
- `parentId` (optional): Filter by parent tenant
- `page` (optional): Page number
- `pageSize` (optional): Items per page

**Access**: Admin

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

**Access**: Admin

### User & Role Management

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

**Access**: Admin, Manager

#### Assign Role

```http
POST /users/{userId}/roles
Content-Type: application/json

{
  "tenantId": "tenant_123",
  "roleId": "role_456"
}
```

**Access**: Admin, Manager

### Advanced Patient Management

#### Search Patients

```http
GET /patients/search
```

**Query Parameters**
- `query` (required): Search term
- `includeArchived` (optional): Include inactive patients
- `tenantId` (optional): Search within specific tenant

**Response** includes relevance scoring and highlights.

**Access**: Veterinarian, Nurse, Receptionist, Manager, CEO

#### Patient Medical History

```http
GET /patients/{patientId}/history
```

Returns comprehensive medical history with timeline view.

**Access**: Veterinarian, Nurse

### Intelligent Scheduling

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

**Access**: Receptionist, Veterinarian, Nurse, Manager, CEO

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

**Access**: Receptionist, Veterinarian, Nurse, Manager, CEO

### Medical Records with AI

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

**Response**

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

**Access**: Veterinarian, Nurse

### Inventory Management

#### Track Inventory

```http
GET /inventory
```

**Query Parameters**
- `location` (optional): Filter by location
- `category` (optional): Filter by category
- `lowStock` (optional): Show only low stock items

**Access**: Veterinarian, Nurse, Receptionist, Manager, CEO

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

**Access**: Veterinarian, Nurse, Receptionist, Manager

### Financial Management

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

**Access**: Manager, CEO

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

**Access**: Receptionist, Manager, CEO

### Communication Hub

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

**Access**: Veterinarian, Nurse, Receptionist, Manager, CEO

### Integration Management

#### List Available Integrations

```http
GET /integrations
```

**Access**: Manager, CEO, Admin

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

**Access**: Manager, CEO, Admin

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

**Access**: Manager, CEO, Admin

### Analytics & Reporting

#### Get Practice Analytics

```http
GET /analytics/practice
```

**Query Parameters**
- `metrics` (required): Comma-separated list of metrics
- `dateRange` (required): Date range for analysis
- `groupBy` (optional): Grouping dimension

**Response**

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

**Access**: Manager, CEO

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

## Client Libraries

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

## Rate Limiting

API requests are limited based on your subscription tier:

- **MVP**: 1,000 requests/hour
- **Professional**: 10,000 requests/hour
- **Enterprise**: Custom limits

Rate limit headers:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Error Handling

All endpoints use standard HTTP status codes and return errors in this format:

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

Common error codes:
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

## Support

For API support:
- Email: api-support@vetpms.com
- Developer Portal: https://developers.vetpms.com
- Status Page: https://status.vetpms.com

---

Note: This documentation covers both MVP and Full version endpoints. Endpoints marked with "Full Version" are only available in the complete VetPMS system.