import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseSettingsReturn } from "./types";
import { api } from "@/lib/api";

export function useSettings(): UseSettingsReturn {
  const queryClient = useQueryClient();

  const {
    data: settings = {},
    isLoading,
    error,
  } = useQuery<Record<string, unknown>>({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
  });

  const updateSettings = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await api.patch("/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const resetSettings = useMutation({
    mutationFn: async () => {
      await api.post("/settings/reset");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return {
    data: settings,
    isLoading,
    error: error as Error | null,
    updateSettings: updateSettings.mutateAsync,
    resetSettings: resetSettings.mutateAsync,
  };
}
