import React, { useMemo } from "react";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useStaff } from "@/lib/hooks/useStaff";
import { useInventory } from "@/lib/hooks/useInventory";
import { useClientFeedback } from "@/lib/hooks/useApi";
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
          {Math.abs(trend.value)}% from last month
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
      .filter(
        (inv) =>
          new Date(inv.createdAt) >= new Date(monthStart) &&
          new Date(inv.createdAt) <= new Date(monthEnd)
      )
      .reduce((sum, inv) => sum + inv.total, 0);

    const completionRate =
      (appointments.filter((apt) => apt.status === "COMPLETED").length /
        appointments.length) *
      100;

    const staffUtilization =
      (staff.members.filter((s) => s.role !== "CEO").length /
        staff.members.length) *
      100;

    const lowStockItems = inventory.filter(
      (item) => item.quantity <= item.reorderLevel
    );

    const averageRating =
      feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

    return {
      todayAppointments: todayAppointments.length,
      monthlyRevenue,
      completionRate,
      staffUtilization,
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
          title="Today's Appointments"
          value={metrics.todayAppointments}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Completion Rate"
          value={`${metrics.completionRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Staff Utilization"
          value={`${metrics.staffUtilization.toFixed(1)}%`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Low Stock Items"
          value={metrics.lowStockItems}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Average Rating"
          value={metrics.averageRating.toFixed(1)}
          icon={<Star className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <div className="mt-4 space-y-4">
              {appointments
                .filter((apt) => apt.date === today)
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {appointment.patient?.name || "Unknown Patient"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time} - {appointment.type}
                      </p>
                    </div>
                    <Badge
                      variant={
                        appointment.status === "COMPLETED"
                          ? "default"
                          : appointment.status === "CHECKED_IN"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Staff Overview</h3>
            <div className="mt-4 space-y-4">
              {staff.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{`${member.firstName} ${member.lastName}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role} - {member.specialization || "General"}
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
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Inventory Alerts</h3>
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
                      Quantity: {item.quantity} (Reorder Level:{" "}
                      {item.reorderLevel})
                    </p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
