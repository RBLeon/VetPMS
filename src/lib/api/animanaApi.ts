// Client for Animana API integration
import { api } from './api';
import {
  AnimanaOwner,
  AnimanaPatient,
  AnimanaAppointment,
  MedicalRecord,
  ApiResponse
} from './types';

class AnimanaApiClient {
  // Methods for Animana-specific API calls
  
  // Client Management
  async getClients(query?: string, page = 1, limit = 20) {
    return api.get<ApiResponse<AnimanaOwner[]>>(`/animana/clients?query=${query || ''}&page=${page}&limit=${limit}`);
  }
  
  async getClientById(clientId: string) {
    return api.get<ApiResponse<AnimanaOwner>>(`/animana/clients/${clientId}`);
  }
  
  async createClient(clientData: Omit<AnimanaOwner, 'id'>) {
    return api.post<ApiResponse<AnimanaOwner>>('/animana/clients', clientData);
  }
  
  async updateClient(clientId: string, clientData: Partial<AnimanaOwner>) {
    return api.put<ApiResponse<AnimanaOwner>>(`/animana/clients/${clientId}`, clientData);
  }
  
  // Patient Management
  async getPatients(clientId?: string, query?: string, page = 1, limit = 20) {
    let url = `/animana/patients?page=${page}&limit=${limit}`;
    if (clientId) url += `&clientId=${clientId}`;
    if (query) url += `&query=${query}`;
    return api.get<ApiResponse<AnimanaPatient[]>>(url);
  }
  
  async getPatientById(patientId: string) {
    return api.get<ApiResponse<AnimanaPatient>>(`/animana/patients/${patientId}`);
  }
  
  async createPatient(patientData: Omit<AnimanaPatient, 'id'>) {
    return api.post<ApiResponse<AnimanaPatient>>('/animana/patients', patientData);
  }
  
  async updatePatient(patientId: string, patientData: Partial<AnimanaPatient>) {
    return api.put<ApiResponse<AnimanaPatient>>(`/animana/patients/${patientId}`, patientData);
  }
  
  // Medical Records
  async getMedicalRecords(patientId: string, page = 1, limit = 20) {
    return api.get<ApiResponse<MedicalRecord[]>>(`/animana/patients/${patientId}/records?page=${page}&limit=${limit}`);
  }
  
  async createMedicalRecord(patientId: string, recordData: Omit<MedicalRecord, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>) {
    return api.post<ApiResponse<MedicalRecord>>(`/animana/patients/${patientId}/records`, recordData);
  }
  
  // Appointment Scheduling
  async getAppointments(
    startDate?: string,
    endDate?: string,
    providerId?: string,
    page = 1,
    limit = 20
  ) {
    let url = `/animana/appointments?page=${page}&limit=${limit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    if (providerId) url += `&providerId=${providerId}`;
    return api.get<ApiResponse<AnimanaAppointment[]>>(url);
  }
  
  async getAppointmentById(appointmentId: string) {
    return api.get<ApiResponse<AnimanaAppointment>>(`/animana/appointments/${appointmentId}`);
  }
  
  async createAppointment(appointmentData: Omit<AnimanaAppointment, 'id'>) {
    return api.post<ApiResponse<AnimanaAppointment>>('/animana/appointments', appointmentData);
  }
  
  async updateAppointment(appointmentId: string, appointmentData: Partial<AnimanaAppointment>) {
    return api.put<ApiResponse<AnimanaAppointment>>(`/animana/appointments/${appointmentId}`, appointmentData);
  }
  
  async cancelAppointment(appointmentId: string, reason: string) {
    return api.post<ApiResponse<{ success: boolean }>>(`/animana/appointments/${appointmentId}/cancel`, { reason });
  }
  
  // Resources (staff, rooms, equipment)
  async getResources(type?: string) {
    let url = '/animana/resources';
    if (type) url += `?type=${type}`;
    return api.get<ApiResponse<Record<string, string>[]>>(url);
  }
  
  // Appointment Types
  async getAppointmentTypes() {
    return api.get<ApiResponse<Record<string, string>[]>>('/animana/appointment-types');
  }
}

// Create and export singleton instance
export const animanaApi = new AnimanaApiClient();