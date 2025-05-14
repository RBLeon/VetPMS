export type MedicalRecordStatus =
  | "ACTIEF"
  | "OPGELOST"
  | "IN_AFWACHTING"
  | "GEANNULEERD";

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  veterinarianId: string;
  veterinarianName: string;
  type: string;
  date: string;
  status: MedicalRecordStatus;
  followUpDate?: string;
  notes?: string;
  diagnosis?: string;
  vitalSigns?: string;
  followUpNotes?: string;
  treatment?: string;
  treatments?: Treatment[];
  prescriptions?: Prescription[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
  chiefComplaint: string;
}

export interface Treatment {
  id: string;
  name: string;
  cost: number;
  duration: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}
