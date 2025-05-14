# VetPMS Application Structure

## Features Directory (`src/features/`)

Each feature should be self-contained with its own components, hooks, types, and utilities.

### Current Features

```
src/features/
├── appointments/           # Appointment management
├── auth/                  # Authentication and authorization
├── billing/              # Billing and invoicing
├── clients/              # Client management
├── dashboard/            # Dashboard functionality
├── medical-records/      # Medical records management
├── navigation/           # Navigation and routing
├── patients/            # Patient management
├── role-interface/      # Role-specific interfaces
├── role-selection/      # Role selection functionality
└── settings/            # Application settings
```

### Feature Structure Template

Each feature should follow this structure:

```
feature-name/
├── components/          # Feature-specific components
├── hooks/              # Custom hooks
├── types/              # TypeScript types/interfaces
├── utils/              # Utility functions
└── README.md           # Feature documentation
```

## Components Directory (`src/components/`)

Should only contain shared/reusable components used across multiple features.

### Current Structure

```
src/components/
├── __tests__/          # Component tests
├── auth/               # Authentication components
├── dashboard/          # Dashboard components
├── error-boundary/     # Error handling components
├── layout/            # Layout components
├── medical/           # Medical-related components
├── medical-records/   # Medical records components
├── shared/            # Shared components
└── ui/                # UI components (shadcn)
```

### Component Organization Rules

1. Feature-specific components should live in their respective feature directory
2. Only truly shared components should be in the components directory
3. UI components (shadcn) should stay in the ui directory
4. Layout components should stay in the layout directory

## Pages Directory (`src/pages/`)

Should only contain page components that compose features together.

### Current Structure

```
src/pages/
├── admin/             # Admin pages
├── analytics/         # Analytics pages
├── appointments/      # Appointment pages
├── auth/             # Authentication pages
├── billing/          # Billing pages
├── clients/          # Client pages
├── dashboard/        # Dashboard pages
├── medical-records/  # Medical records pages
├── patients/         # Patient pages
├── search/           # Search pages
├── settings/         # Settings pages
└── tasks/            # Task management pages
```

## Identified Issues and Recommendations

### 1. Duplicate Components

- Move feature-specific components from `components/` to their respective feature directories
- Example: Move `medical/` and `medical-records/` components to `features/medical-records/components/`

### 2. Unused Components

- Review and remove unused components
- Consider consolidating similar components
- Example: Multiple form components that could be unified

### 3. Inconsistent Structure

- Standardize feature structure across all features
- Ensure each feature follows the template structure
- Add README.md to each feature directory

### 4. Type Organization

- Move feature-specific types to their respective feature directories
- Create shared types directory for common types
- Example: Move appointment types to `features/appointments/types/`

### 5. Hook Organization

- Move feature-specific hooks to their respective feature directories
- Create shared hooks directory for common hooks
- Example: Move appointment hooks to `features/appointments/hooks/`

## Action Items

1. Feature Organization

   - [ ] Move feature-specific components to their features
   - [ ] Add README.md to each feature
   - [ ] Standardize feature structure

2. Component Cleanup

   - [ ] Review and remove unused components
   - [ ] Consolidate duplicate components
   - [ ] Move shared components to appropriate directories

3. Type System

   - [ ] Organize types by feature
   - [ ] Create shared types directory
   - [ ] Update type imports

4. Hook System

   - [ ] Organize hooks by feature
   - [ ] Create shared hooks directory
   - [ ] Update hook imports

5. Documentation
   - [ ] Add documentation to each feature
   - [ ] Update component documentation
   - [ ] Create contribution guidelines

## Best Practices

1. Feature Organization

   - Keep features self-contained
   - Use clear, consistent naming
   - Document feature responsibilities

2. Component Design

   - Follow single responsibility principle
   - Use composition over inheritance
   - Keep components focused and reusable

3. Type Safety

   - Use TypeScript strictly
   - Define clear interfaces
   - Avoid any types

4. Code Quality
   - Write tests for all components
   - Follow consistent styling
   - Document complex logic
