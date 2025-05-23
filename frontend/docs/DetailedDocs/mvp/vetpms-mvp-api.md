# VetPMS MVP API Documentation

**Version**: 1.0  
**Last Updated**: May 2025  
**Base URL**: `https://api.vetpms.com/v1`

## Authentication

All API endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Role-Based Access

Each endpoint specifies which roles can access it. The roles are:

- `PetOwner`: Pet owners accessing the client portal
- `Veterinarian`: Veterinary doctors
- `Nurse`: Veterinary nurses/paravets
- `Receptionist`: Front desk staff
- `Manager`: Practice managers
- `CEO`: Clinic owners/CEOs

## API Endpoints

### Authentication

#### Login

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

**Access**: Public

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

## Error Responses

All endpoints use standard HTTP status codes and return errors in this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

Common error codes:

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden (role-based access denied)
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

## Notes

- All timestamps are in ISO 8601 format
- All monetary values are in decimal format
- UUIDs are used for all IDs
- Pagination is required for list endpoints
- Search is case-insensitive
- Multi-tenant isolation is handled automatically
