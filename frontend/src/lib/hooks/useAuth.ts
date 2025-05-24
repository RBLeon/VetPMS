import { useAuth as useAuthContext } from "@/lib/context/AuthContext";

export const useAuth = () => {
  const auth = useAuthContext();
  return {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    logout: auth.logout,
  };
};
