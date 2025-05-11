export type MedicalRecordStatus =
  | "ACTIEF"
  | "OPGELOST"
  | "IN_AFWACHTING"
  | "GEANNULEERD";

export interface MedicalRecord {
  id: string;
  patientId: string;
  veterinarianId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUpDate: string;
  status: MedicalRecordStatus;
  createdAt: string;
  updatedAt: string;
}
