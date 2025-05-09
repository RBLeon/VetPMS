import { useMemo } from "react";
import { useAppointments } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { usePatients } from "@/lib/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  User,
  TrendingUp,
} from "lucide-react";

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

export const NurseDashboard: React.FC = () => {
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const {
    data: medicalRecords,
    isLoading: recordsLoading,
    error: recordsError,
  } = useMedicalRecords();
  const {
    data: patients = [],
    isLoading: patientsLoading,
    error: patientsError,
  } = usePatients();

  const isLoading = appointmentsLoading || recordsLoading || patientsLoading;

  const getCurrentTreatments = () => {
    if (!appointments) return [];
    return appointments.filter(
      (apt) => apt.status === "IN_PROGRESS" && apt.type === "CHECK_UP"
    );
  };

  const getMonitoringPatients = () => {
    if (!medicalRecords) return [];
    return medicalRecords.filter(
      (record) => record.status === "ACTIVE" && record.type === "CHECK_UP"
    );
  };

  const getClinicalTasks = () => {
    if (!appointments) return [];
    return appointments.filter(
      (apt) => apt.status === "SCHEDULED" && apt.type === "CHECK_UP"
    );
  };

  const getPatientQueue = () => {
    if (!appointments) return [];
    return appointments.filter(
      (apt) => apt.status === "CHECKED_IN" && apt.type === "CHECK_UP"
    );
  };

  const getCompletedTreatments = () => {
    if (!appointments) return [];
    return appointments.filter(
      (apt) => apt.status === "COMPLETED" && apt.type === "CHECK_UP"
    );
  };

  const currentTreatments = getCurrentTreatments();
  const monitoringPatients = getMonitoringPatients();
  const clinicalTasks = getClinicalTasks();
  const patientQueue = getPatientQueue();
  const completedTreatments = getCompletedTreatments();

  // Calculate quick stats
  const stats = useMemo(() => {
    if (!appointments)
      return {
        treatmentsCompleted: 0,
        avgRecoveryTime: "0 min",
        patientSatisfaction: "0%",
      };

    const treatmentsCompleted = completedTreatments.length;

    const avgRecoveryTime = "45 min"; // This would be calculated from actual data
    const patientSatisfaction = "95%"; // This would be calculated from actual data

    return { treatmentsCompleted, avgRecoveryTime, patientSatisfaction };
  }, [completedTreatments]);

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

  if (appointmentsError || recordsError || patientsError) {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Treatments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTreatments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monitoring Patients
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monitoringPatients.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clinical Tasks
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clinicalTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Queue</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientQueue.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentTreatments.map((appointment) => {
                const patient = patients.find(
                  (p) => p.id === appointment.patientId
                );
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{patient?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.time} - {appointment.type}
                      </p>
                    </div>
                    <Badge variant="default">In Progress</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monitoring Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monitoringPatients.map((record) => {
                const patient = patients?.find(
                  (p) => p.id === record.patientId
                );
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{patient?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.type} - {record.status}
                      </p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clinicalTasks.map((task) => {
              const patient = patients.find((p) => p.id === task.patientId);
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{patient?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.time} - {task.type}
                    </p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
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
            {patientQueue.map((appointment) => {
              const patient = patients.find(
                (p) => p.id === appointment.patientId
              );
              return (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{patient?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.time} - {appointment.type}
                    </p>
                  </div>
                  <Badge variant="secondary">Waiting</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <DashboardCard
        title="Quick Stats"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        className="lg:col-span-3"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.treatmentsCompleted}</p>
            <p className="text-sm text-muted-foreground">
              Treatments Completed
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.avgRecoveryTime}</p>
            <p className="text-sm text-muted-foreground">
              Average Recovery Time
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.patientSatisfaction}</p>
            <p className="text-sm text-muted-foreground">
              Patient Satisfaction
            </p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
