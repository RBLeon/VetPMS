import { useAppointments, usePatients } from "@/lib/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Appointment, Client, Patient } from "@/lib/api/types";

interface ReceptionistDashboardProps {
  appointments?: Appointment[];
  clients?: Client[];
  patients?: Patient[];
  isLoading?: boolean;
  error?: Error;
  onCheckIn?: (appointmentId: string) => Promise<void>;
  onConfirm?: (appointmentId: string) => Promise<void>;
  stats?: {
    dailyCheckIns: number;
    noShowRate: string;
    averageWaitTime: string;
  };
}

export const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = ({
  appointments: propAppointments,
  clients: propClients,
  patients: propPatients,
  isLoading: propIsLoading,
  error: propError,
  onCheckIn: propOnCheckIn,
  onConfirm: propOnConfirm,
  stats,
}) => {
  const { data: hookAppointments = [], isLoading: isLoadingAppointments } =
    useAppointments();
  const { data: hookPatients = [], isLoading: isLoadingPatients } =
    usePatients();

  const appointments = propAppointments ?? hookAppointments;
  const patients = propPatients ?? hookPatients;
  const isLoading =
    propIsLoading !== undefined
      ? propIsLoading
      : (!propAppointments && isLoadingAppointments) ||
        (!propPatients && isLoadingPatients);
  const error = propError;

  console.log("ReceptionistDashboard props:", {
    appointments: propAppointments,
    clients: propClients,
    patients: propPatients,
  });

  const today = new Date();

  const waitingRoom = appointments.filter(
    (appointment) => appointment.status === "AANGEMELD"
  );

  const upcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate > today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const metrics = {
    dailyCheckIns:
      typeof stats?.dailyCheckIns === "number"
        ? stats.dailyCheckIns
        : waitingRoom.length,
    noShowRate: stats?.noShowRate ? `${stats.noShowRate}%` : "5%",
    averageWaitTime: stats?.averageWaitTime
      ? `${stats.averageWaitTime} min`
      : "15 min",
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="bg-primary/10 animate-pulse rounded-md h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="bg-primary/10 animate-pulse rounded-md h-[100px] w-full" />
              </CardContent>
            </Card>
          ))}
          <div className="text-center w-full">Laden...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>Fout bij het laden van dashboard</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Vandaag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments
                .filter((a) => {
                  const d = new Date(a.date);
                  return (
                    d.getDate() === today.getDate() &&
                    d.getMonth() === today.getMonth() &&
                    d.getFullYear() === today.getFullYear()
                  );
                })
                .map((appointment) => {
                  const patient = patients.find(
                    (p) => p.id === appointment.patientId
                  );
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {patient?.name || appointment.patientName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.time ||
                            (appointment.date &&
                              format(new Date(appointment.date), "HH:mm"))}
                        </p>
                      </div>
                      {appointment.status === "INGEPLAND" && (
                        <Button
                          onClick={() => propOnConfirm?.(appointment.id)}
                          variant="outline"
                        >
                          Bevestigen
                        </Button>
                      )}
                      {appointment.status === "IN_BEHANDELING" && (
                        <Button
                          onClick={() => propOnCheckIn?.(appointment.id)}
                          variant="outline"
                        >
                          Inschrijven
                        </Button>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wachtkamer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {waitingRoom.map((appointment) => {
                const patient = patients.find(
                  (p) => p.id === appointment.patientId
                );
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{patient?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.date), "HH:mm")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aankomende Afspraken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => {
                const patient = patients.find(
                  (p) => p.id === appointment.patientId
                );
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{patient?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.date), "d MMM HH:mm")}
                      </p>
                    </div>
                    {appointment.status === "INGEPLAND" && (
                      <span className="text-sm text-yellow-600">
                        Bevestiging Nodig
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snelle Statistieken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Dagelijkse Inschrijvingen</span>
                <span className="font-medium">{metrics.dailyCheckIns}</span>
              </div>
              <div className="flex justify-between">
                <span>No-Show Percentage</span>
                <span className="font-medium">{metrics.noShowRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Gemiddelde Wachttijd</span>
                <span className="font-medium">{metrics.averageWaitTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
