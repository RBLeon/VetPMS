import { Appointment } from "../types";

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Max",
    clientId: "1",
    clientName: "Jan Jansen",
    providerId: "1",
    date: "2024-03-20",
    time: "10:00",
    type: "CONTROLE",
    status: "INGEPLAND",
    notes: "Reguliere controle",
    createdAt: "2024-03-19T10:00:00Z",
    updatedAt: "2024-03-19T10:00:00Z",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Bella",
    clientId: "2",
    clientName: "Piet Pietersen",
    providerId: "1",
    date: "2024-03-21",
    time: "14:00",
    type: "VACCINATIE",
    status: "INGEPLAND",
    notes: "Jaarlijkse vaccinatie",
    createdAt: "2024-03-19T11:00:00Z",
    updatedAt: "2024-03-19T11:00:00Z",
  },
];
