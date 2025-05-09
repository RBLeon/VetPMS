import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  isOnDuty: boolean;
  workingHours: number;
  notices: {
    id: string;
    title: string;
    message: string;
  }[];
}

interface StaffMetrics {
  satisfaction: number;
  retention: number;
  fillRate: number;
}

interface Staff {
  members: StaffMember[];
  metrics: StaffMetrics;
}

interface StaffContextType {
  data: Staff | undefined;
  isLoading: boolean;
  error: Error | null;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery<Staff>({
    queryKey: ["staff"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        members: [
          {
            id: "1",
            name: "Dr. Johnson",
            role: "Veterinarian",
            isOnDuty: true,
            workingHours: 8,
            notices: [
              {
                id: "1",
                title: "Staff Meeting",
                message: "Tomorrow at 8:30 AM in the conference room",
              },
              {
                id: "2",
                title: "Inventory Order",
                message: "Surgical supplies arriving Thursday",
              },
            ],
          },
          {
            id: "2",
            name: "Dr. Smith",
            role: "Veterinarian",
            isOnDuty: true,
            workingHours: 8,
            notices: [],
          },
          {
            id: "3",
            name: "Dr. Williams",
            role: "Veterinarian",
            isOnDuty: true,
            workingHours: 8,
            notices: [],
          },
        ],
        metrics: {
          satisfaction: 4.8,
          retention: 95,
          fillRate: 92,
        },
      };
    },
  });

  return (
    <StaffContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
}
