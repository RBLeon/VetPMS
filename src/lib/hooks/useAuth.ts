import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/lib/api/types";

export const useAuth = () => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => api.get("/auth/me").then((res) => res.data),
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};
