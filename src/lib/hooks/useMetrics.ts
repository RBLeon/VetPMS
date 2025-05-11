import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";

export interface Metrics {
  nextAppointment?: {
    id: string;
    patientName: string;
    type: string;
    date: string;
    time: string;
  };
  revenue?: number;
  revenueChange?: number;
  appointments?: Array<{
    id: string;
    patientName: string;
    type: string;
    date: string;
    time: string;
  }>;
  appointmentChange?: number;
  totalPatients?: number;
}

export const useMetrics = () => {
  return useQuery<Metrics>({
    queryKey: ["metrics"],
    queryFn: async () => {
      const response = await api.get<Metrics>("/metrics");
      return response;
    },
  });
};
