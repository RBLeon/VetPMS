import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MedicalRecord } from "../types/medical";

export const useMedicalRecords = (patientId: string) => {
  const queryClient = useQueryClient();

  const {
    data: medicalRecords = [],
    isLoading,
    error,
  } = useQuery<MedicalRecord[]>({
    queryKey: ["medicalRecords", patientId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [];
    },
  });

  const addMedicalRecordMutation = useMutation({
    mutationFn: async (record: Omit<MedicalRecord, "id">) => {
      // TODO: Replace with actual API call
      return { ...record, id: Math.random().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicalRecords", patientId],
      });
    },
  });

  const updateMedicalRecordMutation = useMutation({
    mutationFn: async (record: MedicalRecord) => {
      // TODO: Replace with actual API call
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicalRecords", patientId],
      });
    },
  });

  const deleteMedicalRecordMutation = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API call
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicalRecords", patientId],
      });
    },
  });

  return {
    medicalRecords,
    isLoading,
    error,
    addMedicalRecord: addMedicalRecordMutation.mutateAsync,
    updateMedicalRecord: updateMedicalRecordMutation.mutateAsync,
    deleteMedicalRecord: deleteMedicalRecordMutation.mutateAsync,
  };
};
