import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MedicalRecord } from "@/lib/api/types";
import type { UseMedicalRecordReturn } from "./types";
import { api } from "@/lib/api";

export function useMedicalRecord(id?: string): UseMedicalRecordReturn {
  const queryClient = useQueryClient();

  const {
    data: medicalRecord,
    isLoading,
    error,
  } = useQuery<MedicalRecord>({
    queryKey: ["medicalRecord", id],
    queryFn: () => api.get(`/medical-records/${id}`),
    enabled: !!id,
  });

  const createMedicalRecord = useMutation({
    mutationFn: async (data: Omit<MedicalRecord, "id">) => {
      await api.post("/medical-records", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    },
  });

  const updateMedicalRecord = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<MedicalRecord>;
    }) => {
      await api.patch(`/medical-records/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    },
  });

  const deleteMedicalRecord = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/medical-records/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    },
  });

  return {
    data: medicalRecord,
    isLoading,
    error: error as Error | null,
    createMedicalRecord: createMedicalRecord.mutateAsync,
    updateMedicalRecord: (id: string, data: Partial<MedicalRecord>) =>
      updateMedicalRecord.mutateAsync({ id, data }),
    deleteMedicalRecord: deleteMedicalRecord.mutateAsync,
  };
}
