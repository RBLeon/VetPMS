import { RoleBasedDashboard } from "@/features/dashboard/components/RoleBasedDashboard";
import { useRole } from "@/lib/context/RoleContext";

export const DashboardView = () => {
  const { role } = useRole();
  return <RoleBasedDashboard role={role} />;
};
