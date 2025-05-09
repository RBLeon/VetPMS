import { useQuery } from "@tanstack/react-query";
import { mockApi, type Appointment } from "../api/mockApi";

export const useAppointments = () => {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockApi.appointments;
    },
  });
};
