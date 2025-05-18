import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Appointment } from "@/lib/api/types";
import { useAuth } from "./AuthContext";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
} from "@/lib/constants/appointments";

interface AppointmentContextType {
  data: Appointment[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const AppointmentContext = createContext<AppointmentContextType>({
  data: undefined,
  isLoading: false,
  error: null,
});

export const useAppointments = () => useContext(AppointmentContext);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const appointments = await response.json();
      return appointments.map((appointment: any) => ({
        ...appointment,
        patientName: appointment.patient?.name || "Unknown Patient",
      }));
    },
    enabled: isAuthenticated,
  });

  return (
    <AppointmentContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
