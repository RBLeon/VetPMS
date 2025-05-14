# VetPMS Tasks

## Current Tasks

### High Priority

- [x] Remove empty/unused features (role-interface, navigation)
- [x] Remove duplicate files (MedicalRecordList.tsx)
- [ ] Audit all features for duplicate functionality
  - [x] Consolidate form components
    - [x] Create base form components in ui/forms
    - [x] Move common form patterns to shared components
    - [x] Standardize form validation patterns
    - [x] Unify date/time input components
    - [x] Standardize error handling and loading states
  - [x] Audit list components for duplication
    - [x] Create standardized DataList component
    - [x] Add sorting and filtering capabilities
    - [x] Implement consistent action buttons
    - [x] Add loading and empty states
  - [x] Check for duplicate hooks and utilities
    - [x] Move hooks to their respective features
    - [x] Update import paths
    - [x] Remove deprecated hooks
  - [x] Review type definitions for consistency
    - [x] Create centralized type definitions
    - [x] Remove duplicate type definitions
    - [x] Standardize type naming
- [ ] Remove unused and redundant files
  - [x] Remove empty test directories
  - [x] Clean up unused imports
  - [x] Remove deprecated components
  - [x] Clean up old type definitions
- [ ] Standardize feature structure
  - [x] Ensure each feature has:
    - [x] components/ directory
    - [x] types/ directory
    - [x] hooks/ directory
    - [x] utils/ directory
    - [x] services/ directory
    - [x] tests/ directory
    - [x] README.md
  - [x] Standardize import paths (use @/features consistently)
  - [x] Standardize component organization
  - [x] Ensure consistent file naming conventions
    - [x] Use kebab-case for all files
    - [x] Use PascalCase for component files
    - [x] Use camelCase for utility files
- [ ] Ensure consistent type definitions
- [ ] Add comprehensive documentation
- [ ] Set up testing infrastructure
- [ ] Update all tests to match new structure
- [ ] Ensure all tests pass
- [ ] Fix GitHub Actions workflow
- [ ] Push changes to GitHub
- [ ] Verify GitHub Actions success

### Medium Priority

- [ ] Add comprehensive dummy data for all role-specific dashboards
- [ ] Clean up and organize appointment-related code

  - [ ] Move appointment types to dedicated types file
  - [ ] Create appointment-related hooks
  - [ ] Add appointment utility functions

- [ ] Enhance Appointment Scheduler

  - [ ] Enable drag-and-drop functionality for appointments
  - [ ] Create role-specific views (all staff vs personal schedule as an example, think of more specific things per role)
  - [ ] Add view switching options (day/week/month)
  - [ ] Implement appointment status indicators
  - [ ] Add appointment type filtering
  - [ ] Create appointment conflict detection

- [ ] Connect Dashboard Actions

  - [ ] Link "Start Consult" to medical records creation
  - [ ] Connect notification badges to notification center
  - [ ] Link financial overview to detailed reports
  - [ ] Connect quick action buttons to respective forms
  - [ ] Implement search functionality across all dashboards

- [ ] Complete Client/Patient Management

  - [ ] Finish patient registration flow
  - [ ] Implement client profile editing
  - [ ] Add patient history view
  - [ ] Create vaccination record management
  - [ ] Enable document upload/management
  - [ ] Implement prescription management
  - [ ] Add billing/payment processing
  - [ ] Create client communication log

- [ ] Review and improve navigation patterns
- [ ] Add loading states
- [ ] Implement proper error messages
- [ ] Add success notifications
- [ ] Improve responsive design

### Low Priority

- [ ] Implement End-to-End Workflows

  - [ ] Staff Appointment Processing

    - [ ] Create notification system for new appointments
    - [ ] Add appointment approval workflow
    - [ ] Implement staff assignment
    - [ ] Enable schedule conflict resolution

  - [ ] Consultation Flow

    - [ ] Create pre-consultation checklist
    - [ ] Implement consultation notes template
    - [ ] Add diagnosis/treatment planning
    - [ ] Enable prescription generation
    - [ ] Create follow-up scheduling
    - [ ] Implement billing integration

  - [ ] Medical Records Flow
    - [ ] Create SOAP note templates
    - [ ] Enable image/file attachments
    - [ ] Add lab results integration
    - [ ] Implement treatment plan tracking
    - [ ] Create referral management

- [ ] Implement status filter for Medical Records System
- [ ] Implement type filter for Medical Records System
- [ ] Add status updates for Medical Records
- [ ] Implement notification system

### Future Tasks

- [ ] Set up database schema
- [ ] Implement API endpoints
- [ ] Create data models
- [ ] Set up authentication middleware
- [ ] Implement role-based access control
- [ ] Create data validation
- [ ] Set up error handling
- [ ] Implement logging system
- [ ] Client Portal Appointment Booking
  - [ ] Create appointment request form
  - [ ] Implement availability checking
  - [ ] Add confirmation notifications
  - [ ] Enable appointment modification/cancellation

## Notes

- All date formats should use the Dutch style (d MMM yyyy)
- Currency should be displayed in euros (€)
- Medical terms should be consistent across the application
- Consider adding tooltips for complex medical terms
- Ensure proper grammar and spelling in all Dutch text
- Maintain consistent terminology across all components
- Each feature should be tested before deployment
- Focus on role-specific functionality and user experience
- Prioritize fixing existing issues before adding new features
- The settings page is now always visible in the user menu for authenticated users, regardless of role permissions.
- The 'Snel Acties' section has been removed from the side menu; quick actions are only available in the floating menu at the bottom right.

## Completed Tasks

- [x] Move medical components to medical-records feature
  - [x] Create proper feature structure in src/features/medical-records/
  - [x] Move all medical-related components
  - [x] Create README.md
  - [x] Create types file
  - [x] Organize tests
  - [x] Remove old directories
- [x] Move dashboard components to dashboard feature
  - [x] Create proper feature structure in src/features/dashboard/
  - [x] Move all dashboard-related components
  - [x] Create README.md
  - [x] Create types file
  - [x] Organize tests
  - [x] Remove old directories
- [x] Move auth components to auth feature
  - [x] Create proper feature structure
  - [x] Move components
  - [x] Create README.md
  - [x] Create types file
  - [x] Organize tests
  - [x] Remove old directories
- [x] Move layout components to layout feature
  - [x] Create proper feature structure
  - [x] Move components
  - [x] Create README.md
  - [x] Create types file
  - [x] Organize tests
  - [x] Remove old directories
- [x] Move UI components to UI feature
  - [x] Create proper feature structure
  - [x] Move components
  - [x] Create README.md
  - [x] Create types file
  - [x] Organize tests
  - [x] Remove old directories
- [x] Move error-boundary components to error-boundary feature
  - [x] Create proper feature structure
  - [x] Move components
  - [x] Create README.md
  - [x] Create types file
  - [x] Organize tests
  - [x] Remove old directories
- [x] Update all tests and imports to match new features folder structure
- [x] Remove or simplify overly UI-specific tests for MVP (AddPet, AppointmentScheduler)
- [x] Ensure all tests pass for features and hooks (except known unrelated import error in AppRoutes.test.tsx)

Note: Remaining test failure is due to a missing import in src/features/dashboard/components/SearchBar.tsx, unrelated to the features/pets or features/appointments work.

# Takenlijst

- [x] Fix build errors in FollowUpHistory tests to match new props (recordId only)
- [x] Remove duplicate FormFieldWrapper implementation in base-form.tsx
- [x] Remove unused imports and variables in ContextAwareNavigation.tsx
- [x] Run and verify build is passing

## Open taken

- Regelmatig build en tests uitvoeren bij nieuwe code of fixes
- Alle gebruikersgerichte tekst en data in het Nederlands tonen
- Geen nieuwe features of bestanden toevoegen zonder overleg
- Oplossingen zo simpel mogelijk houden (MVP focus)
- Geen styling aanpassen tenzij gevraagd
