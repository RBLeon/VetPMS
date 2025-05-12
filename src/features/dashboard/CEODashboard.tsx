import React, { useMemo } from "react";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useStaff } from "@/lib/hooks/useStaff";
import { useInventory } from "@/lib/hooks/useInventory";
import { useClientFeedback } from "@/lib/hooks/useApi";
import { Invoice } from "@/lib/api/types";
import type { InventoryItem } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  Star,
} from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
}) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="tracking-tight text-sm font-medium">{title}</h3>
      {icon}
    </div>
    <div className="p-6 pt-0">
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground">
          {trend.isPositive ? "+" : "-"}
          {Math.abs(trend.value)}% ten opzichte van vorige maand
        </p>
      )}
    </div>
  </div>
);

export const CEODashboard: React.FC = () => {
  const { data: appointments = [] } = useAppointments();
  const { data: invoices = [] } = useInvoices();
  const { data: staff = [] } = useStaff();
  const { data: inventory = [] } = useInventory();
  const { data: feedback = [] } = useClientFeedback();

  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )
    .toISOString()
    .split("T")[0];
  const monthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  )
    .toISOString()
    .split("T")[0];

  const metrics = useMemo(() => {
    const todayAppointments = appointments.filter((apt) => apt.date === today);

    const monthlyRevenue = invoices
      .filter((inv: Invoice) => {
        const invoiceDate = new Date(inv.createdAt);
        const today = new Date();
        return (
          invoiceDate.getMonth() === today.getMonth() &&
          invoiceDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    const completionRate =
      appointments.length > 0
        ? (appointments.filter((apt) => apt.status === "VOLTOOID").length /
            appointments.length) *
          100
        : 0;

    const staffUtilizationRate =
      staff.length > 0
        ? (staff.filter((s) => s.role !== "CEO").length / staff.length) * 100
        : 0;

    const lowStockItems = inventory.filter(
      (item) => item.quantity <= item.reorderLevel
    );

    const averageRating =
      feedback.length > 0
        ? feedback.reduce(
            (sum: number, f: { rating: number }) => sum + f.rating,
            0
          ) / feedback.length
        : 0;

    return {
      todayAppointments: todayAppointments.length,
      monthlyRevenue,
      completionRate,
      staffUtilization: staffUtilizationRate,
      lowStockItems: lowStockItems.length,
      averageRating,
    };
  }, [
    appointments,
    invoices,
    staff,
    inventory,
    feedback,
    today,
    monthStart,
    monthEnd,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Afspraken Vandaag"
          value={metrics.todayAppointments}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Maandelijkse Omzet"
          value={`€${metrics.monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Voltooiingspercentage"
          value={`${metrics.completionRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Personeelsbenutting"
          value={`${metrics.staffUtilization.toFixed(1)}%`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Lage Voorraad Items"
          value={metrics.lowStockItems}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Gemiddelde Beoordeling"
          value={metrics.averageRating.toFixed(1)}
          icon={<Star className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Personeels Overzicht</h3>
            <div className="mt-4 space-y-4">
              {staff.map((member) => (
                <div key={member.id} className="p-4 bg-white rounded-lg">
                  <div>
                    <p className="font-medium">{`${member.firstName} ${member.lastName}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role} - {member.specialization || "Algemeen"}
                    </p>
                  </div>
                  <Badge
                    variant={member.role !== "CEO" ? "default" : "secondary"}
                  >
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Voorraad Waarschuwingen</h3>
            <div className="mt-4 space-y-4">
              {(inventory as InventoryItem[])
                .filter((item) => item.quantity <= item.reorderLevel)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Aantal: {item.quantity} (Bestelpunt: {item.reorderLevel}
                        )
                      </p>
                    </div>
                    <Badge variant="destructive">Lage Voorraad</Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Dagelijkse Planning</h3>
          <div className="mt-4 space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-4 rounded-lg ${
                  appointment.status === "VOLTOOID"
                    ? "bg-green-50"
                    : appointment.status === "AANGEMELD"
                    ? "bg-yellow-50"
                    : "bg-white"
                }`}
              >
                <div>
                  <p className="font-medium">
                    {appointment.patientId || "Unknown Patient"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.time} - {appointment.type}
                  </p>
                </div>
                <Badge
                  variant={
                    appointment.status === "VOLTOOID"
                      ? "default"
                      : appointment.status === "AANGEMELD"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {appointment.status === "VOLTOOID"
                    ? "Voltooid"
                    : appointment.status === "AANGEMELD"
                    ? "Aangemeld"
                    : appointment.status === "IN_BEHANDELING"
                    ? "In behandeling"
                    : appointment.status === "INGEPLAND"
                    ? "Ingepland"
                    : appointment.status === "GEANNULEERD"
                    ? "Geannuleerd"
                    : "Niet verschenen"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
