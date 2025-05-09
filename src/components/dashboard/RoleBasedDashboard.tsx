import { useRole } from "../../lib/context/RoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  FileText,
  Stethoscope,
  Heart,
  CreditCard,
  ClipboardList,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "../../lib/context/AppointmentContext";
import { useClients } from "../../lib/context/ClientContext";
import { usePatients } from "../../lib/context/PatientContext";
import { useTestResults } from "../../lib/context/TestResultContext";
import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "../../lib/context/TaskContext";
import { useMedications } from "../../lib/context/MedicationContext";
import { useRevenue } from "../../lib/context/RevenueContext";
import { useStaff } from "../../lib/context/StaffContext";
import { useInventory } from "../../lib/context/InventoryContext";

/**
 * RoleBasedDashboard displays different dashboard content based on user role
 * Leverages the roleConfigs to determine what components and quick actions to show
 */
export function RoleBasedDashboard() {
  const { role, roleConfig } = useRole();

  if (!roleConfig?.contextualFeatures?.useRoleBasedDashboard) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Role-based dashboard is not enabled for your role.
        </p>
      </div>
    );
  }

  // Return different dashboard based on role
  switch (role) {
    case "veterinarian":
      return <VeterinarianDashboard />;
    case "receptionist":
      return <ReceptionistDashboard />;
    case "nurse":
      return <NurseDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "ceo":
      return <CEODashboard />;
    default:
      return <DefaultDashboard />;
  }
}

// Role-specific dashboard implementations
function VeterinarianDashboard() {
  const navigate = useNavigate();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const {
    data: patients,
    isLoading: patientsLoading,
    error: patientsError,
  } = usePatients();
  const {
    data: testResults,
    isLoading: testResultsLoading,
    error: testResultsError,
  } = useTestResults();

  const isLoading =
    appointmentsLoading || patientsLoading || testResultsLoading;
  const error = appointmentsError || patientsError || testResultsError;

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!appointments || !patients || !testResults) return null;

    const upcomingAppointments = appointments.filter(
      (apt) => new Date(apt.date) > new Date() && apt.status === "SCHEDULED"
    );
    const pendingResults = testResults.filter(
      (result) => result.status === "PENDING"
    );
    const criticalPatients = patients.filter(
      (patient) => patient.status === "CRITICAL"
    );

    return {
      upcomingAppointments: upcomingAppointments.length,
      nextAppointment: upcomingAppointments[0],
      pendingResults: pendingResults.length,
      nextResult: pendingResults[0],
      criticalPatients: criticalPatients.length,
      criticalPatient: criticalPatients[0],
    };
  }, [appointments, patients, testResults]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">
              Error loading dashboard data
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Veterinarian Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/appointments")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Today's Schedule
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.upcomingAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              Next: {metrics?.nextAppointment?.patientName} (
              {metrics?.nextAppointment?.patientType}) @{" "}
              {metrics?.nextAppointment?.time}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Test Results
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.pendingResults}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.nextResult?.expectedTime
                ? `Lab results expected by ${metrics.nextResult.expectedTime}`
                : "No pending results"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Patients
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.criticalPatients}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.criticalPatient
                ? `${metrics.criticalPatient.name} - ${metrics.criticalPatient.condition}`
                : "No critical patients"}
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">Recent Patients</h3>
      <div className="space-y-4">
        {patients?.slice(0, 3).map((patient) => (
          <Card key={patient.id} className="overflow-hidden">
            <div className="flex">
              <div className="p-4 w-2/3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {patient.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{patient.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {patient.type}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">{patient.lastVisitReason}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last visit: {patient.lastVisitDate}
                  </p>
                </div>
              </div>
              <div className="w-1/3 bg-muted p-4 border-l">
                <h5 className="text-sm font-medium mb-2">Quick Actions</h5>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/medical-records/${patient.id}`)}
                  >
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Medical Record</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      navigate(`/medical/soap/new?patientId=${patient.id}`)
                    }
                  >
                    <Stethoscope className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">New SOAP Note</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReceptionistDashboard() {
  const navigate = useNavigate();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const {
    data: clients,
    isLoading: clientsLoading,
    error: clientsError,
  } = useClients();
  const {
    data: patients,
    isLoading: patientsLoading,
    error: patientsError,
  } = usePatients();

  const isLoading = appointmentsLoading || clientsLoading || patientsLoading;
  const error = appointmentsError || clientsError || patientsError;

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
    const todayAppointments = appointments.filter(
      (apt) => apt.date === new Date().toISOString().split("T")[0]
    ).length;

    return {
      totalAppointments,
      completedAppointments,
      waitingAppointments,
      todayAppointments,
      completionRate: (completedAppointments / totalAppointments) * 100,
    };
  }, [appointments]);

  // Get today's appointments
  const todayAppointments = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter(
      (apt) => apt.date === new Date().toISOString().split("T")[0]
    );
  }, [appointments]);

  // Get waiting room status
  const waitingRoom = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter((apt) => apt.status === "CHECKED_IN");
  }, [appointments]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">
              Error loading dashboard data
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Receptionist Dashboard
          </h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.todayAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.waitingAppointments} waiting
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {patients?.length || 0} patients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.completionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.completedAppointments} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Room</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.waitingAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              {waitingRoom.length} patients checked in
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
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
                  </div>
                );
              })}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => navigate("/clients/new")}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback>+</AvatarFallback>
                </Avatar>
                <span className="text-xs">New Client</span>
              </Button>
              <Button
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => navigate("/appointments/new")}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs">Schedule Appointment</span>
              </Button>
              <Button
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => navigate("/appointments/check-in")}
              >
                <ClipboardList className="h-6 w-6" />
                <span className="text-xs">Check-In</span>
              </Button>
              <Button
                className="flex flex-col items-center justify-center h-20 space-y-1"
                onClick={() => navigate("/payments/new")}
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-xs">Process Payment</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Client Communications */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Client Communications</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NurseDashboard() {
  const navigate = useNavigate();
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks();
  const {
    data: patients,
    isLoading: patientsLoading,
    error: patientsError,
  } = usePatients();
  const {
    data: medications,
    isLoading: medicationsLoading,
    error: medicationsError,
  } = useMedications();

  const isLoading = tasksLoading || patientsLoading || medicationsLoading;
  const error = tasksError || patientsError || medicationsError;

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!tasks || !patients || !medications) return null;

    const urgentTasks = tasks.filter((task) => task.priority === "high");
    const standardTasks = tasks.filter((task) => task.priority === "medium");
    const patientsUnderCare = patients.filter(
      (patient) => patient.status === "UNDER_CARE"
    );
    const patientsNeedingVitals = patients.filter(
      (patient) => patient.needsVitalsCheck
    );
    const upcomingMedications = medications.filter(
      (med) => new Date(med.scheduledTime) > new Date()
    );

    return {
      totalTasks: tasks.length,
      urgentTasks: urgentTasks.length,
      standardTasks: standardTasks.length,
      patientsUnderCare: patientsUnderCare.length,
      patientsNeedingVitals: patientsNeedingVitals.length,
      upcomingMedications: upcomingMedications.length,
      nextMedication: upcomingMedications[0],
    };
  }, [tasks, patients, medications]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">
              Error loading dashboard data
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Nurse Dashboard</h2>
        <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
          <FileText className="mr-2 h-4 w-4" />
          Tasks
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Tasks
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.urgentTasks} urgent, {metrics?.standardTasks} standard
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Patients Under Care
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.patientsUnderCare}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.patientsNeedingVitals} needing vitals check
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medication Schedule
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.upcomingMedications}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.nextMedication
                ? `Next: ${metrics.nextMedication.room} at ${metrics.nextMedication.scheduledTime}`
                : "No upcoming medications"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks?.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }`}
                />
                <div>
                  <p className="font-medium">
                    {task.scheduledTime} - {task.patientName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.description} ({task.room})
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                Complete
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ManagerDashboard() {
  const navigate = useNavigate();
  const {
    data: revenue,
    isLoading: revenueLoading,
    error: revenueError,
  } = useRevenue();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const {
    data: staff,
    isLoading: staffLoading,
    error: staffError,
  } = useStaff();
  const {
    data: inventory,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useInventory();

  const isLoading =
    revenueLoading || appointmentsLoading || staffLoading || inventoryLoading;
  const error =
    revenueError || appointmentsError || staffError || inventoryError;

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!revenue || !appointments || !staff || !inventory) return null;

    const todayRevenue = revenue.today;
    const yesterdayRevenue = revenue.yesterday;
    const revenueChange =
      ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

    const todayAppointments = appointments.filter(
      (apt) => apt.date === new Date().toISOString().split("T")[0]
    );
    const newClients = appointments.filter(
      (apt) =>
        apt.isNewClient && apt.date === new Date().toISOString().split("T")[0]
    );

    const staffOnDuty = staff.members.filter((member) => member.isOnDuty);
    const staffByRole = {
      vets: staffOnDuty.filter((member) => member.role === "veterinarian")
        .length,
      nurses: staffOnDuty.filter((member) => member.role === "nurse").length,
      support: staffOnDuty.filter((member) => member.role === "support").length,
    };

    const lowInventory = inventory.items.filter(
      (item) => item.quantity <= item.reorderLevel
    );

    return {
      todayRevenue,
      revenueChange,
      appointments: todayAppointments.length,
      newClients: newClients.length,
      staffOnDuty: staffOnDuty.length,
      staffByRole,
      lowInventory: lowInventory.length,
    };
  }, [revenue, appointments, staff, inventory]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">
              Error loading dashboard data
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Practice Manager Dashboard
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/reports")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Full Reports
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.todayRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.revenueChange > 0 ? "+" : ""}
              {metrics?.revenueChange.toFixed(1)}% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.appointments}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.newClients} new clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.staffOnDuty}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.staffByRole.vets} vets, {metrics?.staffByRole.nurses}{" "}
              nurses, {metrics?.staffByRole.support} support
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Alerts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.lowInventory}</div>
            <p className="text-xs text-muted-foreground">
              Items below reorder level
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Revenue Chart Placeholder</p>
              <p className="text-xs text-muted-foreground mt-2">
                Exams: {revenue?.breakdown.exams}%, Surgery:{" "}
                {revenue?.breakdown.surgery}%, Labs: {revenue?.breakdown.labs}%,
                Other: {revenue?.breakdown.other}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {staff?.members
              .flatMap((member) => member.notices)
              .map((notice) => (
                <div
                  key={notice.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/notices/${notice.id}`)}
                >
                  <h4 className="font-medium">{notice.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {notice.message}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CEODashboard() {
  const navigate = useNavigate();
  const {
    data: revenue,
    isLoading: revenueLoading,
    error: revenueError,
  } = useRevenue();
  const {
    data: patients,
    isLoading: patientsLoading,
    error: patientsError,
  } = usePatients();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const {
    data: staff,
    isLoading: staffLoading,
    error: staffError,
  } = useStaff();

  const isLoading =
    revenueLoading || patientsLoading || appointmentsLoading || staffLoading;
  const error =
    revenueError || patientsError || appointmentsError || staffError;

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!revenue || !patients || !appointments || !staff) return null;

    const totalRevenue = revenue.monthly;
    const lastMonthRevenue = revenue.lastMonth;
    const revenueChange =
      ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    const activePatients = patients.filter(
      (patient) => patient.status === "ACTIVE"
    );
    const newPatients = patients.filter(
      (patient) =>
        new Date(patient.registrationDate) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const monthlyAppointments = appointments.filter(
      (apt) =>
        new Date(apt.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const lastMonthAppointments = appointments.filter(
      (apt) =>
        new Date(apt.date) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) &&
        new Date(apt.date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const appointmentChange =
      ((monthlyAppointments.length - lastMonthAppointments.length) /
        lastMonthAppointments.length) *
      100;

    const staffPerformance = staff.members.map((member) => ({
      ...member,
      utilization: calculateUtilization(member, appointments),
    }));

    return {
      totalRevenue,
      revenueChange,
      activePatients: activePatients.length,
      newPatients: newPatients.length,
      monthlyAppointments: monthlyAppointments.length,
      appointmentChange,
      staffPerformance,
    };
  }, [revenue, patients, appointments, staff]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">
              Error loading dashboard data
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Practice Overview</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/reports/revenue")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button size="sm" onClick={() => navigate("/reports/generate")}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.revenueChange > 0 ? "+" : ""}
              {metrics?.revenueChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.activePatients.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.newPatients} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.monthlyAppointments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.appointmentChange > 0 ? "+" : ""}
              {metrics?.appointmentChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.2%</div>
            <p className="text-xs text-muted-foreground">Year over year</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics?.staffPerformance.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-lg"
                onClick={() => navigate(`/staff/${member.id}`)}
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{member.utilization}%</p>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Practice Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">New Patients</p>
                <p className="text-sm font-medium">+{metrics?.newPatients}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Revenue Growth</p>
                <p className="text-sm font-medium">
                  {metrics?.revenueChange > 0 ? "+" : ""}
                  {metrics?.revenueChange.toFixed(1)}%
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Staff Efficiency</p>
                <p className="text-sm font-medium">+8.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Monthly Revenue</p>
                <p className="text-sm font-medium">
                  ${metrics?.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Operating Costs</p>
                <p className="text-sm font-medium">
                  ${revenue?.operatingCosts.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Net Profit</p>
                <p className="text-sm font-medium">
                  ${revenue?.netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Practice Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Patient Satisfaction</p>
                <p className="text-sm font-medium">
                  {staff?.metrics.satisfaction}/5.0
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Staff Retention</p>
                <p className="text-sm font-medium">
                  {staff?.metrics.retention}%
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Appointment Fill Rate</p>
                <p className="text-sm font-medium">
                  {staff?.metrics.fillRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to calculate staff utilization
function calculateUtilization(staff, appointments) {
  const staffAppointments = appointments.filter(
    (apt) => apt.staffId === staff.id
  );
  const totalSlots = staff.workingHours * 4; // Assuming 15-minute slots
  const usedSlots = staffAppointments.length;
  return Math.round((usedSlots / totalSlots) * 100);
}

function DefaultDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        No specific dashboard configured for your role.
      </p>
    </div>
  );
}
