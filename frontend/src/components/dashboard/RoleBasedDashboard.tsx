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
    return <div>Selecteer een rol</div>;
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
      return <div>Geen dashboard beschikbaar voor deze rol</div>;
  }
};
