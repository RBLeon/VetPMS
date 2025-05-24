import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Bill } from "@/lib/api/types";
import type { UseBillsReturn } from "./types";
import { api } from "@/lib/api";

export function useBills(): UseBillsReturn {
  const queryClient = useQueryClient();

  const {
    data: bills = [],
    isLoading,
    error,
  } = useQuery<Bill[]>({
    queryKey: ["bills"],
    queryFn: () => api.get("/bills"),
  });

  const createBill = useMutation({
    mutationFn: async (data: Omit<Bill, "id">) => {
      await api.post("/bills", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });

  const updateBill = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Bill> }) => {
      await api.patch(`/bills/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });

  const deleteBill = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/bills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });

  return {
    data: bills,
    isLoading,
    error: error as Error | null,
    createBill: createBill.mutateAsync,
    updateBill: (id: string, data: Partial<Bill>) =>
      updateBill.mutateAsync({ id, data }),
    deleteBill: deleteBill.mutateAsync,
  };
}
