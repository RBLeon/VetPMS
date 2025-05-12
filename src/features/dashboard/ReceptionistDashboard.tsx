import { useAppointments, usePatients, useClients } from "@/lib/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
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
  const { data: hookClients = [], isLoading: isLoadingClients } = useClients();

  const appointments = propAppointments ?? hookAppointments;
  const patients = propPatients ?? hookPatients;
  const clients = propClients ?? hookClients;
  const isLoading =
    propIsLoading !== undefined
      ? propIsLoading
      : (!propAppointments && isLoadingAppointments) ||
        (!propPatients && isLoadingPatients) ||
        (!propClients && isLoadingClients);
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

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case "VOLTOOID":
        return "bg-green-100 text-green-800";
      case "AANGEMELD":
        return "bg-blue-100 text-blue-800";
      case "IN_BEHANDELING":
        return "bg-yellow-100 text-yellow-800";
      case "GEANNULEERD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "CONTROLE":
        return <Calendar className="h-4 w-4" />;
      case "VACCINATIE":
        return <CheckCircle2 className="h-4 w-4" />;
      case "OPERATIE":
        return <AlertTriangle className="h-4 w-4" />;
      case "SPOEDGEVAL":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vandaag</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {
                appointments.filter((a) => {
                  const d = new Date(a.date);
                  return (
                    d.getDate() === today.getDate() &&
                    d.getMonth() === today.getMonth() &&
                    d.getFullYear() === today.getFullYear()
                  );
                }).length
              }
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Afspraken
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wachtkamer</CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {waitingRoom.length}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Patiënten
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gemiddelde Wachttijd
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {metrics.averageWaitTime}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Minuten
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {metrics.noShowRate}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Percentage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Vandaag</TabsTrigger>
          <TabsTrigger value="waiting">Wachtkamer</TabsTrigger>
          <TabsTrigger value="upcoming">Aankomend</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Afspraken Vandaag</CardTitle>
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
                    const client = clients?.find(
                      (c) => c.id === appointment.clientId
                    );
                    return (
                      <div
                        key={appointment.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${getAppointmentStatusColor(
                          appointment.status
                        )}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getAppointmentTypeIcon(appointment.type)}
                            <p className="font-medium">{patient?.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {appointment.time ||
                              format(new Date(appointment.date), "HH:mm")}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{client?.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {appointment.status === "INGEPLAND" && (
                            <Button
                              onClick={() => propOnConfirm?.(appointment.id)}
                              variant="outline"
                              className="bg-white"
                            >
                              Bevestigen
                            </Button>
                          )}
                          {appointment.status === "IN_BEHANDELING" && (
                            <Button
                              onClick={() => propOnCheckIn?.(appointment.id)}
                              variant="outline"
                              className="bg-white"
                            >
                              Inschrijven
                            </Button>
                          )}
                          <Badge variant="outline" className="bg-white">
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waiting" className="space-y-4">
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
                  const client = clients?.find(
                    (c) => c.id === appointment.clientId
                  );
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getAppointmentTypeIcon(appointment.type)}
                          <p className="font-medium dark:text-blue-100">
                            {patient?.name}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-blue-300">
                          {format(new Date(appointment.date), "HH:mm")}
                        </p>
                        <div className="flex items-center gap-2 text-sm dark:text-blue-300">
                          <Phone className="h-3 w-3" />
                          <span>{client?.phone}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-white dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
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
                  const client = clients?.find(
                    (c) => c.id === appointment.clientId
                  );
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getAppointmentTypeIcon(appointment.type)}
                          <p className="font-medium dark:text-gray-100">
                            {patient?.name}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">
                          {format(new Date(appointment.date), "d MMM HH:mm")}
                        </p>
                        <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                          <Phone className="h-3 w-3" />
                          <span>{client?.phone}</span>
                        </div>
                      </div>
                      {appointment.status === "INGEPLAND" && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-100 dark:border-yellow-700"
                        >
                          Bevestiging Nodig
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Snelle Statistieken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    Dagelijkse Inschrijvingen
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.dailyCheckIns}
                  </span>
                </div>
                <Progress value={metrics.dailyCheckIns * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    No-Show Percentage
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.noShowRate}
                  </span>
                </div>
                <Progress
                  value={parseInt(metrics.noShowRate)}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    Gemiddelde Wachttijd
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.averageWaitTime}
                  </span>
                </div>
                <Progress
                  value={parseInt(metrics.averageWaitTime) * 2}
                  className="h-2"
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
              <Button className="w-full" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Bel Patiënt
              </Button>
              <Button className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Stuur Email
              </Button>
              <Button className="w-full" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                SMS Herinnering
              </Button>
              <Button className="w-full" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Nieuwe Afspraak
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
