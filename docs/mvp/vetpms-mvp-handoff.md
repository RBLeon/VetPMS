# VetPMS MVP Handoff Documentation

## Project Overview

VetPMS MVP is a simplified veterinary practice management system focused on core functionality. This document provides essential information for developers working on the MVP implementation.

## Current Status

- **Phase**: MVP Development
- **Target Completion**: 4 months
- **Architecture**: Monolithic ASP.NET Core API with React frontend
- **Focus**: Essential features only (no multi-tenancy, AI, or complex integrations)

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn/ui components
- React Query for data fetching
- React Router for navigation

### Backend
- ASP.NET Core 8 (monolithic architecture)
- Entity Framework Core with PostgreSQL
- Simple JWT authentication
- Basic repository pattern

### Infrastructure
- Azure App Service for hosting
- Azure Database for PostgreSQL
- n8n for workflow automation
- SendGrid for emails

## Project Structure

```
vetpms/
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Root component
│   └── package.json
│
├── backend/
│   ├── VetPMS.API/        # API project
│   ├── VetPMS.Core/       # Domain models
│   ├── VetPMS.Data/       # Data access
│   └── VetPMS.sln
│
└── docker-compose.yml      # Local development
```

## MVP Features Implemented

### 1. Authentication
- [x] Simple email/password login
- [x] JWT token generation
- [x] Basic role support (Admin, Veterinarian, Receptionist)
- [ ] Password reset functionality

### 2. Client Management
- [x] Create/edit clients
- [x] Search clients
- [x] View client details
- [ ] Client document upload

### 3. Patient Management
- [x] Add patients to clients
- [x] Basic patient information
- [x] View patient history
- [ ] Patient photo upload

### 4. Appointment Scheduling
- [x] Create appointments
- [x] View daily/weekly schedule
- [x] Basic status management
- [ ] Appointment cancellation

### 5. Medical Records
- [x] Create SOAP notes
- [x] View medical history
- [ ] Print medical records

### 6. Basic Billing
- [x] Create invoices
- [x] Mark as paid
- [ ] PDF generation
- [ ] Email invoices

### 7. n8n Automations
- [x] Appointment reminders
- [ ] Follow-up emails
- [ ] Basic reporting

## Development Setup

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- PostgreSQL 14+
- Docker Desktop

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
dotnet restore
dotnet run --project VetPMS.API
```

### Database Setup
```bash
# Run migrations
cd backend
dotnet ef database update -p VetPMS.Data -s VetPMS.API

# Seed data (optional)
dotnet run --project VetPMS.API -- --seed
```

### n8n Setup
```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

## API Endpoints (MVP)

Base URL: `http://localhost:5000/api/v1`

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token

### Clients
- `GET /clients` - List clients
- `GET /clients/{id}` - Get client
- `POST /clients` - Create client
- `PUT /clients/{id}` - Update client

### Patients
- `GET /patients` - List patients
- `GET /patients/{id}` - Get patient
- `POST /patients` - Create patient
- `PUT /patients/{id}` - Update patient

### Appointments
- `GET /appointments` - List appointments
- `GET /appointments/{id}` - Get appointment
- `POST /appointments` - Create appointment
- `PUT /appointments/{id}` - Update appointment

### Medical Records
- `GET /medical-records` - List records
- `GET /medical-records/{id}` - Get record
- `POST /medical-records` - Create record

### Invoices
- `GET /invoices` - List invoices
- `GET /invoices/{id}` - Get invoice
- `POST /invoices` - Create invoice
- `PUT /invoices/{id}/status` - Update status

## Known Issues

1. **Performance**: List endpoints need pagination optimization
2. **Validation**: Form validation needs improvement
3. **Error Handling**: Better error messages needed
4. **Mobile**: Basic responsive design needs refinement

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=VetPMS
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=vetpms;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Key": "your-256-bit-secret",
    "Issuer": "VetPMS",
    "Audience": "VetPMS"
  },
  "SendGrid": {
    "ApiKey": "your-sendgrid-key"
  }
}
```

## Deployment

### Local Development
```bash
docker-compose up -d
```

### Production Deployment
1. Build frontend: `npm run build`
2. Build backend: `dotnet publish -c Release`
3. Deploy to Azure App Service
4. Configure environment variables
5. Run database migrations

## Testing

### Frontend Tests
```bash
cd frontend
npm run test        # Unit tests
npm run test:e2e    # E2E tests with Cypress
```

### Backend Tests
```bash
cd backend
dotnet test         # All tests
```

## MVP Limitations

The following features are NOT included in MVP:
- Multi-tenant architecture
- Complex role permissions
- AI-powered features
- Advanced scheduling
- Inventory management
- Financial reporting
- Mobile app
- Offline support

## Next Steps After MVP

1. **User Feedback**: Gather feedback from pilot clinic
2. **Performance**: Optimize database queries
3. **Security**: Add 2FA and audit logging
4. **Features**: Prioritize next features based on feedback
5. **Architecture**: Plan migration to microservices

## Support

For MVP development questions:
- Technical Lead: [your-email]
- Project Repository: [git-repo-url]
- Documentation: [docs-url]

## Useful Commands

```bash
# Database migrations
dotnet ef migrations add MigrationName -p VetPMS.Data -s VetPMS.API
dotnet ef database update -p VetPMS.Data -s VetPMS.API

# Build and run
dotnet watch run --project VetPMS.API
npm run dev

# Docker operations
docker-compose up -d
docker-compose down
docker-compose logs -f

# n8n workflows
# Access n8n at http://localhost:5678
```

## Code Style Guidelines

### Frontend
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript strictly
- Follow React best practices

### Backend
- Follow Clean Code principles
- Use async/await consistently
- Keep controllers thin
- Implement proper error handling

## Common Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running
- Verify connection string
- Ensure database exists

### CORS Errors
- Check API CORS configuration
- Verify frontend API URL
- Clear browser cache

### Authentication Problems
- Check JWT configuration
- Verify token expiration
- Clear localStorage

This MVP handoff documentation provides the essential information needed to continue development. Focus on delivering core features reliably before adding complexity.
