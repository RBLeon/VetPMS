import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Appointment } from "@/lib/api/types";
import type { UseAppointmentReturn } from "./types";
import { api } from "@/lib/api";

export function useAppointment(id?: string): UseAppointmentReturn {
  const queryClient = useQueryClient();

  const {
    data: appointment,
    isLoading,
    error,
  } = useQuery<Appointment>({
    queryKey: ["appointment", id],
    queryFn: () => api.get(`/appointments/${id}`),
    enabled: !!id,
  });

  const createAppointment = useMutation({
    mutationFn: async (data: Omit<Appointment, "id">) => {
      await api.post("/appointments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const updateAppointment = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Appointment>;
    }) => {
      await api.patch(`/appointments/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    data: appointment,
    isLoading,
    error: error as Error | null,
    createAppointment: createAppointment.mutateAsync,
    updateAppointment: (id: string, data: Partial<Appointment>) =>
      updateAppointment.mutateAsync({ id, data }),
    deleteAppointment: deleteAppointment.mutateAsync,
  };
}
