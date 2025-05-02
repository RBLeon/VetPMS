# VetPMS MVP API Documentation

## Overview

This document defines the MVP API endpoints for VetPMS. The MVP focuses on essential functionality with a simplified architecture.

## Base URL

```
https://api.vetpms.example.com/api/v1
```

## Authentication

The MVP API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Veterinarian"
  }
}
```

## MVP Endpoints

### Clients

#### List Clients
```
GET /clients
```

Query Parameters:
- `search` (optional): Search by name or phone
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20)

Response:
```json
{
  "data": [
    {
      "id": "client_123",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1-555-123-4567",
      "address": "123 Main St, City, State"
    }
  ],
  "totalCount": 45,
  "page": 1,
  "pageSize": 20
}
```

#### Get Client
```
GET /clients/{id}
```

#### Create Client
```
POST /clients
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1-555-123-4567",
  "address": "123 Main St, City, State"
}
```

#### Update Client
```
PUT /clients/{id}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1-555-123-4567",
  "address": "123 Main St, City, State"
}
```

### Patients

#### List Patients
```
GET /patients
```

Query Parameters:
- `clientId` (optional): Filter by client
- `search` (optional): Search by name
- `page` (optional): Page number
- `pageSize` (optional): Items per page

Response:
```json
{
  "data": [
    {
      "id": "patient_123",
      "clientId": "client_456",
      "name": "Max",
      "species": "Canine",
      "breed": "Golden Retriever",
      "dateOfBirth": "2020-06-15",
      "weight": 30.5
    }
  ],
  "totalCount": 120,
  "page": 1,
  "pageSize": 20
}
```

#### Get Patient
```
GET /patients/{id}
```

#### Create Patient
```
POST /patients
Content-Type: application/json

{
  "clientId": "client_456",
  "name": "Max",
  "species": "Canine",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-06-15",
  "weight": 30.5
}
```

#### Update Patient
```
PUT /patients/{id}
Content-Type: application/json

{
  "name": "Max",
  "species": "Canine",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-06-15",
  "weight": 31.0
}
```

### Appointments

#### List Appointments
```
GET /appointments
```

Query Parameters:
- `date` (optional): Filter by date (YYYY-MM-DD)
- `veterinarianId` (optional): Filter by veterinarian
- `status` (optional): Filter by status

Response:
```json
{
  "data": [
    {
      "id": "appt_123",
      "patientId": "patient_123",
      "patientName": "Max",
      "clientId": "client_456",
      "clientName": "Jane Smith",
      "veterinarianId": "user_789",
      "veterinarianName": "Dr. Johnson",
      "startTime": "2025-05-02T09:00:00Z",
      "endTime": "2025-05-02T09:30:00Z",
      "type": "Consultation",
      "status": "Scheduled",
      "notes": "Annual check-up"
    }
  ]
}
```

#### Get Appointment
```
GET /appointments/{id}
```

#### Create Appointment
```
POST /appointments
Content-Type: application/json

{
  "patientId": "patient_123",
  "veterinarianId": "user_789",
  "startTime": "2025-05-02T09:00:00Z",
  "endTime": "2025-05-02T09:30:00Z",
  "type": "Consultation",
  "notes": "Annual check-up"
}
```

#### Update Appointment
```
PUT /appointments/{id}
Content-Type: application/json

{
  "startTime": "2025-05-02T10:00:00Z",
  "endTime": "2025-05-02T10:30:00Z",
  "status": "Rescheduled",
  "notes": "Client requested time change"
}
```

#### Cancel Appointment
```
POST /appointments/{id}/cancel
Content-Type: application/json

{
  "reason": "Client cancelled"
}
```

### Medical Records

#### List Medical Records
```
GET /patients/{patientId}/medical-records
```

Response:
```json
{
  "data": [
    {
      "id": "record_123",
      "patientId": "patient_123",
      "veterinarianId": "user_789",
      "visitDate": "2025-05-02T09:00:00Z",
      "chiefComplaint": "Annual check-up",
      "subjective": "Owner reports normal appetite and behavior",
      "objective": "T: 101.5°F, HR: 80 bpm, RR: 20 bpm",
      "assessment": "Healthy adult dog",
      "plan": "Continue current diet, schedule next annual",
      "prescriptions": "Heartworm preventative - 12 months"
    }
  ]
}
```

#### Get Medical Record
```
GET /medical-records/{id}
```

#### Create Medical Record
```
POST /medical-records
Content-Type: application/json

{
  "patientId": "patient_123",
  "appointmentId": "appt_123",
  "chiefComplaint": "Annual check-up",
  "subjective": "Owner reports normal appetite and behavior",
  "objective": "T: 101.5°F, HR: 80 bpm, RR: 20 bpm",
  "assessment": "Healthy adult dog",
  "plan": "Continue current diet, schedule next annual",
  "prescriptions": "Heartworm preventative - 12 months"
}
```

### Invoices

#### List Invoices
```
GET /invoices
```

Query Parameters:
- `clientId` (optional): Filter by client
- `status` (optional): Filter by status (Draft, Sent, Paid)
- `dateFrom` (optional): Start date
- `dateTo` (optional): End date

Response:
```json
{
  "data": [
    {
      "id": "invoice_123",
      "appointmentId": "appt_123",
      "clientId": "client_456",
      "clientName": "Jane Smith",
      "totalAmount": 125.00,
      "paidAmount": 0.00,
      "status": "Draft",
      "createdDate": "2025-05-02T10:00:00Z",
      "items": [
        {
          "description": "Consultation",
          "quantity": 1,
          "unitPrice": 75.00,
          "totalPrice": 75.00
        },
        {
          "description": "Vaccination",
          "quantity": 1,
          "unitPrice": 50.00,
          "totalPrice": 50.00
        }
      ]
    }
  ]
}
```

#### Get Invoice
```
GET /invoices/{id}
```

#### Create Invoice
```
POST /invoices
Content-Type: application/json

{
  "appointmentId": "appt_123",
  "items": [
    {
      "description": "Consultation",
      "quantity": 1,
      "unitPrice": 75.00
    },
    {
      "description": "Vaccination",
      "quantity": 1,
      "unitPrice": 50.00
    }
  ]
}
```

#### Update Invoice Status
```
POST /invoices/{id}/status
Content-Type: application/json

{
  "status": "Paid",
  "paidAmount": 125.00
}
```

### Available Time Slots

#### Get Available Slots
```
GET /appointments/available-slots
```

Query Parameters:
- `date` (required): Date (YYYY-MM-DD)
- `veterinarianId` (required): Veterinarian ID

Response:
```json
{
  "data": [
    {
      "start": "2025-05-02T09:00:00Z",
      "end": "2025-05-02T09:30:00Z"
    },
    {
      "start": "2025-05-02T10:00:00Z",
      "end": "2025-05-02T10:30:00Z"
    }
  ]
}
```

## Error Responses

The API uses standard HTTP status codes and returns errors in this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format"
    }
  }
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The MVP API has a rate limit of 100 requests per minute per API token. Rate limit headers are included in responses:

- `X-RateLimit-Limit`: 100
- `X-RateLimit-Remaining`: 95
- `X-RateLimit-Reset`: 1620000000

## Notes

This is the MVP API specification. Additional endpoints and features will be added in future versions, including:
- Advanced search capabilities
- Inventory management
- Multi-practice support
- AI-assisted features
- Third-party integrations
