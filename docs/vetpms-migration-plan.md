# VetPMS Refine.dev Migration Plan

## Overview

This document outlines a step-by-step approach for migrating the VetPMS application to use Refine.dev as the frontend framework. The migration will be incremental, focusing on one feature at a time while maintaining existing functionality. This approach minimizes risk and allows for continuous testing throughout the migration process.

## Migration Principles

1. **Incremental Changes**: Migrate one feature at a time, not the entire application at once
2. **Preserve Styling**: Do not change existing styling unless explicitly required
3. **Maintain Functionality**: Ensure each migrated feature works identically to the original
4. **Preserve Role-Specific UI and Logic**: All role-specific dashboards (CEO, Manager, Receptionist, Nurse, Veterinarian, etc.) and feature views must be preserved in both logic and UI. Role-based navigation, actions, and data visibility must remain intact.
5. **Preserve Multi-Tenancy**: All tenant-specific logic and data filtering must be maintained throughout the migration.
6. **Cleanup Redundancies**: Remove duplicate code and files once migration is complete
7. **Test Thoroughly**: Validate each step before proceeding to the next

## Phase 1: Setup and Infrastructure

### 1.1 Install Refine.dev Dependencies

```bash
pnpm add @refinedev/core @refinedev/react-router-v6 @refinedev/kbar @refinedev/react-hook-form @refinedev/react-table @refinedev/supabase
```

### 1.2 Create Refine Directory Structure

```bash
# Create core directories for Refine.dev implementation
mkdir -p src/providers
mkdir -p src/hooks/refine
mkdir -p src/features/{auth,clients,patients,appointments,medical-records,billing,dashboard,settings}
mkdir -p src/lib/data-providers
```

### 1.3 Implement Supabase Data Provider

Create a basic Supabase data provider for Refine.dev:

- Create file: `src/lib/data-providers/supabase-data-provider.ts`

### 1.4 Implement Authentication Provider

Create a Refine.dev auth provider using existing authentication logic:

- Create file: `src/providers/auth-provider.tsx`

### 1.5 Create Refine App Container

Create a Refine.dev app container that will eventually replace the current App:

- Create file: `src/providers/refine-provider.tsx`

## Phase 2: Feature Migration (One by One)

> Note: For each feature, follow these steps. Complete one feature entirely before starting the next. **For all features, ensure that role-specific dashboards, views, and logic are preserved.**

### 2.1 Authentication Feature

1. Create Refine.dev auth provider:

   - File: `src/providers/auth-provider.tsx`
   - Use existing auth logic from current auth context

2. Create authentication components:

   - Move and adapt login page: `src/features/auth/components/LoginPage.tsx`
   - Move and adapt reset password: `src/features/auth/components/ResetPasswordPage.tsx`

3. Test authentication functionality thoroughly before continuing

### 2.2 Clients Feature

1. Create Refine.dev CRUD pages in the feature directory:

   - `src/features/clients/ClientList.tsx`
   - `src/features/clients/ClientShow.tsx`
   - `src/features/clients/ClientCreate.tsx`
   - `src/features/clients/ClientEdit.tsx`
   - `src/features/clients/ClientForm.tsx`

2. Update routes in Refine provider

### 2.3 Patients Feature

1. Create Refine.dev CRUD pages in the feature directory:

   - `src/features/patients/PatientList.tsx`
   - `src/features/patients/PatientShow.tsx`
   - `src/features/patients/PatientCreate.tsx`
   - `src/features/patients/PatientEdit.tsx`
   - `src/features/patients/PatientForm.tsx`

2. Update routes in Refine provider

### 2.4 Appointments Feature

1. Create Refine.dev CRUD pages in the feature directory:

   - `src/features/appointments/AppointmentList.tsx`
   - `src/features/appointments/AppointmentShow.tsx`
   - `src/features/appointments/AppointmentCreate.tsx`
   - `src/features/appointments/AppointmentEdit.tsx`
   - `src/features/appointments/AppointmentForm.tsx`
   - `src/features/appointments/AppointmentScheduler.tsx`

2. Update routes in Refine provider

### 2.5 Medical Records Feature

1. Create Refine.dev CRUD pages in the feature directory:

   - `src/features/medical-records/MedicalRecordList.tsx`
   - `src/features/medical-records/MedicalRecordShow.tsx`
   - `src/features/medical-records/MedicalRecordCreate.tsx`
   - `src/features/medical-records/MedicalRecordEdit.tsx`
   - `src/features/medical-records/components/MedicalRecordForm.tsx`

2. Update routes in Refine provider

### 2.6 Billing Feature

1. Create Refine.dev CRUD pages in the feature directory:

   - `src/features/billing/BillingList.tsx`
   - `src/features/billing/BillingShow.tsx`
   - `src/features/billing/BillingCreate.tsx`
   - `src/features/billing/BillingEdit.tsx`
   - `src/features/billing/components/BillingForm.tsx`

2. Update routes in Refine provider

### 2.7 Dashboard Feature

- Place all dashboards directly under `src/features/dashboard/`:
  - `VeterinarianDashboard.tsx`, `ReceptionistDashboard.tsx`, `AdminDashboard.tsx`, etc.

## Phase 3: Integration and Cutover

### 3.1 Update Main App Component

Modify `src/App.tsx` to use the Refine provider:

```tsx
import { RefineProvider } from "./providers/refine-provider";

function App() {
  return (
    <RefineProvider>
      {/* Any existing providers that need to be preserved */}
    </RefineProvider>
  );
}

export default App;
```

### 3.2 Update Routes

Replace the current routing with Refine.dev routing in `src/AppRoutes.tsx`

### 3.3 Testing the Migration

Run extensive tests to verify all functionality works as expected:

- Unit tests for components
- Integration tests for features
- Manual testing of all user flows
- **Test all role-specific dashboards and feature views for each role**
- **Test multi-tenant data filtering and access**

## Phase 4: Cleanup and Optimization

### 4.1 Identify Redundant Files

Scan for redundant files that can be safely removed:

1. Duplicate components between old and new structure
2. Unused contexts once moved to Refine providers
3. Deprecated hooks replaced by Refine hooks
4. Old tests that no longer apply to the new structure

### 4.2 Remove Redundant Files

After validating functionality, remove redundant files:

```bash
# Example of redundancy cleanup (customize based on findings)
rm src/contexts/AuthContext.tsx  # Replaced by auth-provider.tsx
rm src/pages/clients/ClientsPage.tsx  # Replaced by Refine list page
# etc.
```

### 4.3 Remove Compatibility Layers

Once all features are migrated, remove temporary compatibility layers:

- Remove barrel files created for backward compatibility
- Remove temporary mappings and adapters

### 4.4 Optimize Data Fetching

Refactor data fetching to fully leverage Refine.dev:

- Replace custom fetch hooks with Refine's `useList`, `useOne`, etc.
- Optimize data caching with React Query settings

## Migration Task List

This section provides a checklist of discrete tasks that can be executed sequentially:

### Setup Tasks

- [ ] Install Refine.dev dependencies
- [ ] Create directory structure for Refine.dev
- [ ] Create Supabase data provider
- [ ] Create authentication provider
- [ ] Create Refine app container

### Auth Feature Tasks

- [ ] Create auth provider using existing auth logic
- [ ] Create login page component
- [ ] Create reset password component
- [ ] Update routes for auth pages
- [ ] Test auth functionality

### Clients Feature Tasks

- [ ] Create client list page with Refine.dev
- [ ] Create client show page with Refine.dev
- [ ] Create client create/edit pages with Refine.dev
- [ ] Move client form to components directory
- [ ] Update routes for client pages
- [ ] Test client CRUD operations

### Patients Feature Tasks

- [ ] Create patient list page with Refine.dev
- [ ] Create patient show page with Refine.dev
- [ ] Create patient create/edit pages with Refine.dev
- [ ] Move patient form to components directory
- [ ] Update routes for patient pages
- [ ] Test patient CRUD operations

### Appointments Feature Tasks

- [ ] Create appointment list page with Refine.dev
- [ ] Create appointment show page with Refine.dev
- [ ] Create appointment create/edit pages with Refine.dev
- [ ] Move appointment form to components directory
- [ ] Update routes for appointment pages
- [ ] Test appointment CRUD operations

### Medical Records Feature Tasks

- [ ] Create medical record list page with Refine.dev
- [ ] Create medical record show page with Refine.dev
- [ ] Create medical record create/edit pages with Refine.dev
- [ ] Move medical record forms to components directory
- [ ] Update routes for medical record pages
- [ ] Test medical record CRUD operations

### Billing Feature Tasks

- [ ] Create billing list page with Refine.dev
- [ ] Create billing show page with Refine.dev
- [ ] Create billing create/edit pages with Refine.dev
- [ ] Move billing forms to components directory
- [ ] Update routes for billing pages
- [ ] Test billing CRUD operations

### Dashboard Feature Tasks

- [ ] Create dashboard with Refine.dev
- [ ] Move role-specific dashboards to components
- [ ] Update routes for dashboard
- [ ] Test dashboard functionality

### Integration Tasks

- [ ] Update main App component to use Refine
- [ ] Update routes to use Refine routing
- [ ] Test entire application functionality

### Cleanup Tasks

- [ ] Identify redundant files
- [ ] Remove redundant files
- [ ] Remove compatibility layers
- [ ] Optimize data fetching with Refine hooks

## Guidelines for Task Implementation

1. **Keep Changes Minimal**: Focus only on the specific task
2. **Preserve Styling**: Do not change existing styling
3. **Preserve Functionality**: Ensure the feature works the same way
4. **Preserve Role-Specific UI and Logic**: All role-specific dashboards and feature views must be preserved in both logic and UI. Role-based navigation, actions, and data visibility must remain intact.
5. **Preserve Multi-Tenancy**: All tenant-specific logic and data filtering must be maintained throughout the migration.
6. **Test Each Change**: Verify functionality after each task

## Testing Strategy

1. **Unit Testing**: Test each new component as it's created
2. **Feature Testing**: Test each feature after migration
3. **Integration Testing**: Test interactions between features
4. **End-to-End Testing**: Test complete user flows
5. **Test all role-specific dashboards and feature views for each role**
6. **Test multi-tenant data filtering and access**

## Rollback Plan

If issues arise during migration:

1. **Feature Level Rollback**: Revert changes to specific feature
2. **Complete Rollback**: If necessary, revert to pre-migration state
3. **Hybrid Operation**: Maintain ability to run old and new implementations in parallel during migration

## Conclusion

This migration plan provides a systematic, incremental approach to adopting Refine.dev while minimizing risk and disruption. By following these steps, the migration can be accomplished without compromising functionality or user experience. **All role-specific dashboards, feature logic, and multi-tenancy must be preserved.**

## Notes

- The project now uses a flat feature structure: all main feature files (list, show, create, edit, dashboards, forms, etc.) are directly under their respective feature folder. No `list/`, `show/`, `create/`, `edit/`, or `components/` subfolders are used for feature entry points.
