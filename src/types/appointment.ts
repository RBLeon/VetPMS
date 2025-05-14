export enum AppointmentStatus {
  INGEPLAND = "INGEPLAND",
  AANGEMELD = "AANGEMELD",
  IN_BEHANDELING = "IN_BEHANDELING",
  VOLTOOID = "VOLTOOID",
  GEANNULEERD = "GEANNULEERD",
  NIET_VERSCHENEN = "NIET_VERSCHENEN",
}

export enum AppointmentType {
  CONSULTATIE = "CONSULTATIE",
  VACCINATIE = "VACCINATIE",
  CONTROLE = "CONTROLE",
  OPERATIE = "OPERATIE",
  ANDERS = "ANDERS",
}

export interface Appointment {
  id: string;
  userId: string;
  petId: string;
  vetId: string;
  date: string;
  time: string;
  type: AppointmentType;
  notes?: string;
  status: AppointmentStatus;
  clientName: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}
