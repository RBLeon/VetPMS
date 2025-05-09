import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface Medication {
  id: string;
  scheduledTime: string;
  room: string;
  patientName: string;
  medication: string;
  dosage: string;
  status: "scheduled" | "administered" | "missed";
}

interface MedicationContextType {
  data: Medication[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const MedicationContext = createContext<MedicationContextType | undefined>(
  undefined
);

export function MedicationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = useQuery<Medication[]>({
    queryKey: ["medications"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: "1",
          scheduledTime: "11:00 AM",
          room: "Room 3",
          patientName: "Max",
          medication: "Antibiotics",
          dosage: "500mg",
          status: "scheduled",
        },
        {
          id: "2",
          scheduledTime: "11:30 AM",
          room: "Room 1",
          patientName: "Bella",
          medication: "Pain Relief",
          dosage: "200mg",
          status: "scheduled",
        },
        {
          id: "3",
          scheduledTime: "12:00 PM",
          room: "Room 4",
          patientName: "Charlie",
          medication: "Anti-inflammatory",
          dosage: "100mg",
          status: "scheduled",
        },
      ];
    },
  });

  return (
    <MedicationContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedications() {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error("useMedications must be used within a MedicationProvider");
  }
  return context;
}
