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
  invoices: [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      clientId: "1",
      appointmentId: "1",
      invoiceDate: "2024-03-20",
      dueDate: "2024-04-19",
      status: "PAID",
      subtotal: 85.0,
      taxAmount: 17.85,
      discountAmount: 0,
      totalAmount: 102.85,
      paidAmount: 102.85,
      notes: "Reguliere controle",
      createdAt: "2024-03-20T09:30:00Z",
      updatedAt: "2024-03-20T09:30:00Z",
      createdBy: "1",
      total: 102.85,
      items: [
        {
          id: "1",
          description: "Reguliere controle",
          quantity: 1,
          unitPrice: 85.0,
          total: 85.0,
          itemType: "SERVICE",
          itemId: "1",
        },
      ],
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      clientId: "2",
      appointmentId: "2",
      invoiceDate: "2024-03-20",
      dueDate: "2024-04-19",
      status: "PENDING",
      subtotal: 65.0,
      taxAmount: 13.65,
      discountAmount: 0,
      totalAmount: 78.65,
      paidAmount: 0,
      notes: "Jaarlijkse vaccinatie",
      createdAt: "2024-03-20T10:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
      createdBy: "1",
      total: 78.65,
      items: [
        {
          id: "2",
          description: "Jaarlijkse vaccinatie",
          quantity: 1,
          unitPrice: 65.0,
          total: 65.0,
          itemType: "SERVICE",
          itemId: "2",
        },
      ],
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      clientId: "3",
      appointmentId: "3",
      invoiceDate: "2024-03-20",
      dueDate: "2024-04-19",
      status: "PENDING",
      subtotal: 350.0,
      taxAmount: 73.5,
      discountAmount: 0,
      totalAmount: 423.5,
      paidAmount: 0,
      notes: "Sterilisatie operatie",
      createdAt: "2024-03-20T11:00:00Z",
      updatedAt: "2024-03-20T11:00:00Z",
      createdBy: "2",
      total: 423.5,
      items: [
        {
          id: "3",
          description: "Sterilisatie operatie",
          quantity: 1,
          unitPrice: 350.0,
          total: 350.0,
          itemType: "SERVICE",
          itemId: "3",
        },
      ],
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      clientId: "4",
      appointmentId: "4",
      invoiceDate: "2024-03-20",
      dueDate: "2024-04-19",
      status: "PAID",
      subtotal: 95.0,
      taxAmount: 19.95,
      discountAmount: 0,
      totalAmount: 114.95,
      paidAmount: 114.95,
      notes: "Follow-up na operatie",
      createdAt: "2024-03-20T13:00:00Z",
      updatedAt: "2024-03-20T13:00:00Z",
      createdBy: "2",
      total: 114.95,
      items: [
        {
          id: "4",
          description: "Follow-up na operatie",
          quantity: 1,
          unitPrice: 95.0,
          total: 95.0,
          itemType: "SERVICE",
          itemId: "4",
        },
      ],
    },
    {
      id: "5",
      invoiceNumber: "INV-2024-005",
      clientId: "5",
      appointmentId: "5",
      invoiceDate: "2024-03-20",
      dueDate: "2024-04-19",
      status: "PENDING",
      subtotal: 120.0,
      taxAmount: 25.2,
      discountAmount: 0,
      totalAmount: 145.2,
      paidAmount: 0,
      notes: "Spoedbehandeling",
      createdAt: "2024-03-20T14:00:00Z",
      updatedAt: "2024-03-20T14:00:00Z",
      createdBy: "1",
      total: 145.2,
      items: [
        {
          id: "5",
          description: "Spoedbehandeling",
          quantity: 1,
          unitPrice: 120.0,
          total: 120.0,
          itemType: "SERVICE",
          itemId: "5",
        },
      ],
    },
  ],
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

  // Treatment methods
  getTreatments: async () => [
    {
      id: "1",
      patientName: "Max",
      type: "Vaccinatie",
      date: new Date().toISOString(),
      status: "VOLTOOID",
      notes: "Jaarlijkse vaccinatie",
    },
    {
      id: "2",
      patientName: "Bella",
      type: "Controle",
      date: new Date().toISOString(),
      status: "IN_BEHANDELING",
      notes: "Routine controle",
    },
    {
      id: "3",
      patientName: "Charlie",
      type: "Operatie",
      date: new Date().toISOString(),
      status: "INGEPLAND",
      notes: "Sterilisatie",
    },
  ],

  getTreatment: async (id: string) => ({
    id,
    patientName: "Max",
    type: "Vaccinatie",
    date: new Date().toISOString(),
    status: "VOLTOOID",
    notes: "Jaarlijkse vaccinatie",
  }),
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
