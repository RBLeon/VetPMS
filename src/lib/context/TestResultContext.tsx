import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface TestResult {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  orderedBy: string;
  orderedDate: string;
  completedDate?: string;
  results?: string;
  notes?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

interface TestResultContextType {
  data: TestResult[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const TestResultContext = createContext<TestResultContextType | undefined>(
  undefined
);

export function TestResultProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = useQuery<TestResult[]>({
    queryKey: ["testResults"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: "1",
          patientId: "1",
          patientName: "Max",
          testType: "Blood Work",
          status: "COMPLETED",
          orderedBy: "Dr. Johnson",
          orderedDate: new Date().toISOString(),
          completedDate: new Date().toISOString(),
          results: "All values within normal range",
          notes: "No concerns",
          priority: "MEDIUM",
        },
        {
          id: "2",
          patientId: "2",
          patientName: "Bella",
          testType: "X-Ray",
          status: "IN_PROGRESS",
          orderedBy: "Dr. Smith",
          orderedDate: new Date().toISOString(),
          priority: "HIGH",
        },
        {
          id: "3",
          patientId: "3",
          patientName: "Charlie",
          testType: "Urinalysis",
          status: "PENDING",
          orderedBy: "Dr. Williams",
          orderedDate: new Date().toISOString(),
          priority: "LOW",
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
}

export function useTestResults() {
  const context = useContext(TestResultContext);
  if (context === undefined) {
    throw new Error("useTestResults must be used within a TestResultProvider");
  }
  return context;
}
