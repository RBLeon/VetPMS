import { useAppointments } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { usePatients } from "@/lib/hooks/useApi";
import { useClients } from "@/lib/hooks/useClients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Calendar, Clock, FileText, User } from "lucide-react";
import { format } from "date-fns";

export const VeterinarianDashboard: React.FC = () => {
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const { data: medicalRecords = [], isLoading: recordsLoading } =
    useMedicalRecords();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const { isLoading: clientsLoading } = useClients();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showRecordDetails, setShowRecordDetails] = useState(false);
  const [appointmentsState, setAppointmentsState] = useState<any[]>([]);

  const isLoading =
    appointmentsLoading || recordsLoading || patientsLoading || clientsLoading;

  const today = format(new Date(), "yyyy-MM-dd");

  const appointmentsToUse =
    appointmentsState.length > 0 ? appointmentsState : appointments;

  const getTodayAppointments = () => {
    return appointmentsToUse?.filter((apt) => apt.date.startsWith(today)) || [];
  };

  const getWaitingRoom = () => {
    return (
      appointmentsToUse?.filter(
        (apt) => apt.status === "AANGEMELD" || apt.status === "IN_BEHANDELING"
      ) || []
    );
  };

  const getCompletedAppointments = () => {
    return appointments?.filter((apt) => apt.status === "VOLTOOID") || [];
  };

  const getRecentRecords = () => {
    return (
      medicalRecords?.filter((record) => {
        const recordDate = new Date(record.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return recordDate >= thirtyDaysAgo;
      }) || []
    );
  };

  const todayAppointments = getTodayAppointments();
  const waitingRoom = getWaitingRoom();
  const completedAppointments = getCompletedAppointments();
  const recentRecords = getRecentRecords();

  const handleStartAppointment = (id: string) => {
    setAppointmentsState((prev) =>
      (prev.length > 0 ? prev : appointments).map((apt) =>
        apt.id === id ? { ...apt, status: "IN_BEHANDELING" } : apt
      )
    );
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

  if (appointmentsError) {
    return <div className="p-4 text-red-500">{appointmentsError.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Afspraken Vandaag
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Patiëntenwachtrij
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingRoom.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vandaag Voltooid
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedAppointments.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totaal Aantal Patiënten
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Afspraken Vandaag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => {
                const patient = patients.find(
                  (p) => p.id === appointment.patientId
                );
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                    data-testid="queue-item"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{patient?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.time} - {appointment.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          appointment.status === "VOLTOOID"
                            ? "default"
                            : appointment.status === "AANGEMELD" ||
                              appointment.status === "IN_BEHANDELING"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {appointment.status === "IN_BEHANDELING"
                          ? "In Behandeling"
                          : appointment.status}
                      </Badge>
                      {appointment.status === "INGEPLAND" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartAppointment(appointment.id)}
                        >
                          Afspraak Starten
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patiëntenwachtrij</CardTitle>
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
                    className="flex items-center justify-between rounded-lg border p-4"
                    data-testid="queue-item"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{patient?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.time} - {appointment.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Wachten</Badge>
                      <Badge variant="destructive">Hoge Prioriteit</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Klinische Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Lab Resultaten in Afwachting
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bloedonderzoek voor Max
                  </p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Recepten te Controleren</p>
                  <p className="text-xs text-muted-foreground">
                    Antibiotica voor Luna
                  </p>
                </div>
                <Badge variant="secondary">In Afwachting</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recente Medische Dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.map((record) => {
                const patient = patients.find((p) => p.id === record.patientId);
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{patient?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(record.date), "dd-MM-yyyy")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowRecordDetails(true);
                      }}
                    >
                      Details Bekijken
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showRecordDetails} onOpenChange={setShowRecordDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medisch Dossier Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Diagnose</h3>
                <p>Diagnose: {selectedRecord.diagnosis}</p>
              </div>
              <div>
                <h3 className="font-medium">Behandeling</h3>
                <p>{selectedRecord.treatment}</p>
              </div>
              <div>
                <h3 className="font-medium">Notities</h3>
                <p>{selectedRecord.notes}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
