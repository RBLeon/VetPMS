// src/components/dashboard/DashboardView.tsx
import { RoleBasedDashboard } from "./RoleBasedDashboard";

interface DashboardViewProps {
  role: string | null;
}

export const DashboardView = ({ role }: DashboardViewProps) => {
  return <RoleBasedDashboard role={role} />;
};
