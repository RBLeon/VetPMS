import { QueryClient } from "@tanstack/react-query";
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  Client,
  MedicalRecord,
  Patient,
  StaffMember,
  InventoryItem,
  Treatment,
  Prescription,
  Attachment,
  ClientFeedback,
  Address,
  Invoice,
} from "./types";
import { mockClients } from "./mockData/clients";
import { mockPatients } from "./mockData/patients";
import { mockAppointments } from "./mockData/appointments";
import { mockMedicalRecords } from "./mockData/medicalRecords";
import { mockStaffMembers } from "./mockData/staff";
import { mockInventoryItems } from "./mockData/inventory";
import { mockClientFeedback } from "./mockData/clientFeedback";

// Configure the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Export the mock API functions
const mockApi = {
  // Data
  clients: mockClients,
  patients: mockPatients,
  appointments: mockAppointments,
  medicalRecords: mockMedicalRecords,
  staffMembers: mockStaffMembers,
  inventoryItems: mockInventoryItems,
  staff: mockStaffMembers,
  inventory: mockInventoryItems,
  invoices: [],
  clientFeedback: mockClientFeedback,

  // Client methods
  getClients: async () => mockClients,
  getClient: async (id: string) => mockClients.find((c: Client) => c.id === id),
  createClient: async (data: Omit<Client, "id">) => ({
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  }),
  updateClient: async (id: string, data: Partial<Client>) => ({
    ...mockClients.find((c: Client) => c.id === id),
    ...data,
  }),
  deleteClient: async (id: string) => id,

  // Patient methods
  getPatients: async () => mockPatients,
  getPatient: async (id: string) =>
    mockPatients.find((p: Patient) => p.id === id),
  getClientPatients: async (clientId: string) =>
    mockPatients.filter((p: Patient) => p.clientId === clientId),
  createPatient: async (data: Omit<Patient, "id">) => ({
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  }),
  updatePatient: async (id: string, data: Partial<Patient>) => ({
    ...mockPatients.find((p: Patient) => p.id === id),
    ...data,
  }),
  deletePatient: async (id: string) => id,

  // Appointment methods
  getAppointments: async () => mockAppointments,
  getAppointment: async (id: string) =>
    mockAppointments.find((a) => a.id === id),
  getPatientAppointments: async (patientId: string) =>
    mockAppointments.filter((a) => a.patientId === patientId),
  createAppointment: async (data: Omit<Appointment, "id">) => ({
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  }),
  updateAppointment: async (id: string, data: Partial<Appointment>) => ({
    ...mockAppointments.find((a) => a.id === id),
    ...data,
  }),
  deleteAppointment: async (id: string) => id,

  // Medical Record methods
  getMedicalRecords: async () => mockMedicalRecords,
  getMedicalRecord: async (id: string) =>
    mockMedicalRecords.find((r: MedicalRecord) => r.id === id),
  createMedicalRecord: async (data: Omit<MedicalRecord, "id">) => ({
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  }),
  updateMedicalRecord: async (id: string, data: Partial<MedicalRecord>) => ({
    ...mockMedicalRecords.find((r: MedicalRecord) => r.id === id),
    ...data,
  }),
  deleteMedicalRecord: async (id: string) => id,

  // Staff methods
  getStaff: async () => mockStaffMembers,
  getStaffMember: async (id: string) =>
    mockStaffMembers.find((s: StaffMember) => s.id === id),
  createStaffMember: async (data: Omit<StaffMember, "id">) => ({
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  }),
  updateStaffMember: async (id: string, data: Partial<StaffMember>) => ({
    ...mockStaffMembers.find((s: StaffMember) => s.id === id),
    ...data,
  }),
  deleteStaffMember: async (id: string) => id,

  // Inventory methods
  getInventory: async () => mockInventoryItems,
  getInventoryItem: async (id: string) =>
    mockInventoryItems.find((i: InventoryItem) => i.id === id),
  createInventoryItem: async (data: Omit<InventoryItem, "id">) => ({
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  }),
  updateInventoryItem: async (id: string, data: Partial<InventoryItem>) => ({
    ...mockInventoryItems.find((i: InventoryItem) => i.id === id),
    ...data,
  }),
  deleteInventoryItem: async (id: string) => id,

  // Invoice methods
  getInvoices: async () => [],
  getInvoice: async () => undefined,
  createInvoice: async (data: Omit<Invoice, "id">) => ({
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  }),
  updateInvoice: async (id: string, data: Partial<Invoice>) => ({
    id,
    ...data,
  }),
  deleteInvoice: async (id: string) => id,

  // Client Feedback methods
  getClientFeedback: async () => mockClientFeedback,
  getClientFeedbackById: async (id: string) =>
    mockClientFeedback.find((f: ClientFeedback) => f.id === id),
  createClientFeedback: async (data: Omit<ClientFeedback, "id">) => ({
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  }),
  updateClientFeedback: async (id: string, data: Partial<ClientFeedback>) => ({
    ...mockClientFeedback.find((f: ClientFeedback) => f.id === id),
    ...data,
  }),
  deleteClientFeedback: async (id: string) => id,
};

export { mockApi, queryClient };

// Re-export types from types.ts
export type {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  Client,
  MedicalRecord,
  Patient,
  StaffMember,
  InventoryItem,
  Treatment,
  Prescription,
  Attachment,
  ClientFeedback,
  Address,
  Invoice,
};
