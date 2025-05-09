import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "@/lib/hooks/useApi";
import { useClients } from "@/lib/hooks/useClients";
import { usePatients } from "@/lib/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  children,
  className,
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const ReceptionistDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const {
    data: clients = [],
    isLoading: clientsLoading,
    error: clientsError,
  } = useClients();
  const {
    data: patients = [],
    isLoading: patientsLoading,
    error: patientsError,
  } = usePatients();

  const isLoading = appointmentsLoading || clientsLoading || patientsLoading;

  const today = format(new Date(), "yyyy-MM-dd");

  const getTodayAppointments = () => {
    return appointments.filter((apt) => apt.date.startsWith(today));
  };

  const getWaitingRoomStatus = () => {
    if (!appointments) return [];
    return appointments.filter((apt) => apt.status === "CHECKED_IN");
  };

  const getUpcomingAppointments = () => {
    if (!appointments) return [];
    return appointments.filter((apt) => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      return appointmentDate > today && apt.status === "SCHEDULED";
    });
  };

  const todayAppointments = getTodayAppointments();
  const waitingRoom = getWaitingRoomStatus();
  const upcomingAppointments = getUpcomingAppointments();

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!appointments) return null;

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(
      (apt) => apt.status === "COMPLETED"
    ).length;
    const waitingAppointments = appointments.filter(
      (apt) => apt.status === "CHECKED_IN"
    ).length;

    return {
      totalAppointments,
      completedAppointments,
      waitingAppointments,
      completionRate: (completedAppointments / totalAppointments) * 100,
    };
  }, [appointments]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[100px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (appointmentsError || clientsError || patientsError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <DashboardCard
          title="Today's Schedule"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          className="lg:col-span-2"
        >
          <ScrollArea className="h-[300px]">
            {todayAppointments.map((appointment) => {
              const patient = patients?.find(
                (p) => p.id === appointment.patientId
              );
              const client = clients?.find(
                (c) => c.id === appointment.clientId
              );

              return (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{patient?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.time} - {appointment.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {client?.firstName} {client?.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        appointment.status === "CHECKED_IN"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {appointment.status}
                    </Badge>
                    {appointment.status === "SCHEDULED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/appointments/${appointment.id}/check-in`)
                        }
                      >
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </DashboardCard>

        {/* Waiting Room */}
        <DashboardCard
          title="Waiting Room"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          <ScrollArea className="h-[300px]">
            {waitingRoom.map((appointment) => {
              const patient = patients?.find(
                (p) => p.id === appointment.patientId
              );
              const client = clients?.find(
                (c) => c.id === appointment.clientId
              );

              return (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
                  data-testid="waiting-item"
                >
                  <div>
                    <p className="font-medium">{patient?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {client?.firstName} {client?.lastName}
                    </p>
                  </div>
                  <Badge variant="default">Checked In</Badge>
                </div>
              );
            })}
          </ScrollArea>
        </DashboardCard>

        {/* Upcoming Appointments */}
        <DashboardCard
          title="Upcoming Appointments"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          className="lg:col-span-2"
        >
          <ScrollArea className="h-[300px]">
            {upcomingAppointments.map((appointment) => {
              const patient = patients?.find(
                (p) => p.id === appointment.patientId
              );
              const client = clients?.find(
                (c) => c.id === appointment.clientId
              );

              return (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{patient?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointment.date).toLocaleDateString()}{" "}
                      {appointment.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {client?.firstName} {client?.lastName}
                    </p>
                  </div>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
              );
            })}
          </ScrollArea>
        </DashboardCard>

        {/* Client Communications */}
        <DashboardCard
          title="Client Communications"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                <p>Pending Callbacks</p>
                <Badge variant="default">3</Badge>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                <p>Appointment Confirmations</p>
                <Badge variant="default">5</Badge>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                <p>Follow-up Calls</p>
                <Badge variant="default">2</Badge>
              </div>
            </div>
          </ScrollArea>
        </DashboardCard>

        {/* Quick Stats */}
        <DashboardCard
          title="Quick Stats"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          className="lg:col-span-3"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics?.totalAppointments}</p>
              <p className="text-sm text-muted-foreground">
                Total Appointments
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {metrics?.waitingAppointments}
              </p>
              <p className="text-sm text-muted-foreground">
                Waiting Appointments
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{metrics?.completionRate}%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
