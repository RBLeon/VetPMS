export type MedicalRecordStatus =
  | "DRAFT"
  | "PENDING"
  | "COMPLETED"
  | "ARCHIVED";

export type MedicalRecordType =
  | "CONSULTATION"
  | "TREATMENT"
  | "SURGERY"
  | "VACCINATION"
  | "TEST_RESULT"
  | "FOLLOW_UP";

export interface MedicalRecord {
  id: string;
  patientId: string;
  providerId: string;
  type: MedicalRecordType;
  status: MedicalRecordStatus;
  date: string;
  notes: string;
  diagnosis?: string;
  treatment?: string;
  followUpDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  medicalRecordId: string;
  patientId: string;
  providerId: string;
  date: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordFormData {
  type: MedicalRecordType;
  notes: string;
  diagnosis?: string;
  treatment?: string;
  followUpDate?: string;
  attachments?: string[];
}

export interface MedicalRecordListProps {
  patientId: string;
}

export interface MedicalRecordFormProps {
  initialData?: Partial<MedicalRecord>;
  onSubmit: (data: MedicalRecordFormData) => void;
  onCancel: () => void;
  mode?: "create" | "edit";
}

export interface FollowUpFormProps {
  patient: {
    id: string;
    name: string;
    species: string;
    breed: string;
  };
  onSubmit: (data: Omit<FollowUp, "id" | "createdAt" | "updatedAt">) => void;
}

export interface FollowUpHistoryProps {
  patientId: string;
  medicalRecordId: string;
}
