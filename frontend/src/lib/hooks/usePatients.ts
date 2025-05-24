import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@/lib/api/types";
import { api } from "@/lib/api";

export const usePatients = () => {
  return useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: () => api.get("/patients").then((res) => res.data),
  });
};
