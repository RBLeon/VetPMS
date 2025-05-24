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
  CheckCircle2,
  Clock,
  Activity,
  Package,
  Stethoscope,
  Bandage,
  UserPlus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export const ManagerDashboard: React.FC = () => {
  const { data: appointments = [] } = useAppointments();
  const { data: invoices = [] } = useInvoices();
  const { data: staff = [] } = useStaff();
  const { data: inventory = [] } = useInventory();
  const { data: feedback = [] } = useClientFeedback();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const handleNewAppointment = () => {
    navigate("/appointments/new");
  };

  const handleNewTreatment = () => {
    navigate("/treatments/new");
  };

  const handleNewPatient = () => {
    navigate("/patients/new");
  };

  const handleInventory = () => {
    navigate("/inventory");
  };

  const handleViewAppointment = (appointmentId: string) => {
    navigate(`/appointments/${appointmentId}`);
  };

  const handleViewTreatment = (treatmentId: string) => {
    navigate(`/treatments/${treatmentId}`);
  };

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
        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totaal Afspraken
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {appointments.length}
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">
              Deze Week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/20 dark:from-[#10B981]/20 dark:to-[#10B981]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Voltooide Behandelingen
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981] dark:text-[#10B981]">
              {metrics.todayAppointments}
            </div>
            <p className="text-xs text-[#10B981] dark:text-[#10B981]">
              Deze maand
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/20 dark:from-[#8B5CF6]/20 dark:to-[#8B5CF6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gemiddelde Wachttijd
            </CardTitle>
            <Clock className="h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5CF6] dark:text-[#8B5CF6]">
              {metrics.averageRating.toFixed(1)} min
            </div>
            <p className="text-xs text-[#8B5CF6] dark:text-[#8B5CF6]">
              Vandaag
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Voorraad Alert
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {metrics.lowStockItems}
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">
              Items bijna op
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Omzet Vandaag</CardTitle>
            <DollarSign className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              €{metrics.todayRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">
              Vandaag
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/20 dark:from-[#10B981]/20 dark:to-[#10B981]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Openstaande Facturen
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981] dark:text-[#10B981]">
              {metrics.pendingInvoices}
            </div>
            <p className="text-xs text-[#10B981] dark:text-[#10B981]">
              Openstaande facturen
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/20 dark:from-[#8B5CF6]/20 dark:to-[#8B5CF6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Betalingspercentage
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5CF6] dark:text-[#8B5CF6]">
              {metrics.paymentRate.toFixed(1)}%
            </div>
            <p className="text-xs text-[#8B5CF6] dark:text-[#8B5CF6]">
              Vandaag
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Personeelsbenutting
            </CardTitle>
            <Users className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {metrics.staffUtilization.toFixed(1)}%
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">
              Vandaag
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gemiddelde Beoordeling
            </CardTitle>
            <Star className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {metrics.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">
              Vandaag
            </p>
          </CardContent>
        </Card>
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
                    <Badge
                      variant="destructive"
                      className="bg-red-300 hover:bg-red-400 text-white dark:bg-red-900/50 dark:hover:bg-red-900/70"
                    >
                      Bestellen
                    </Badge>
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
                  className="flex items-center justify-between p-4 border rounded-lg bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10"
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

      <Tabs defaultValue="appointments">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="appointments"
            className="data-[state=active]:bg-[#3B82F6]/10 dark:data-[state=active]:bg-[#3B82F6]/20"
          >
            <Calendar className="h-4 w-4 mr-2 text-[#3B82F6] dark:text-[#3B82F6]" />
            Afspraken
          </TabsTrigger>
          <TabsTrigger
            value="treatments"
            className="data-[state=active]:bg-[#10B981]/10 dark:data-[state=active]:bg-[#10B981]/20"
          >
            <Stethoscope className="h-4 w-4 mr-2 text-[#10B981] dark:text-[#10B981]" />
            Behandelingen
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-[#3B82F6]/10 dark:data-[state=active]:bg-[#3B82F6]/20"
          >
            <Activity className="h-4 w-4 mr-2 text-[#3B82F6] dark:text-[#3B82F6]" />
            Voorraad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Afspraken Deze Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10"
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.date), "HH:mm")} -{" "}
                        {appointment.type}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAppointment(appointment.id)}
                      className="bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30 text-[#3B82F6] dark:text-[#3B82F6]"
                    >
                      Bekijk Afspraak
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Behandelingen Deze Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#10B981]/5 dark:bg-[#10B981]/10"
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.date), "HH:mm")} -{" "}
                        {appointment.type}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTreatment(appointment.id)}
                      className="bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]"
                    >
                      Bekijk Behandeling
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Voorraad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Aantal: {item.quantity} (Bestelpunt: {item.reorderLevel}
                        )
                      </p>
                    </div>
                    {item.quantity <= item.reorderLevel && (
                      <Badge
                        variant="destructive"
                        className="bg-red-300 hover:bg-red-400 text-white dark:bg-red-900/50 dark:hover:bg-red-900/70"
                      >
                        Lage Voorraad
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistieken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Voltooide Behandelingen
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.todayAppointments}
                  </span>
                </div>
                <Progress
                  value={metrics.todayAppointments * 10}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#10B981] dark:[&>div]:bg-[#10B981]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Gemiddelde Wachttijd
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.averageRating.toFixed(1)} min
                  </span>
                </div>
                <Progress
                  value={parseInt(metrics.averageRating.toFixed(1)) * 2}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#8B5CF6] dark:[&>div]:bg-[#8B5CF6]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Voorraad Alert
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.lowStockItems}
                  </span>
                </div>
                <Progress
                  value={metrics.lowStockItems * 10}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#3B82F6] dark:[&>div]:bg-[#3B82F6]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snelle Acties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="w-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30"
                variant="outline"
                onClick={handleNewAppointment}
              >
                <Calendar className="mr-2 h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
                Nieuwe Afspraak
              </Button>
              <Button
                className="w-full bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30"
                variant="outline"
                onClick={handleNewTreatment}
              >
                <Bandage className="mr-2 h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
                Nieuwe Behandeling
              </Button>
              <Button
                className="w-full bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:hover:bg-[#8B5CF6]/30"
                variant="outline"
                onClick={handleNewPatient}
              >
                <UserPlus className="mr-2 h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
                Nieuwe Patiënt
              </Button>
              <Button
                className="w-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30"
                variant="outline"
                onClick={handleInventory}
              >
                <Package className="mr-2 h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
                Voorraad
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
