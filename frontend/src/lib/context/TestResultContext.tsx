import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TestResult } from "../api/types";

interface TestResultContextType {
  data: TestResult[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const TestResultContext = createContext<TestResultContextType | undefined>(
  undefined
);

export const TestResultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading, error } = useQuery<TestResult[]>({
    queryKey: ["testResults"],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: "1",
          patientId: "1",
          patientName: "Max",
          testType: "Bloedonderzoek",
          status: "VOLTOOID",
          orderedBy: "Dr. Smith",
          orderedDate: "2024-03-19",
          completedDate: "2024-03-20",
          results: "Normale waarden",
          notes: "Geen bijzonderheden",
          priority: "middel",
          createdAt: "2024-03-19T10:00:00Z",
          updatedAt: "2024-03-20T10:00:00Z",
        },
      ];
    },
  });

  return (
    <TestResultContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </TestResultContext.Provider>
  );
};

export const useTestResults = () => {
  const context = useContext(TestResultContext);
  if (context === undefined) {
    throw new Error("useTestResults must be used within a TestResultProvider");
  }
  return context;
};
