import {
  useAppointments,
  usePatients,
  useMedicalRecords,
} from "@/lib/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  User,
  FileText,
  Stethoscope,
  Clock,
  Activity,
  Pill,
  CheckCircle2,
  ClipboardList,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isValid, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export const VeterinarianDashboard: React.FC = () => {
  const { data: appointments = [], isLoading: appointmentsLoading } =
    useAppointments();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const { data: medicalRecords = [], isLoading: recordsLoading } =
    useMedicalRecords();
  const navigate = useNavigate();

  const today = new Date();

  const formatDate = (dateStr: string, formatStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (!isValid(date)) {
        return "Invalid date";
      }
      return format(date, formatStr);
    } catch (error) {
      return "Invalid date";
    }
  };

  const isSameDay = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (!isValid(date)) {
        return false;
      }
      return format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    } catch (error) {
      return false;
    }
  };

  const todayAppointments = appointments.filter((appointment) =>
    isSameDay(appointment.startTime)
  );

  const recentPatients = patients.slice(0, 5);
  const recentRecords = medicalRecords.slice(0, 5);

  // Dashboard metrics
  const metrics = {
    todayTotal: todayAppointments.length,
    patientsTotal: patients.length,
    recordsTotal: medicalRecords.length,
    completedToday: todayAppointments.filter((a) => a.status === "COMPLETED")
      .length,
  };

  const handleNewAppointment = () => navigate("/appointments/new");
  const handleNewMedicalRecord = () => navigate("/medical-records/new");
  const handleViewPatient = (patientId: string) =>
    navigate(`/patients/${patientId}`);

  if (appointmentsLoading || patientsLoading || recordsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Veterinarian Dashboard</h2>
        <div className="space-x-2">
          <Button onClick={handleNewAppointment}>
            <Calendar className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
          <Button onClick={handleNewMedicalRecord}>
            <FileText className="mr-2 h-4 w-4" />
            New Medical Record
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/20 dark:from-[#8B5CF6]/20 dark:to-[#8B5CF6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5CF6] dark:text-[#8B5CF6]">
              {metrics.todayTotal}
            </div>
            <p className="text-xs text-[#8B5CF6] dark:text-[#8B5CF6]">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Appointments
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {metrics.completedToday}
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/20 dark:from-[#10B981]/20 dark:to-[#10B981]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medical Records
            </CardTitle>
            <FileText className="h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981] dark:text-[#10B981]">
              {metrics.recordsTotal}
            </div>
            <p className="text-xs text-[#10B981] dark:text-[#10B981]">Total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/20 dark:from-[#F59E0B]/20 dark:to-[#F59E0B]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Patients
            </CardTitle>
            <User className="h-4 w-4 text-[#F59E0B] dark:text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F59E0B] dark:text-[#F59E0B]">
              {metrics.patientsTotal}
            </div>
            <p className="text-xs text-[#F59E0B] dark:text-[#F59E0B]">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[#8B5CF6]" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-muted-foreground">
                No appointments scheduled for today
              </p>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-md bg-gradient-to-r from-[#8B5CF6]/5 to-transparent hover:from-[#8B5CF6]/10"
                  >
                    <div>
                      <p className="font-medium">{appointment.patient?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(appointment.startTime, "HH:mm")}
                      </p>
                    </div>
                    <Badge className="bg-[#8B5CF6]/80 hover:bg-[#8B5CF6]">
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-[#F59E0B]" />
              Recent Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between cursor-pointer p-3 rounded-md bg-gradient-to-r from-[#F59E0B]/5 to-transparent hover:from-[#F59E0B]/10"
                  onClick={() => handleViewPatient(patient.id)}
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.species} - {patient.breed}
                    </p>
                  </div>
                  <Button
                    className="bg-[#F59E0B]/80 hover:bg-[#F59E0B] text-white"
                    size="sm"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-[#10B981]" />
              Recent Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="space-y-1 p-3 rounded-md bg-gradient-to-r from-[#10B981]/5 to-transparent hover:from-[#10B981]/10"
                >
                  <p className="font-medium">{record.patient?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.chiefComplaint}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(record.visitDate, "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer"
          onClick={() => navigate("/medical-records/new")}
        >
          <FileText className="h-10 w-10 mb-4 text-[#10B981]" />
          <h3 className="font-medium">New Medical Record</h3>
        </Card>

        <Card
          className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer"
          onClick={() => navigate("/appointments/new")}
        >
          <Calendar className="h-10 w-10 mb-4 text-[#8B5CF6]" />
          <h3 className="font-medium">New Appointment</h3>
        </Card>

        <Card
          className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer"
          onClick={() => navigate("/prescriptions/new")}
        >
          <Pill className="h-10 w-10 mb-4 text-[#3B82F6]" />
          <h3 className="font-medium">New Prescription</h3>
        </Card>

        <Card
          className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer"
          onClick={() => navigate("/patients")}
        >
          <ListChecks className="h-10 w-10 mb-4 text-[#F59E0B]" />
          <h3 className="font-medium">Patient List</h3>
        </Card>
      </div>
    </div>
  );
};
