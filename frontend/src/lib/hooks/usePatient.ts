import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import { Patient } from "@/lib/api/types";

export const usePatient = (id: string) => {
  return useQuery<Patient>({
    queryKey: ["patient", id],
    queryFn: async () => {
      const response = await api.get<Patient>(`/patients/${id}`);
      return response;
    },
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation<Patient, Error, Omit<Patient, "id">>({
    mutationFn: async (data) => {
      const response = await api.post<Patient>("/patients", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

export const useUpdatePatient = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Patient, Error, Partial<Patient>>({
    mutationFn: async (data) => {
      const response = await api.put<Patient>(`/patients/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<string>(`/patients/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};
