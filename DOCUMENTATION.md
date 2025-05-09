# Veterinary Practice Management System (VetPMS) Documentation

## Overview

VetPMS is a modern, web-based veterinary practice management system built with React, TypeScript, and a comprehensive set of modern web technologies. The system is designed to help veterinary practices manage their daily operations, including client management, patient records, appointments, and more.

## Technology Stack

### Core Technologies

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM 7
- **UI Components**:
  - Radix UI (Headless components)
  - Ant Design
  - Shadcn UI
- **Testing**: Vitest with React Testing Library

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable UI components
├── features/       # Feature-specific components and logic
├── hooks/         # Custom React hooks
├── lib/           # Core utilities and configurations
├── services/      # API and service integrations
├── test/          # Test files
└── types/         # TypeScript type definitions
```

## Key Features

### 1. Authentication & Authorization

- Role-based access control
- Protected routes
- Login system
- Tenant management

### 2. Client Management

- Client listing
- Client details view
- Client creation and editing
- Client search and filtering

### 3. Patient Management

- Patient records
- Patient history
- Patient creation and editing
- Patient search and filtering

### 4. Appointment System

- Calendar view
- Appointment scheduling
- Appointment management
- Appointment form

### 5. Dashboard

- Overview of practice metrics
- Quick access to common functions
- Activity monitoring

## Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- pnpm (Package manager)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run the development server:

```bash
pnpm dev
```

### Testing

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Generate test coverage:

```bash
pnpm test:coverage
```

### Building for Production

```bash
pnpm build
```

## Architecture

### Component Architecture

The application follows a feature-based architecture where related components, hooks, and utilities are grouped together in the `features` directory. This promotes better code organization and maintainability.

### State Management

- **Context API**: Used for global state management (Auth, UI, Tenant, Role)
- **React Query**: Handles server state and caching
- **Local State**: Component-level state using React hooks

### Routing

The application uses React Router for navigation with protected routes. The main routes include:

- `/login` - Authentication
- `/` - Dashboard
- `/clients` - Client management
- `/patients` - Patient management
- `/calendar` - Appointment scheduling
- `/role-interface` - Role-specific interfaces

## Best Practices

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture
- Custom hooks for reusable logic

### Testing

- Unit tests with Vitest
- Component testing with React Testing Library
- Integration tests for critical user flows

### Performance

- Code splitting with lazy loading
- Optimized bundle size
- Efficient state management
- Responsive design

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Use meaningful commit messages

## Security

- Protected routes
- Role-based access control
- Secure authentication
- Input validation
- XSS protection

## Future Improvements

- Enhanced reporting features
- Integration with veterinary equipment
- Mobile application
- Advanced analytics
- Inventory management
- Billing and invoicing system

## Current Status

### Known Issues and Limitations

1. **Role Management**

   - Currently no way to switch between different roles
   - Role-specific interfaces need implementation
   - Access control needs to be properly implemented

2. **Dashboard Functionality**

   - Veterinarian dashboard actions are not functional
   - Quick actions in bottom right corner are not working
   - Need proper error handling and loading states

3. **Patient Management**

   - Patient lookup functionality is broken
   - Error: ["patient","search"] data is undefined
   - Navigation issues in pet creation flow

4. **Medical Records**

   - Complete medical records system is missing
   - No consultation workflow
   - No treatment records
   - No prescription management

5. **Settings and Configuration**

   - No user settings page
   - No system settings page
   - Missing user preferences

6. **Calendar and Appointments**
   - Redundant functionality between calendar and appointments
   - Need to consolidate features
   - Improve user experience

### Next Steps

Please refer to `tasks.md` for detailed task list and priorities.

## Support

For support and questions, please refer to the project's issue tracker or contact the development team.
