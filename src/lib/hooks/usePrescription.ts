import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Prescription } from "@/lib/api/types";
import type { UsePrescriptionReturn } from "./types";
import { api } from "@/lib/api";

export function usePrescription(id?: string): UsePrescriptionReturn {
  const queryClient = useQueryClient();

  const {
    data: prescription,
    isLoading,
    error,
  } = useQuery<Prescription>({
    queryKey: ["prescription", id],
    queryFn: () => api.get(`/prescriptions/${id}`),
    enabled: !!id,
  });

  const createPrescription = useMutation({
    mutationFn: async (data: Omit<Prescription, "id">) => {
      await api.post("/prescriptions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });

  const updatePrescription = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Prescription>;
    }) => {
      await api.patch(`/prescriptions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });

  const deletePrescription = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/prescriptions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });

  return {
    data: prescription,
    isLoading,
    error: error as Error | null,
    createPrescription: createPrescription.mutateAsync,
    updatePrescription: (id: string, data: Partial<Prescription>) =>
      updatePrescription.mutateAsync({ id, data }),
    deletePrescription: deletePrescription.mutateAsync,
  };
}
