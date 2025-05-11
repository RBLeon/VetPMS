import type {
  Appointment,
  Bill,
  MedicalRecord,
  Patient,
  Prescription,
  User,
} from "@/lib/api/types";

export enum Role {
  VETERINARIAN = "VETERINARIAN",
  RECEPTIONIST = "RECEPTIONIST",
  NURSE = "NURSE",
  MANAGER = "MANAGER",
  CEO = "CEO",
}

// Auth Hook Types
export interface UseAuthReturn {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (data: {
    username: string;
    password: string;
    email: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

// Bills Hook Types
export interface UseBillsReturn {
  data: Bill[];
  isLoading: boolean;
  error: Error | null;
  createBill: (data: Omit<Bill, "id">) => Promise<void>;
  updateBill: (id: string, data: Partial<Bill>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
}

// Appointment Hook Types
export interface UseAppointmentReturn {
  data: Appointment | undefined;
  isLoading: boolean;
  error: Error | null;
  createAppointment: (data: Omit<Appointment, "id">) => Promise<void>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

// Medical Record Hook Types
export interface UseMedicalRecordReturn {
  data: MedicalRecord | undefined;
  isLoading: boolean;
  error: Error | null;
  createMedicalRecord: (data: Omit<MedicalRecord, "id">) => Promise<void>;
  updateMedicalRecord: (
    id: string,
    data: Partial<MedicalRecord>
  ) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;
}

// Prescription Hook Types
export interface UsePrescriptionReturn {
  data: Prescription | undefined;
  isLoading: boolean;
  error: Error | null;
  createPrescription: (data: Omit<Prescription, "id">) => Promise<void>;
  updatePrescription: (
    id: string,
    data: Partial<Prescription>
  ) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>;
}

// Patient Hook Types
export interface UsePatientReturn {
  data: Patient | undefined;
  isLoading: boolean;
  error: Error | null;
  createPatient: (data: Omit<Patient, "id">) => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
}

// Settings Hook Types
export interface UseSettingsReturn {
  data: Record<string, unknown>;
  isLoading: boolean;
  error: Error | null;
  updateSettings: (data: Record<string, unknown>) => Promise<void>;
  resetSettings: () => Promise<void>;
}
