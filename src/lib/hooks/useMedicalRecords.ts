import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi, type MedicalRecord } from "../api/mockApi";

export const useMedicalRecords = (patientId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<MedicalRecord[]>({
    queryKey: ["medicalRecords", patientId],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return patientId
        ? mockApi.medicalRecords.filter(
            (record) => record.patientId === patientId
          )
        : mockApi.medicalRecords;
    },
  });

  const addMedicalRecord = useMutation({
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
      queryClient.invalidateQueries({
        queryKey: ["medicalRecords", patientId],
      });
    },
  });

  const updateMedicalRecord = useMutation({
    mutationFn: async (data: MedicalRecord) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const index = mockApi.medicalRecords.findIndex((r) => r.id === data.id);
      if (index === -1) {
        throw new Error("Medical record not found");
      }
      mockApi.medicalRecords[index] = data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicalRecords", patientId],
      });
    },
  });

  const deleteMedicalRecord = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const index = mockApi.medicalRecords.findIndex((r) => r.id === id);
      if (index === -1) {
        throw new Error("Medical record not found");
      }
      mockApi.medicalRecords.splice(index, 1);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicalRecords", patientId],
      });
    },
  });

  return {
    ...query,
    addMedicalRecord: addMedicalRecord.mutateAsync,
    updateMedicalRecord: updateMedicalRecord.mutateAsync,
    deleteMedicalRecord: deleteMedicalRecord.mutateAsync,
  };
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
