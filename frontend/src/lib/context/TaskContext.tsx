import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface Task {
  id: string;
  scheduledTime: string;
  patientName: string;
  description: string;
  room: string;
  priority: "hoog" | "middel" | "laag";
  status: "in_afwachting" | "voltooid";
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
          priority: "hoog",
          status: "in_afwachting",
        },
        {
          id: "2",
          scheduledTime: "11:30 AM",
          patientName: "Bella",
          description: "Post-op check",
          room: "Room 1",
          priority: "middel",
          status: "in_afwachting",
        },
        {
          id: "3",
          scheduledTime: "12:00 PM",
          patientName: "Charlie",
          description: "Bandage change",
          room: "Room 4",
          priority: "middel",
          status: "in_afwachting",
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
