import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface Task {
  id: string;
  scheduledTime: string;
  patientName: string;
  description: string;
  room: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed";
}

interface TaskContextType {
  data: Task[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: "1",
          scheduledTime: "11:00 AM",
          patientName: "Max",
          description: "IV Medication",
          room: "Room 3",
          priority: "high",
          status: "pending",
        },
        {
          id: "2",
          scheduledTime: "11:30 AM",
          patientName: "Bella",
          description: "Post-op check",
          room: "Room 1",
          priority: "medium",
          status: "pending",
        },
        {
          id: "3",
          scheduledTime: "12:00 PM",
          patientName: "Charlie",
          description: "Bandage change",
          room: "Room 4",
          priority: "medium",
          status: "pending",
        },
      ];
    },
  });

  return (
    <TaskContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
