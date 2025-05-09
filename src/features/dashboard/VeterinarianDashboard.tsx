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

  const isLoading =
    appointmentsLoading || recordsLoading || patientsLoading || clientsLoading;

  const today = format(new Date(), "yyyy-MM-dd");

  const getTodayAppointments = () => {
    return appointments?.filter((apt) => apt.date.startsWith(today)) || [];
  };

  const getWaitingRoom = () => {
    return appointments?.filter((apt) => apt.status === "CHECKED_IN") || [];
  };

  const getCompletedAppointments = () => {
    return appointments?.filter((apt) => apt.status === "COMPLETED") || [];
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
              Today's Appointments
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
              Patients in Queue
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
              Completed Today
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
              Total Patients
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
            <CardTitle>Today's Appointments</CardTitle>
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
                          appointment.status === "COMPLETED"
                            ? "default"
                            : appointment.status === "CHECKED_IN"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      {appointment.status === "scheduled" && (
                        <Button variant="outline" size="sm">
                          Start Appointment
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
            <CardTitle>Patient Queue</CardTitle>
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
                      <Badge variant="secondary">Waiting</Badge>
                      <Badge variant="destructive">High Priority</Badge>
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
            <CardTitle>Clinical Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lab Results Pending</p>
                  <p className="text-xs text-muted-foreground">
                    Blood work for Max
                  </p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Prescriptions to Review</p>
                  <p className="text-xs text-muted-foreground">
                    Antibiotics for Luna
                  </p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Patients Seen Today</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Average Consultation Time
                  </p>
                  <p className="text-2xl font-bold">30 min</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Follow-up Rate</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Medical Records</CardTitle>
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
                      {record.diagnosis}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        record.status === "ACTIVE"
                          ? "default"
                          : record.status === "RESOLVED"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {record.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowRecordDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRecordDetails} onOpenChange={setShowRecordDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Diagnosis</h3>
                <p>{selectedRecord.diagnosis}</p>
              </div>
              <div>
                <h3 className="font-medium">Treatment</h3>
                <p>{selectedRecord.treatment}</p>
              </div>
              <div>
                <h3 className="font-medium">Notes</h3>
                <p>{selectedRecord.notes}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
