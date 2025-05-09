import { useQuery } from "@tanstack/react-query";
import { mockApi, type Invoice } from "../api/mockApi";

export const useInvoices = () => {
  return useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockApi.invoices;
    },
  });
};
