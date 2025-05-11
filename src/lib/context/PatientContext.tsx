import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "../api/types";

interface PatientContextType {
  data: Patient[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading, error } = useQuery<Patient[], Error>({
    queryKey: ["patients"],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: "1",
          name: "Max",
          species: "HOND",
          breed: "Duitse Herder",
          age: 3,
          weight: 30,
          dateOfBirth: "2021-03-20",
          lastVisit: "2024-03-15",
          clientId: "1",
          gender: "mannelijk",
          status: "ACTIVE",
          needsVitalsCheck: false,
          registrationDate: "2021-03-20",
          createdAt: "2024-03-19T10:00:00Z",
          updatedAt: "2024-03-19T10:00:00Z",
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
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
};
