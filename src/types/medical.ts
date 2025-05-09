export interface MedicalRecord {
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
