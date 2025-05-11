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

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium">Volgende Afspraak</h3>
          <p className="mt-2 text-2xl font-bold">
            {metrics?.nextAppointment?.patientName || "Geen"} (
            {metrics?.nextAppointment?.type || "Geen"})
          </p>
          <p className="text-sm text-muted-foreground">
            {metrics?.nextAppointment
              ? format(
                  new Date(
                    `${metrics.nextAppointment.date}T${metrics.nextAppointment.time}`
                  ),
                  "d MMMM yyyy 'om' HH:mm",
                  { locale: nl }
                )
              : "Geen afspraken gepland"}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium">Omzet</h3>
          <p className="mt-2 text-2xl font-bold">
            €{metrics?.revenue?.toFixed(2) || "0.00"}{" "}
            {metrics?.revenueChange ? (
              <span
                className={`text-sm ${
                  metrics.revenueChange > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {metrics.revenueChange > 0 ? "+" : ""}
                {metrics.revenueChange}%
              </span>
            ) : null}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium">Afspraken</h3>
          <p className="mt-2 text-2xl font-bold">
            {metrics?.appointments?.length || 0}{" "}
            {metrics?.appointmentChange ? (
              <span
                className={`text-sm ${
                  metrics.appointmentChange > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {metrics.appointmentChange > 0 ? "+" : ""}
                {metrics.appointmentChange}%
              </span>
            ) : null}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium">Patiënten</h3>
          <p className="mt-2 text-2xl font-bold">
            {metrics?.totalPatients || 0}
          </p>
        </div>
      </div>

      <div className="mt-8">{renderDashboard()}</div>
    </div>
  );
};

function DefaultDashboard() {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-2xl font-bold">
        Welkom bij het Veterinair Praktijk Management Systeem
      </h2>
      <p className="mt-2 text-muted-foreground">
        Selecteer een optie uit het menu om te beginnen.
      </p>
    </div>
  );
}
