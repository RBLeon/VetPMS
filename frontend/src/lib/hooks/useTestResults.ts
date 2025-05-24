import { useQuery } from "@tanstack/react-query";
import type { TestResult } from "@/lib/api/types";
import { api } from "@/lib/api";

export const useTestResults = () => {
  return useQuery<TestResult[]>({
    queryKey: ["testResults"],
    queryFn: () => api.get("/test-results").then((res) => res.data),
  });
};
