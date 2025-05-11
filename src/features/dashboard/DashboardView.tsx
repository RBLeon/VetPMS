import { useAuth } from "@/lib/context/AuthContext";
import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";

export const DashboardView = () => {
  const { user } = useAuth();
  return <RoleBasedDashboard role={user?.role || "default"} />;
};
