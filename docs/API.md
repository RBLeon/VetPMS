# VetPMS API Documentation

## Overview

The VetPMS API provides programmatic access to veterinary practice data and functionality. This documentation outlines the available endpoints, authentication methods, and example requests and responses.

## Base URL

All API requests should be made to:

```
http://api.vetpms.example.com/v1
```

## Authentication

The VetPMS API uses JWT (JSON Web Tokens) for authentication. To authenticate your requests, include an `Authorization` header with your JWT token:

```
Authorization: Bearer <your_token>
```

To obtain a token, make a POST request to the authentication endpoint:

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

The response will include a token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Endpoints

### Patients

#### Get All Patients

```
GET /patients
```

Parameters:
- `limit` (optional): Maximum number of records to return (default: 20)
- `offset` (optional): Number of records to skip (default: 0)
- `sort` (optional): Field to sort by (default: "lastName")
- `order` (optional): Sort order, either "asc" or "desc" (default: "asc")

Response:

```json
{
  "total": 120,
  "data": [
    {
      "id": "p123",
      "name": "Max",
      "species": "Canine",
      "breed": "Golden Retriever",
      "dateOfBirth": "2018-05-12",
      "clientId": "c456",
      "clientName": "Jane Smith"
    },
    ...
  ]
}
```

#### Get Patient by ID

```
GET /patients/:id
```

Response:

```json
{
  "id": "p123",
  "name": "Max",
  "species": "Canine",
  "breed": "Golden Retriever",
  "dateOfBirth": "2018-05-12",
  "sex": "Male",
  "weight": 32.5,
  "weightUnit": "kg",
  "microchipId": "985121054896532",
  "insuranceProvider": "PetSure",
  "insurancePolicyNumber": "PSR12345678",
  "client": {
    "id": "c456",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1-555-123-4567"
  },
  "medicalRecord": {
    "allergies": ["Penicillin"],
    "conditions": ["Arthritis"],
    "vaccinations": [
      {
        "name": "Rabies",
        "date": "2023-03-15",
        "expiryDate": "2024-03-15"
      }
    ]
  }
}
```

#### Create Patient

```
POST /patients
Content-Type: application/json

{
  "name": "Bella",
  "species": "Feline",
  "breed": "Maine Coon",
  "dateOfBirth": "2020-02-10",
  "sex": "Female",
  "weight": 5.2,
  "weightUnit": "kg",
  "clientId": "c789"
}
```

Response:

```json
{
  "id": "p456",
  "name": "Bella",
  "species": "Feline",
  "breed": "Maine Coon",
  "dateOfBirth": "2020-02-10",
  "sex": "Female",
  "weight": 5.2,
  "weightUnit": "kg",
  "clientId": "c789",
  "created": "2023-07-12T14:32:10Z"
}
```

### Appointments

#### Get Appointments

```
GET /appointments
```

Parameters:
- `date` (optional): Filter by date (YYYY-MM-DD)
- `veterinarianId` (optional): Filter by veterinarian
- `patientId` (optional): Filter by patient
- `status` (optional): Filter by status (scheduled, checked-in, in-progress, completed, canceled)

Response:

```json
{
  "total": 8,
  "data": [
    {
      "id": "a123",
      "startTime": "2023-07-15T09:00:00Z",
      "endTime": "2023-07-15T09:30:00Z",
      "patientId": "p123",
      "patientName": "Max",
      "clientId": "c456",
      "clientName": "Jane Smith",
      "veterinarianId": "v789",
      "veterinarianName": "Dr. Alex Johnson",
      "reason": "Annual check-up",
      "status": "scheduled"
    },
    ...
  ]
}
```

## Error Handling

The API returns standard HTTP status codes to indicate success or failure of requests:

- `200 OK`: Request succeeded
- `201 Created`: Resource was successfully created
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication failure
- `403 Forbidden`: Authenticated user doesn't have necessary permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses will include a JSON object with error details:

```json
{
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid date format. Please use YYYY-MM-DD.",
    "details": {...}
  }
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per API key. If you exceed this limit, you'll receive a `429 Too Many Requests` response. The response will include `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers indicating your limit and remaining requests.

## Webhooks

VetPMS can send webhook notifications when certain events occur. Configure webhooks in the developer portal.

Supported events:
- `appointment.created`
- `appointment.updated`
- `appointment.canceled`
- `patient.created`
- `patient.updated`
- `medical_record.updated`

## SDK Libraries

Official client libraries are available for:
- JavaScript/TypeScript
- Python
- Java
- C#

Visit the [Developer Portal](https://dev.vetpms.example.com) for documentation and downloads.