import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi, type ClientFeedback } from "../api/mockApi";

// Client hooks
export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: mockApi.getClients,
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => mockApi.getClient(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mockApi.updateClient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// Patient hooks
export const usePatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const data = await mockApi.getPatients();
      return data || []; // Ensure we always return an array
    },
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => mockApi.getPatient(id),
    enabled: !!id,
  });
};

export const useClientPatients = (clientId: string) => {
  return useQuery({
    queryKey: ["patients", "client", clientId],
    queryFn: () => mockApi.getClientPatients(clientId),
    enabled: !!clientId,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mockApi.updatePatient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", id] });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

// Appointment hooks
export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: mockApi.getAppointments,
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => mockApi.getAppointment(id),
    enabled: !!id,
  });
};

export const usePatientAppointments = (patientId: string) => {
  return useQuery({
    queryKey: ["appointments", "patient", patientId],
    queryFn: () => mockApi.getPatientAppointments(patientId),
    enabled: !!patientId,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mockApi.updateAppointment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", id] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// Medical Record hooks
export const useMedicalRecords = () => {
  return useQuery({
    queryKey: ["medicalRecords"],
    queryFn: mockApi.getMedicalRecords,
  });
};

export const useMedicalRecord = (id: string) => {
  return useQuery({
    queryKey: ["medicalRecords", id],
    queryFn: () => mockApi.getMedicalRecord(id),
    enabled: !!id,
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createMedicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mockApi.updateMedicalRecord(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
      queryClient.invalidateQueries({ queryKey: ["medicalRecords", id] });
    },
  });
};

export const useDeleteMedicalRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.deleteMedicalRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicalRecords"] });
    },
  });
};

// Invoice hooks
export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: mockApi.getInvoices,
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: () => mockApi.getInvoice(),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mockApi.updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices", id] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Staff hooks
export const useStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: mockApi.getStaff,
  });
};

export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => mockApi.getStaffMember(id),
    enabled: !!id,
  });
};

export const useCreateStaffMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useUpdateStaffMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mockApi.updateStaffMember(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff", id] });
    },
  });
};

export const useDeleteStaffMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.deleteStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

// Inventory hooks
export const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: mockApi.getInventory,
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: () => mockApi.getInventoryItem(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mockApi.updateInventoryItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", id] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

export const useClientFeedback = () => {
  return useQuery<ClientFeedback[]>({
    queryKey: ["clientFeedback"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockApi.clientFeedback || [];
    },
  });
};

export const useClientFeedbackById = (id: string) => {
  return useQuery({
    queryKey: ["clientFeedback", id],
    queryFn: () => mockApi.getClientFeedbackById(id),
  });
};

export const useCreateClientFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedback: Omit<ClientFeedback, "id">) => {
      // Simulate API call
      return Promise.resolve({
        ...feedback,
        id: Math.random().toString(36).substr(2, 9),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientFeedback"] });
    },
  });
};

export const useUpdateClientFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      feedback,
    }: {
      id: string;
      feedback: Partial<ClientFeedback>;
    }) => {
      // Simulate API call
      return Promise.resolve({
        id,
        ...feedback,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientFeedback"] });
    },
  });
};

export const useDeleteClientFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockApi.deleteClientFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientFeedback"] });
    },
  });
};

// Treatment hooks
export const useTreatments = () => {
  return useQuery({
    queryKey: ["treatments"],
    queryFn: async () => {
      const data = await mockApi.getTreatments();
      return data || []; // Ensure we always return an array
    },
  });
};

export const useTreatment = (id: string) => {
  return useQuery({
    queryKey: ["treatments", id],
    queryFn: () => mockApi.getTreatment(id),
    enabled: !!id,
  });
};
