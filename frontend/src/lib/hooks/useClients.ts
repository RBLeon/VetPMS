import { useQuery } from "@tanstack/react-query";
import { mockApi, type Client } from "../api/mockApi";

export const useClients = () => {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockApi.clients;
    },
  });
};
