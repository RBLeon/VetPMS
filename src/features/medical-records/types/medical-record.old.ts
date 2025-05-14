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
