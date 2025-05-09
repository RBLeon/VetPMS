import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi, type MedicalRecord } from "../api/mockApi";

export const useMedicalRecords = () => {
  return useQuery<MedicalRecord[]>({
    queryKey: ["medicalRecords"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockApi.medicalRecords;
    },
  });
};

export const useMedicalRecord = (id: string) => {
  return useQuery<MedicalRecord>({
    queryKey: ["medicalRecords", id],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const record = mockApi.medicalRecords.find((r) => r.id === id);
      if (!record) {
        throw new Error("Medical record not found");
      }
      return record;
    },
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<MedicalRecord, "id">) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newRecord = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      mockApi.medicalRecords.push(newRecord);
      return newRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<MedicalRecord>;
    }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const index = mockApi.medicalRecords.findIndex((r) => r.id === id);
      if (index === -1) {
        throw new Error("Medical record not found");
      }
      const updatedRecord = {
        ...mockApi.medicalRecords[index],
        ...data,
      };
      mockApi.medicalRecords[index] = updatedRecord;
      return updatedRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
    },
  });
};
