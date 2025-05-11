import { Loader2 } from "lucide-react";
import { useMetrics } from "@/lib/hooks/useMetrics";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { VeterinarianDashboard } from "@/features/dashboard/VeterinarianDashboard";
import { ReceptionistDashboard } from "@/features/dashboard/ReceptionistDashboard";
import { NurseDashboard } from "@/features/dashboard/NurseDashboard";
import { ManagerDashboard } from "@/features/dashboard/ManagerDashboard";
import { CEODashboard } from "@/features/dashboard/CEODashboard";

interface RoleBasedDashboardProps {
  role: string;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({
  role,
}) => {
  const { data: metrics, isLoading } = useMetrics();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (role) {
      case "VETERINARIAN":
        return <VeterinarianDashboard />;
      case "RECEPTIONIST":
        return <ReceptionistDashboard />;
      case "NURSE":
        return <NurseDashboard />;
      case "MANAGER":
        return <ManagerDashboard />;
      case "CEO":
        return <CEODashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return <div className="space-y-6 p-6">{renderDashboard()}</div>;
};

function DefaultDashboard() {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-2xl font-bold">
        Welkom bij het Veterinair Praktijk Management Systeem
      </h2>
      <p className="mt-2 text-muted-foreground">
        Selecteer een rol om toegang te krijgen tot de bijbehorende
        functionaliteit.
      </p>
    </div>
  );
}
