import { CEODashboard } from "@/features/dashboard/CEODashboard";
import { ManagerDashboard } from "@/features/dashboard/ManagerDashboard";
import { NurseDashboard } from "@/features/dashboard/NurseDashboard";
import { ReceptionistDashboard } from "@/features/dashboard/ReceptionistDashboard";
import { VeterinarianDashboard } from "@/features/dashboard/VeterinarianDashboard";

interface RoleBasedDashboardProps {
  role: string | null;
}

export const RoleBasedDashboard = ({ role }: RoleBasedDashboardProps) => {
  if (!role) {
    return <div>Please select a role</div>;
  }

  switch (role) {
    case "CEO":
      return <CEODashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    case "NURSE":
      return <NurseDashboard />;
    case "RECEPTIONIST":
      return <ReceptionistDashboard />;
    case "VETERINARIAN":
      return <VeterinarianDashboard />;
    default:
      return <div>No dashboard available for this role</div>;
  }
};
