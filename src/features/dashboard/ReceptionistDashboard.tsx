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
  User,
} from "lucide-react";
import type { Appointment, Client, Patient } from "@/lib/api/types";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  const handleNewAppointment = () => {
    navigate("/appointments/new");
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleViewClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleCallPatient = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleSendSMS = (phone: string) => {
    // In a real implementation, this would open an SMS modal or redirect to an SMS service
    console.log("Sending SMS to:", phone);
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
        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vandaag</CardTitle>
            <Calendar className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
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
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">
              Afspraken
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/20 dark:from-[#10B981]/20 dark:to-[#10B981]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wachtkamer</CardTitle>
            <Users className="h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981] dark:text-[#10B981]">
              {waitingRoom.length}
            </div>
            <p className="text-xs text-[#10B981] dark:text-[#10B981]">
              Patiënten
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
              {metrics.averageWaitTime}
            </div>
            <p className="text-xs text-[#8B5CF6] dark:text-[#8B5CF6]">
              Minuten
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-Show Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {metrics.noShowRate}
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">
              Percentage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="today"
            className="data-[state=active]:bg-[#3B82F6]/10 dark:data-[state=active]:bg-[#3B82F6]/20"
          >
            <Calendar className="h-4 w-4 mr-2 text-[#3B82F6] dark:text-[#3B82F6]" />
            Vandaag
          </TabsTrigger>
          <TabsTrigger
            value="waiting"
            className="data-[state=active]:bg-[#10B981]/10 dark:data-[state=active]:bg-[#10B981]/20"
          >
            <Users className="h-4 w-4 mr-2 text-[#10B981] dark:text-[#10B981]" />
            Wachtkamer
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-[#8B5CF6]/10 dark:data-[state=active]:bg-[#8B5CF6]/20"
          >
            <Clock className="h-4 w-4 mr-2 text-[#8B5CF6] dark:text-[#8B5CF6]" />
            Aankomend
          </TabsTrigger>
          <TabsTrigger
            value="patients"
            className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/50"
          >
            <User className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
            Patiënten
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className="data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900/50"
          >
            <Users className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
            Klanten
          </TabsTrigger>
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
                        className="flex items-center justify-between p-4 rounded-lg border bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10"
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{client?.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {appointment.status === "INGEPLAND" && (
                            <Button
                              onClick={() => propOnConfirm?.(appointment.id)}
                              variant="outline"
                              className="bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30 text-[#3B82F6] dark:text-[#3B82F6]"
                            >
                              Bevestigen
                            </Button>
                          )}
                          {appointment.status === "IN_BEHANDELING" && (
                            <Button
                              onClick={() => propOnCheckIn?.(appointment.id)}
                              variant="outline"
                              className="bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]"
                            >
                              Inschrijven
                            </Button>
                          )}
                          <Badge
                            variant="outline"
                            className={getAppointmentStatusColor(
                              appointment.status
                            )}
                          >
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
                      className="flex items-center justify-between p-4 rounded-lg border bg-[#10B981]/5 dark:bg-[#10B981]/10"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getAppointmentTypeIcon(appointment.type)}
                          <p className="font-medium dark:text-green-100">
                            {patient?.name}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-green-300">
                          {format(new Date(appointment.date), "HH:mm")}
                        </p>
                        <div className="flex items-center gap-2 text-sm dark:text-green-300">
                          <Phone className="h-3 w-3" />
                          <span>{client?.phone}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-white dark:bg-green-900/50 dark:text-green-100 dark:border-green-700"
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
                      className="flex items-center justify-between p-4 rounded-lg border bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getAppointmentTypeIcon(appointment.type)}
                          <p className="font-medium dark:text-yellow-100">
                            {patient?.name}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-yellow-300">
                          {format(new Date(appointment.date), "d MMM HH:mm")}
                        </p>
                        <div className="flex items-center gap-2 text-sm dark:text-yellow-300">
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

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patiënten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10"
                  >
                    <div>
                      <p className="font-medium dark:text-purple-100">
                        {patient.name}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-purple-300">
                        {patient.species} - {patient.breed}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPatient(patient.id)}
                      className="bg-white dark:bg-purple-900/5"
                    >
                      Bekijk Patiënt
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Klanten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10"
                  >
                    <div>
                      <p className="font-medium dark:text-indigo-100">
                        {client?.id}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-indigo-300">
                        {client.email} - {client.phone}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClient(client.id)}
                      className="bg-white dark:bg-indigo-900/5"
                    >
                      Bekijk Klant
                    </Button>
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
            <CardTitle>Snelle Statistieken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Dagelijkse Inschrijvingen
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.dailyCheckIns}
                  </span>
                </div>
                <Progress
                  value={metrics.dailyCheckIns * 10}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#3B82F6] dark:[&>div]:bg-[#3B82F6]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    No-Show Percentage
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.noShowRate}
                  </span>
                </div>
                <Progress
                  value={parseInt(metrics.noShowRate)}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#8B5CF6] dark:[&>div]:bg-[#8B5CF6]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Gemiddelde Wachttijd
                  </span>
                  <span className="text-sm font-medium">
                    {metrics.averageWaitTime}
                  </span>
                </div>
                <Progress
                  value={parseInt(metrics.averageWaitTime) * 2}
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
                onClick={() => handleCallPatient(clients[0]?.phone)}
              >
                <Phone className="mr-2 h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
                Bel Patiënt
              </Button>
              <Button
                className="w-full bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30"
                variant="outline"
                onClick={() => handleSendEmail(clients[0]?.email)}
              >
                <Mail className="mr-2 h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
                Stuur Email
              </Button>
              <Button
                className="w-full bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:hover:bg-[#8B5CF6]/30"
                variant="outline"
                onClick={() => handleSendSMS(clients[0]?.phone)}
              >
                <MessageSquare className="mr-2 h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
                SMS Herinnering
              </Button>
              <Button
                className="w-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30"
                variant="outline"
                onClick={handleNewAppointment}
              >
                <Calendar className="mr-2 h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
                Nieuwe Afspraak
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
