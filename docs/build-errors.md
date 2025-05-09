# Build Errors

## Current Build Errors

### High Priority

1. Type Errors in `mockApi.ts`:

   - Duplicate exports of `queryClient` and `api`
   - Export declaration conflicts for types: `Appointment`, `Patient`, `Client`, `MedicalRecord`, `Invoice`, `StaffMember`, `InventoryItem`
   - Missing `ClientFeedback` type definition

2. Type Errors in `useApi.ts`:

   - Missing `ClientFeedback` type import
   - Type conflicts in mutation functions

3. Type Errors in `useMedicalRecords.ts`:
   - Import declaration conflicts with local declaration of `MedicalRecord`

### Medium Priority

1. Type Errors in `ManagerDashboard.tsx`:

   - Invalid Badge variant "warning"
   - Unused imports and variables
   - Type mismatches in appointment status comparisons

2. Type Errors in `NurseDashboard.tsx`:

   - Invalid appointment status comparisons
   - Possibly undefined variables
   - Missing properties in MedicalRecord type

3. Type Errors in `ReceptionistDashboard.tsx`:
   - Invalid appointment status comparisons
   - Missing properties in Client type (firstName, lastName)

### Low Priority

1. Unused imports and variables across multiple files:

   - `Calendar.tsx`
   - `AppointmentForm.tsx`
   - `MedicalRecordForm.tsx`
   - `PatientDetails.tsx`
   - `VeterinarianDashboard.tsx`

2. Type definition issues:
   - Missing properties in interfaces
   - Implicit any types
   - Type mismatches in form data

## Action Items

### High Priority

1. Fix duplicate exports in `mockApi.ts`
2. Add missing `ClientFeedback` type definition
3. Resolve type conflicts in `useMedicalRecords.ts`

### Medium Priority

1. Update Badge component to support "warning" variant
2. Fix appointment status type definitions
3. Update Client interface with missing properties

### Low Priority

1. Clean up unused imports and variables
2. Add missing interface properties
3. Fix type definitions in forms

## Notes

- Fix high priority errors first as they affect core functionality
- Run build after each fix to ensure no new errors are introduced
- Consider adding TypeScript strict mode to catch these issues earlier
- Document any new errors that appear after fixes
