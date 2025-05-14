export type AppointmentStatus =
  | "INGEPLAND"
  | "AANGEMELD"
  | "IN_BEHANDELING"
  | "VOLTOOID"
  | "GEANNULEERD"
  | "NIET_VERSCHENEN";

export type AppointmentType =
  | "CONTROLE"
  | "VACCINATIE"
  | "OPERATIE"
  | "CONSULT"
  | "GEBITSVERZORGING"
  | "SPOEDGEVAL";

export type RecurringFrequency =
  | "DAGELIJKS"
  | "WEKELIJKS"
  | "MAANDELIJKS"
  | "JAARLIJKS";
export type ReminderType = "EMAIL" | "SMS" | "PUSH";
export type ReminderTime = "15m" | "30m" | "1u" | "24u" | "48u";

export interface AppointmentTypeConfig {
  id: string;
  name: string;
  color: string;
  defaultDuration: number;
}

export interface RecurringPattern {
  frequency: RecurringFrequency;
  interval: number;
  endDate?: string;
}

export interface Reminder {
  type: ReminderType;
  time: ReminderTime;
}

export interface Appointment {
  id: string;
  providerId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  type: AppointmentTypeConfig;
  notes?: string;
  patientId: string;
  patientName: string;
  clientId: string;
  clientName: string;
  resourceIds: string[];
  typeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  type: AppointmentType;
  date: string;
  time: string;
  status: AppointmentStatus;
  patientId: string;
  clientId: string;
  providerId: string;
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  reminder?: Reminder;
}

export interface TimeSlot {
  date: string;
  time: string;
}

export interface Resource {
  id: string;
  name: string;
  type: "PROVIDER" | "ROOM" | "EQUIPMENT";
  color?: string;
}
