# Medical Records Feature

This feature provides a comprehensive medical records management system for veterinary practices. It allows veterinarians to create, view, update, and delete medical records for their patients.

## Components

### MedicalRecordsList

The main component for displaying and managing medical records.

#### Props

- `patientId` (string, required): The ID of the patient whose medical records are being displayed.

#### Features

- Display medical records in a table format
- Add new medical records
- Edit existing medical records
- Delete medical records
- Filter records by date range
- Filter records by status
- Sort records by date
- Pagination support

#### Usage

```tsx
import { MedicalRecordsList } from "@/components/medical-records/MedicalRecordsList";

function PatientPage({ patientId }) {
  return (
    <div>
      <h1>Patient Medical Records</h1>
      <MedicalRecordsList patientId={patientId} />
    </div>
  );
}
```

## Hooks

### useMedicalRecords

A custom hook for managing medical records data and operations.

#### Parameters

- `patientId` (string, required): The ID of the patient whose medical records are being managed.

#### Returns

- `medicalRecords` (MedicalRecord[]): Array of medical records
- `isLoading` (boolean): Loading state indicator
- `error` (string | null): Error message if any
- `addMedicalRecord` (function): Function to add a new medical record
- `updateMedicalRecord` (function): Function to update an existing medical record
- `deleteMedicalRecord` (function): Function to delete a medical record

#### Usage

```tsx
import { useMedicalRecords } from "@/hooks/useMedicalRecords";

function MedicalRecordsManager({ patientId }) {
  const {
    medicalRecords,
    isLoading,
    error,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
  } = useMedicalRecords(patientId);

  // Use the hook's returned values and functions
}
```

## Types

### MedicalRecord

```typescript
interface MedicalRecord {
  id: string;
  patientId: string;
  veterinarianId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpDate: string;
  status: "active" | "resolved" | "pending";
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### GET /api/medical-records

Fetches medical records for a specific patient.

Query Parameters:

- `patientId` (string, required): The ID of the patient

### POST /api/medical-records

Creates a new medical record.

Request Body:

```typescript
{
  patientId: string;
  veterinarianId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpDate: string;
  status: "active" | "resolved" | "pending";
}
```

### PUT /api/medical-records/:id

Updates an existing medical record.

Request Body:

```typescript
{
  id: string;
  patientId: string;
  veterinarianId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpDate: string;
  status: "active" | "resolved" | "pending";
}
```

### DELETE /api/medical-records/:id

Deletes a medical record.

## Future Enhancements

1. Add confirmation dialog for delete action
2. Add form validation for dates (follow-up date should be after record date)
3. Add loading spinners for actions
4. Add error boundaries
5. Add unit tests for date validation
6. Add integration tests for the complete flow
7. Add accessibility features
8. Add keyboard navigation
9. Add tooltips for actions
10. Add bulk actions (delete multiple records)
