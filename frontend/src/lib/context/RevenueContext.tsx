import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface Revenue {
  today: number;
  yesterday: number;
  monthly: number;
  lastMonth: number;
  operatingCosts: number;
  netProfit: number;
  breakdown: {
    exams: number;
    surgery: number;
    labs: number;
    other: number;
  };
}

interface RevenueContextType {
  data: Revenue | undefined;
  isLoading: boolean;
  error: Error | null;
}

const RevenueContext = createContext<RevenueContextType | undefined>(undefined);

export function RevenueProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery<Revenue>({
    queryKey: ["revenue"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        today: 3240,
        yesterday: 2890,
        monthly: 315000,
        lastMonth: 262500,
        operatingCosts: 185000,
        netProfit: 130000,
        breakdown: {
          exams: 45,
          surgery: 30,
          labs: 15,
          other: 10,
        },
      };
    },
  });

  return (
    <RevenueContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </RevenueContext.Provider>
  );
}

export function useRevenue() {
  const context = useContext(RevenueContext);
  if (context === undefined) {
    throw new Error("useRevenue must be used within a RevenueProvider");
  }
  return context;
}
