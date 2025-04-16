# VetPMS Project Handoff Documentation

## Current Project Status

The VetPMS (Veterinary Practice Management System) is a modern web application built with React, TypeScript, and Tailwind CSS. It provides a comprehensive solution for veterinary practices to manage appointments, patient records, billing, inventory, and more.

### Current Features
- **User Authentication**: Secure login/logout functionality
- **Role-Based Access Control**: Different interfaces for veterinarians, receptionists, practice managers, nurses, and administrators
- **Role Selection**: Users can select their role after login
- **Context-Aware UI**: Interface adapts based on user role
- **Modern Navigation**: Intuitive sidebar navigation with role-specific items
- **Dashboard Views**: Role-specific dashboard content and metrics
- **Theme Support**: Light/dark mode toggle

### Development Progress
- Core architecture implemented
- Role-based UI components completed
- Authentication flow implemented
- Dashboard components implemented
- Context providers for tenant, UI, auth, and role management

## Known Issues and Solutions

1. **RoleContext Initialization**
   - **Issue**: RoleSelector was trying to access RoleContext before it was properly initialized
   - **Solution**: Implemented safe context access with try/catch and moved RoleProvider higher in component tree
   
2. **TypeScript Warnings**
   - **Issue**: Several components have "Fast refresh only works when a file only exports components" warnings
   - **Solution**: These are related to the shadcn/ui components and don't affect functionality. Can be addressed by moving constants and utility functions to separate files.

3. **API Typing**
   - **Issue**: Some API functions still use 'any' types
   - **Solution**: Continue enhancing type definitions in lib/api/types.ts

## Development Environment Setup

### Prerequisites
- Node.js v18+
- pnpm (recommended) or npm

### Installation
1. Clone the repository:
   

2. Install dependencies:
   

3. Start the development server:
   

4. Access the application at http://localhost:5173

### Environment Variables
Create a `.env` file in the project root with the following variables:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_AUTH_ENABLED=true
```

## Directory Structure

```
├── docs/               # Documentation files
├── public/             # Static assets and resources
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── dashboard/  # Dashboard-specific components
│   │   ├── layout/     # Layout components (header, sidebar, etc.)
│   │   ├── ui/         # Base UI components (shadcn/ui)
│   │   └── context/    # Context-specific components
│   ├── features/       # Feature modules
│   │   ├── auth/       # Authentication related components
│   │   ├── role-interface/  # Role-based interface components
│   │   └── role-selection/  # Role selection components
│   ├── lib/            # Utility libraries and config
│   │   ├── api/        # API client and utilities
│   │   ├── config/     # Configuration files
│   │   ├── context/    # React context providers
│   │   └── utils/      # General utility functions
│   ├── pages/          # Page components
│   └── App.tsx         # Root application component
└── vite.config.ts      # Vite configuration
```

## Key Components and Their Relationships

### Context Providers

1. **AuthContext** (`src/lib/context/AuthContext.tsx`)
   - Manages user authentication state
   - Provides login/logout functionality
   - Stores user information including roles

2. **RoleContext** (`src/lib/context/RoleContext.tsx`)
   - Manages current user role
   - Provides role-specific configuration access
   - Used by components for conditional rendering

3. **TenantContext** (`src/lib/context/TenantContext.tsx`)
   - Manages multi-tenant functionality
   - Provides tenant-specific configuration

4. **UiContext** (`src/lib/context/UiContext.tsx`)
   - Manages UI state (search, navigation, etc.)
   - Provides UI utilities and state management

### Feature Components

1. **RoleSelector** (`src/features/role-selection/RoleSelector.tsx`)
   - Allows users to select their role after login
   - Uses RoleContext to update current role

2. **RoleBasedInterface** (`src/features/role-interface/RoleBasedInterface.tsx`)
   - Renders different interface components based on user role
   - Uses RoleContext to determine current role

3. **RoleBasedDashboard** (`src/components/dashboard/RoleBasedDashboard.tsx`)
   - Displays different dashboard content based on user role
   - Uses roleConfigs for role-specific dashboard components

### Layout Components

1. **AppLayout** (`src/components/layout/AppLayout.tsx`)
   - Main application layout with header, sidebar, and content area
   - Integrates context-aware navigation

2. **ContextAwareNavigation** (`src/components/layout/ContextAwareNavigation.tsx`)
   - Navigation component that adapts based on user role
   - Uses RoleContext to display role-specific navigation items

## Deployment Process

### Production Build

1. Create a production build:
   ```
   pnpm run build
   ```

2. The build output will be generated in the `dist/` directory

### Deployment Options

1. **Static Hosting**
   - Deploy the contents of the `dist/` directory to any static hosting service (Vercel, Netlify, AWS S3, etc.)
   - Configure the hosting service to handle client-side routing (rewrite all requests to `index.html`)

2. **Docker Deployment**
   - Use the included Dockerfile to build a container:
     ```
     docker build -t vetpms .
     docker run -p 80:80 vetpms
     ```

## Testing Procedures

### Manual Testing

1. **Authentication Testing**
   - Verify login/logout functionality
   - Test role selection after login
   - Verify protected routes redirect unauthenticated users

2. **Role-Based UI Testing**
   - Login with different roles and verify appropriate UI components are displayed
   - Test navigation items for each role
   - Verify dashboard content changes based on role

3. **Responsive Design Testing**
   - Test application on different devices and screen sizes
   - Verify sidebar collapses on smaller screens

### Automated Testing

Unit tests can be run with:
```
pnpm run test
```

## Future Development

### Planned Features

1. **Offline Mode**
   - Add service worker for offline functionality
   - Implement local data caching

2. **Enhanced Role Management**
   - Custom role creation
   - Permission-based access control

3. **Integration with Additional APIs**
   - Electronic health records
   - Payment processing
   - Inventory management

## Contact Information

For questions related to the codebase or implementation details, please contact:

- Developer Team: dev@vetpms.example.com
- Project Manager: pm@vetpms.example.com