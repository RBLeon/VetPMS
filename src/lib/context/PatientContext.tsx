import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface Patient {
  id: string;
  name: string;
  type: string;
  status: "ACTIVE" | "UNDER_CARE" | "CRITICAL";
  lastVisitDate: string;
  lastVisitReason: string;
  registrationDate: string;
  needsVitalsCheck: boolean;
  condition?: string;
}

interface PatientContextType {
  data: Patient[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: "1",
          name: "Max",
          type: "German Shepherd",
          status: "ACTIVE",
          lastVisitDate: new Date().toISOString(),
          lastVisitReason: "Routine checkup",
          registrationDate: new Date().toISOString(),
          needsVitalsCheck: false,
        },
        {
          id: "2",
          name: "Bella",
          type: "Labrador",
          status: "UNDER_CARE",
          lastVisitDate: new Date().toISOString(),
          lastVisitReason: "Post-surgery monitoring",
          registrationDate: new Date().toISOString(),
          needsVitalsCheck: true,
        },
        {
          id: "3",
          name: "Charlie",
          type: "Maine Coon",
          status: "CRITICAL",
          lastVisitDate: new Date().toISOString(),
          lastVisitReason: "Respiratory issue",
          registrationDate: new Date().toISOString(),
          needsVitalsCheck: true,
          condition: "Severe respiratory infection",
        },
      ];
    },
  });

  return (
    <PatientContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
}
