import React, { useMemo } from "react";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useStaff } from "@/lib/hooks/useStaff";
import { useInventory } from "@/lib/hooks/useInventory";
import { useClientFeedback } from "@/lib/hooks/useApi";
import type {
  Appointment,
  Invoice,
  StaffMember,
  InventoryItem,
  ClientFeedback,
} from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
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

export const ManagerDashboard: React.FC = () => {
  const { data: appointments = [] } = useAppointments();
  const { data: invoices = [] } = useInvoices();
  const { data: staff = [] } = useStaff();
  const { data: inventory = [] } = useInventory();
  const { data: feedback = [] } = useClientFeedback();

  const today = new Date().toISOString().split("T")[0];

  const metrics = useMemo(() => {
    const todayAppointments = (appointments as Appointment[]).filter(
      (apt) => apt.date === today
    );

    const todayRevenue = (invoices as Invoice[])
      .filter((inv) => inv.createdAt.startsWith(today))
      .reduce((sum, inv) => sum + inv.total, 0);

    const pendingInvoices = (invoices as Invoice[]).filter(
      (inv) => inv.status === "PENDING"
    );

    const paymentRate =
      ((invoices as Invoice[]).filter((inv) => inv.status === "PAID").length /
        (invoices as Invoice[]).length) *
      100;

    const staffUtilization =
      ((staff as StaffMember[]).filter((s) => s.hoursWorked > 0).length /
        (staff as StaffMember[]).length) *
      100;

    const lowStockItems = (inventory as InventoryItem[]).filter(
      (item) => item.quantity <= item.reorderLevel
    );

    const averageRating =
      (feedback as ClientFeedback[]).reduce((sum, f) => sum + f.rating, 0) /
      (feedback as ClientFeedback[]).length;

    return {
      todayAppointments: todayAppointments.length,
      todayRevenue,
      pendingInvoices: pendingInvoices.length,
      paymentRate,
      staffUtilization,
      lowStockItems: lowStockItems.length,
      averageRating,
    };
  }, [appointments, invoices, staff, inventory, feedback, today]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Afspraken Vandaag"
          value={metrics.todayAppointments}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Omzet Vandaag"
          value={`€${metrics.todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Openstaande Facturen"
          value={metrics.pendingInvoices}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Betalingspercentage"
          value={`${metrics.paymentRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Personeelsbenutting"
          value={`${metrics.staffUtilization.toFixed(1)}%`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
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
              {(staff as StaffMember[]).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.role} - {member.specialization}
                    </p>
                  </div>
                  <Badge
                    variant={member.hoursWorked > 0 ? "default" : "secondary"}
                  >
                    {member.hoursWorked > 0 ? "Actief" : "Inactief"}
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
                        {item.quantity} {item.unit} resterend
                      </p>
                    </div>
                    <Badge variant="destructive">Bestellen</Badge>
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
            {(appointments as Appointment[])
              .filter((apt) => apt.date === today)
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between"
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
                        : "default"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
