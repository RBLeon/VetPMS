import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
}

interface ClientContextType {
  data: Client[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "123-456-7890",
          address: "123 Main St",
          registrationDate: new Date().toISOString(),
        },
        // Add more mock data as needed
      ];
    },
  });

  return (
    <ClientContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientProvider");
  }
  return context;
}
