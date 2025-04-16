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
  email?: string;
  phone?: string;
  address?: Address;
  patients?: Patient[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Patient Types
export interface Patient {
  id: string;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  birthDate?: string;
  sex?: 'male' | 'female' | 'unknown';
  microchipId?: string;
  status: string;
  ownerId: string;
  owner?: Client;
  weight?: PatientWeight[];
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
export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  vetId?: string;
  title: string;
  reason: string;
  status: string;
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Medical Record Types
export interface MedicalRecord {
  id: string;
  patientId: string;
  vetId: string;
  type: string;
  date: string;
  notes: string;
  diagnosis?: string;
  treatments?: Treatment[];
  prescriptions?: Prescription[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  cost?: number;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
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
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  cost: number;
  price: number;
  reorderLevel?: number;
  supplier?: string;
  location?: string;
  expiryDate?: string;
  notes?: string;
}

// Common Types
export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
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