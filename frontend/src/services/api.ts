import { MedicalRecord } from "@/types/medical";
import { apiClient } from "./apiClient";

// ... existing code ...

export const getMedicalRecords = async (
  patientId: string
): Promise<MedicalRecord[]> => {
  const response = await apiClient.get(
    `/api/medical-records?patientId=${patientId}`
  );
  return response.data;
};

export const addMedicalRecord = async (
  record: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">
): Promise<MedicalRecord> => {
  const response = await apiClient.post("/api/medical-records", record);
  return response.data;
};

export const updateMedicalRecord = async (
  record: MedicalRecord
): Promise<MedicalRecord> => {
  const response = await apiClient.put(
    `/api/medical-records/${record.id}`,
    record
  );
  return response.data;
};

export const deleteMedicalRecord = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/medical-records/${id}`);
};
