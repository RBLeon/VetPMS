import { useAppointments, usePatients } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Activity,
  Syringe,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Appointment, Patient, MedicalRecord } from "@/lib/api/types";

interface VeterinarianDashboardProps {
  appointments?: Appointment[];
  patients?: Patient[];
  medicalRecords?: MedicalRecord[];
  isLoading?: boolean;
  error?: Error;
  onStartTreatment?: (appointmentId: string) => Promise<void>;
  onCompleteTreatment?: (appointmentId: string) => Promise<void>;
  stats?: {
    completedTreatments: number;
    averageTreatmentTime: string;
  };
}

export const VeterinarianDashboard: React.FC<VeterinarianDashboardProps> = ({
  appointments: propAppointments,
  patients: propPatients,
  medicalRecords: propMedicalRecords,
  isLoading: propIsLoading,
  onStartTreatment: propOnStartTreatment,
  onCompleteTreatment: propOnCompleteTreatment,
  stats: propStats,
}) => {
  const {
    data: hookAppointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const {
    data: hookPatients = [],
    isLoading: patientsLoading,
    error: patientsError,
  } = usePatients();
  const {
    data: hookMedicalRecords = [],
    isLoading: recordsLoading,
    error: recordsError,
  } = useMedicalRecords();

  const appointments = propAppointments ?? hookAppointments;
  const patients = propPatients ?? hookPatients;
  const medicalRecords = propMedicalRecords ?? hookMedicalRecords;
  const isLoading =
    propIsLoading !== undefined
      ? propIsLoading
      : appointmentsLoading || patientsLoading || recordsLoading;

  const today = new Date();

  const waitingRoom = appointments.filter(
    (appointment) => appointment.status === "AANGEMELD"
  );

  const stats = propStats ?? {
    completedTreatments: 5,
    averageTreatmentTime: "45",
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
        return <Stethoscope className="h-4 w-4" />;
      case "VACCINATIE":
        return <Syringe className="h-4 w-4" />;
      case "OPERATIE":
        return <Activity className="h-4 w-4" />;
      case "SPOEDGEVAL":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Stethoscope className="h-4 w-4" />;
    }
  };

  const getVitalSigns = (record: MedicalRecord) => {
    return record.vitalSigns || "N/B";
  };

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

  if (appointmentsError || patientsError || recordsError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">Fout bij het ophalen van gegevens</p>
        </div>
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
            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
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
              Voltooide Behandelingen
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {stats.completedTreatments}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Vandaag
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totaal Patiënten
            </CardTitle>
            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {patients.length}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Actief
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Vandaag</TabsTrigger>
          <TabsTrigger value="waiting">Wachtkamer</TabsTrigger>
          <TabsTrigger value="records">Medische Dossiers</TabsTrigger>
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
                          <p className="text-sm text-muted-foreground">
                            {appointment.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {appointment.status === "AANGEMELD" && (
                            <Button
                              onClick={() =>
                                propOnStartTreatment?.(appointment.id)
                              }
                              variant="outline"
                              className="bg-white"
                            >
                              Start Behandeling
                            </Button>
                          )}
                          {appointment.status === "IN_BEHANDELING" && (
                            <Button
                              onClick={() =>
                                propOnCompleteTreatment?.(appointment.id)
                              }
                              variant="outline"
                              className="bg-white"
                            >
                              Voltooien
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
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-blue-50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getAppointmentTypeIcon(appointment.type)}
                          <p className="font-medium">{patient?.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(appointment.date), "HH:mm")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.type}
                        </p>
                      </div>
                      <Button
                        onClick={() => propOnStartTreatment?.(appointment.id)}
                        variant="outline"
                        className="bg-white"
                      >
                        Start Behandeling
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recente Medische Dossiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalRecords.slice(0, 5).map((record) => {
                  const patient = patients.find(
                    (p) => p.id === record.patientId
                  );
                  const vitals = getVitalSigns(record);
                  return (
                    <Dialog key={record.id}>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-white cursor-pointer hover:bg-gray-50">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <p className="font-medium">{patient?.name}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(record.date), "dd/MM/yyyy")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {record.type}
                            </p>
                          </div>
                          <Badge variant="outline">{record.status}</Badge>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Medisch Dossier</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">Patiënt</h3>
                            <p>{patient?.name}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Datum</h3>
                            <p>{format(new Date(record.date), "dd/MM/yyyy")}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Type</h3>
                            <p>{record.type}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Status</h3>
                            <p>{record.status}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Vitalen</h3>
                            <p>{vitals}</p>
                          </div>
                          <div>
                            <h3 className="font-medium">Notities</h3>
                            <p>{record.notes}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
            <CardTitle>Behandelingsstatistieken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    Voltooide Behandelingen
                  </span>
                  <span className="text-sm font-medium">
                    {stats.completedTreatments}
                  </span>
                </div>
                <Progress
                  value={stats.completedTreatments * 10}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    Gemiddelde Behandelingstijd
                  </span>
                  <span className="text-sm font-medium">
                    {stats.averageTreatmentTime} min
                  </span>
                </div>
                <Progress
                  value={parseInt(stats.averageTreatmentTime) * 2}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Totaal Patiënten</span>
                  <span className="text-sm font-medium">{patients.length}</span>
                </div>
                <Progress value={patients.length * 2} className="h-2" />
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
                <Stethoscope className="mr-2 h-4 w-4" />
                Nieuwe Controle
              </Button>
              <Button className="w-full" variant="outline">
                <Syringe className="mr-2 h-4 w-4" />
                Vaccinatie
              </Button>
              <Button className="w-full" variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                Operatie
              </Button>
              <Button className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Dossier
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
