import { useState, useEffect } from "react";
import { MedicalRecord } from "@/types/medical";
import {
  getMedicalRecords,
  addMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "@/services/api";

interface UseMedicalRecordsReturn {
  medicalRecords: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
  addMedicalRecord: (
    record: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateMedicalRecord: (record: MedicalRecord) => Promise<void>;
  deleteMedicalRecord: (id: string) => Promise<void>;
}

export const useMedicalRecords = (
  patientId: string
): UseMedicalRecordsReturn => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const records = await getMedicalRecords(patientId);
        setMedicalRecords(records);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch medical records"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [patientId]);

  const handleAddMedicalRecord = async (
    record: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newRecord = await addMedicalRecord(record);
      setMedicalRecords((prev) => [...prev, newRecord]);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to add medical record"
      );
    }
  };

  const handleUpdateMedicalRecord = async (record: MedicalRecord) => {
    try {
      const updatedRecord = await updateMedicalRecord(record);
      setMedicalRecords((prev) =>
        prev.map((r) => (r.id === record.id ? updatedRecord : r))
      );
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update medical record"
      );
    }
  };

  const handleDeleteMedicalRecord = async (id: string) => {
    try {
      await deleteMedicalRecord(id);
      setMedicalRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete medical record"
      );
    }
  };

  return {
    medicalRecords,
    isLoading,
    error,
    addMedicalRecord: handleAddMedicalRecord,
    updateMedicalRecord: handleUpdateMedicalRecord,
    deleteMedicalRecord: handleDeleteMedicalRecord,
  };
};
