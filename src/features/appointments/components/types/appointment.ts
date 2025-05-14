export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  startTime: string;
  endTime: string;
  type: string;
  status: AppointmentStatus;
  notes?: string;
}

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export interface Resource {
  id: string;
  name: string;
  type: "PROVIDER" | "ROOM" | "EQUIPMENT";
  color?: string;
}

export interface AppointmentTypeConfig {
  id: string;
  name: string;
  color: string;
  defaultDuration: number;
}
