/**
 * API Type Definitions
 * Contains type definitions for the API clients and their parameters
 */

// Common API Response Types
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
  species: "DOG" | "CAT" | "BIRD" | "REPTILE" | "SMALL_MAMMAL" | "OTHER";
  breed: string;
  age: number;
  weight: number;
  dateOfBirth: string;
  lastVisit: string;
  clientId: string;
  gender: "male" | "female" | "unknown";
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
  | "SCHEDULED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "NO_SHOW";

export type AppointmentType =
  | "CHECK_UP"
  | "VACCINATION"
  | "SURGERY"
  | "CONSULTATION"
  | "DENTAL"
  | "EMERGENCY";

export type ReminderType = "EMAIL" | "SMS" | "PUSH";
export type ReminderTime = "15m" | "30m" | "1h" | "24h" | "48h";
export type RecurringFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  clientId: string;
  client?: Client;
  providerId: string;
  resourceIds?: string[];
  startTime: Date;
  endTime: Date;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: RecurringFrequency;
    interval: number;
    endDate?: string;
  };
  reminder?: {
    type: ReminderType;
    time: ReminderTime;
  };
  createdAt: string;
  updatedAt: string;
}

// Medical Record Types
export type MedicalRecordStatus =
  | "ACTIVE"
  | "RESOLVED"
  | "PENDING"
  | "CANCELLED";

export interface MedicalRecord {
  id: string;
  patientId: string;
  patient?: Patient;
  veterinarianId: string;
  type: string;
  date: string;
  status: MedicalRecordStatus;
  notes: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan?: string;
  vitalSigns?: {
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
    bloodPressure?: string;
    weight?: number;
  };
  treatments?: Treatment[];
  prescriptions?: Prescription[];
  attachments?: Attachment[];
  followUpDate?: string;
  followUpNotes?: string;
  hasAttachments: boolean;
  followUpScheduled: boolean;
  createdAt: string;
  updatedAt: string;
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
  category: string;
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
  category: "SERVICE" | "STAFF" | "FACILITY" | "GENERAL";
  status: "PENDING" | "REVIEWED" | "ADDRESSED";
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
