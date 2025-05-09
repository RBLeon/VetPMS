import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: "SCHEDULED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED";
  patientId: string;
  patientName: string;
  patientType: string;
  clientId: string;
  staffId: string;
  isNewClient: boolean;
}

interface AppointmentContextType {
  data: Appointment[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export function AppointmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: "1",
          date: new Date().toISOString().split("T")[0],
          time: "10:00 AM",
          type: "Check-up",
          status: "SCHEDULED",
          patientId: "1",
          patientName: "Max",
          patientType: "German Shepherd",
          clientId: "1",
          staffId: "1",
          isNewClient: false,
        },
        // Add more mock data as needed
      ];
    },
  });

  return (
    <AppointmentContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  }
  return context;
}
