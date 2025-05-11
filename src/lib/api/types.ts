/**
 * API Type Definities
 * Bevat type definities voor de API clients en hun parameters
 */

// Algemene API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

// Authentication Types
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  user?: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  permissions?: string[];
  tenantId?: string;
}

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  plan?: string;
  status: string;
  settings?: Record<string, unknown>;
}

// Client Types
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: Address;
  preferredCommunication: "email" | "phone" | "sms";
  patients?: Patient[];
  notes?: string;
  lastVisit: string;
  createdAt: string;
  updatedAt: string;
}

// Patient Types
export interface Patient {
  id: string;
  name: string;
  species: "HOND" | "KAT" | "VOGEL" | "REPTIEL" | "KLEIN_ZOOGDIER" | "ANDERS";
  breed: string;
  age: number;
  weight: number;
  dateOfBirth: string;
  lastVisit: string;
  clientId: string;
  gender: "mannelijk" | "vrouwelijk" | "onbekend";
  microchipNumber?: string;
  color?: string;
  allergies?: string[];
  medicalConditions?: string[];
  vaccinations?: {
    name: string;
    date: string;
    nextDueDate: string;
  }[];
  medicalRecords?: MedicalRecord[];
  notes?: string;
  alerts?: PatientAlert[];
  status: "ACTIVE" | "INACTIVE" | "UNDER_CARE" | "DECEASED";
  needsVitalsCheck: boolean;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientWeight {
  id: string;
  value: number;
  unit: string;
  date: string;
}

export interface PatientAlert {
  id: string;
  type: string;
  description: string;
  active: boolean;
}

// Appointment Types
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

export type ReminderType = "EMAIL" | "SMS" | "PUSH";
export type ReminderTime = "15m" | "30m" | "1h" | "24h" | "48h";
export type RecurringFrequency =
  | "DAGELIJKS"
  | "WEKELIJKS"
  | "MAANDELIJKS"
  | "JAARLIJKS";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  clientId: string;
  clientName: string;
  providerId: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: "DAGELIJKS" | "WEKELIJKS" | "MAANDELIJKS" | "JAARLIJKS";
    interval: number;
    endDate?: string;
  };
  reminder?: {
    type: "EMAIL" | "SMS" | "PUSH";
    time: "15m" | "30m" | "1u" | "24u" | "48u";
  };
  isNewClient?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Medical Record Types
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
  description: string;
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

// Billing Types
export interface Invoice {
  id: string;
  clientId: string;
  patientId?: string;
  appointmentId?: string;
  total: number;
  discount?: number;
  tax?: number;
  status: string;
  dueDate: string;
  items: InvoiceItem[];
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  itemType: string;
  itemId?: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  notes?: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: "MEDICATIE" | "MATERIAAL" | "APPARATUUR" | "VOER";
  quantity: number;
  unit: string;
  cost: number;
  reorderLevel: number;
  expiryDate: string;
  supplier: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

// Common Types
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages?: number;
  totalItems?: number;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

// API Client Interface Types
export interface ApiClientOptions {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiClientInterface {
  get<T>(url: string, params?: QueryParams): Promise<T>;
  post<T>(url: string, data: unknown): Promise<T>;
  put<T>(url: string, data: unknown): Promise<T>;
  delete<T>(url: string, params?: QueryParams): Promise<T>;
  patch<T>(url: string, data: unknown): Promise<T>;
}

// Animana API specific types
export interface AnimanaPatient {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  dateOfBirth?: string;
  weight?: string;
  microchip?: string;
  owner?: AnimanaOwner;
  // Additional Animana-specific fields
  patientNumber?: string;
  alertCodes?: string[];
}

export interface AnimanaOwner {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  // Additional Animana-specific fields
  customerNumber?: string;
}

export interface AnimanaAppointment {
  id: string;
  startDateTime: string;
  endDateTime: string;
  subject: string;
  description?: string;
  status: string;
  patientId?: string;
  patient?: AnimanaPatient;
  resourceIds?: string[];
}

export interface AnimanaTreatment {
  id: string;
  description: string;
  price: number;
  quantity: number;
  date: string;
  invoiceId?: string;
  patientId: string;
}

export interface AnimanaInvoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  total: number;
  status: string;
  customerId: string;
  lines: AnimanaInvoiceLine[];
}

export interface AnimanaInvoiceLine {
  description: string;
  quantity: number;
  price: number;
  total: number;
  treatmentId?: string;
}

export interface ClientFeedback {
  id: string;
  clientId: string;
  appointmentId?: string;
  rating: number;
  comment: string;
  category: "SERVICE" | "PERSONEEL" | "FACILITEIT" | "ALGEMEEN";
  status: "IN_AFWACHTING" | "BEKEKEN" | "AFGEHANDELD";
  createdAt: string;
  updatedAt: string;
}

// Update StaffMember interface
export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "VETERINARIAN" | "NURSE" | "RECEPTIONIST" | "MANAGER" | "CEO";
  specialization?: string;
  hoursWorked: number;
  schedule?: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  status: "VOLTOOID" | "IN_BEHANDELING" | "IN_AFWACHTING";
  orderedBy: string;
  orderedDate: string;
  completedDate: string;
  results: string;
  notes: string;
  priority: "hoog" | "middel" | "laag";
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends UserProfile {
  role: "VETERINARIAN" | "NURSE" | "RECEPTIONIST" | "MANAGER" | "CEO";
  permissions: string[];
  tenantId: string;
}

// Add Bill type for MVP if not present
export interface Bill {
  id: string;
  invoiceNumber: string;
  date: string;
  clientName: string;
  amount: number;
  status: BillStatus;
  items: BillItem[];
  createdAt: string;
  updatedAt: string;
}

// Add Role type for use throughout the app
export type Role =
  | "VETERINARIAN"
  | "NURSE"
  | "RECEPTIONIST"
  | "MANAGER"
  | "CEO";

export type BillStatus = "OPEN" | "BETAALD" | "GEANNULEERD";

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Metrics {
  totalAppointments: number;
  totalPatients: number;
  totalRevenue: number;
  appointmentsByStatus: Record<string, number>;
}
