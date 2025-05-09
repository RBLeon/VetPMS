import { useQuery } from "@tanstack/react-query";
import { mockApi, type InventoryItem } from "../api/mockApi";

export const useInventory = () => {
  return useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockApi.inventory;
    },
  });
};
