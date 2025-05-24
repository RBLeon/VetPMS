import { useAppointments, useClients, usePatients } from "@/lib/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Users,
  User,
  Clock,
  CheckCircle,
  ListChecks,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isValid, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

export const ReceptionistDashboard: React.FC = () => {
  const { data: appointments = [], isLoading: appointmentsLoading } =
    useAppointments();
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();
  const navigate = useNavigate();

  const today = new Date();

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
    isSameDay(appointment.date)
  );

  const waitingRoom = todayAppointments.filter(
    (appointment) => appointment.status === "AANGEMELD"
  );

  const upcomingAppointments = todayAppointments.filter(
    (appointment) => appointment.status === "INGEPLAND"
  );

  const recentClients = clients.slice(0, 5);

  // Dashboard metrics
  const metrics = {
    todayTotal: todayAppointments.length,
    waitingCount: waitingRoom.length,
    upcomingCount: upcomingAppointments.length,
    clientsTotal: clients.length,
    patientsTotal: patients.length,
  };

  const handleNewClient = () => navigate("/clients/new");
  const handleCheckIn = () => navigate("/appointments/check-in");

  if (appointmentsLoading || clientsLoading || patientsLoading) {
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
        <h2 className="text-3xl font-bold">Reception Dashboard</h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {metrics.todayTotal}
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/20 dark:from-[#8B5CF6]/20 dark:to-[#8B5CF6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Room</CardTitle>
            <Clock className="h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5CF6] dark:text-[#8B5CF6]">
              {metrics.waitingCount}
            </div>
            <p className="text-xs text-[#8B5CF6] dark:text-[#8B5CF6]">
              Patients
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/20 dark:from-[#10B981]/20 dark:to-[#10B981]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Clients
            </CardTitle>
            <Users className="h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981] dark:text-[#10B981]">
              {metrics.clientsTotal}
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
              <Clock className="mr-2 h-5 w-5 text-[#8B5CF6]" />
              Waiting Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            {waitingRoom.length === 0 ? (
              <p className="text-muted-foreground">
                No patients in waiting room
              </p>
            ) : (
              <div className="space-y-4">
                {waitingRoom.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-md bg-gradient-to-r from-[#8B5CF6]/5 to-transparent hover:from-[#8B5CF6]/10"
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time}
                      </p>
                    </div>
                    <Badge className="bg-[#8B5CF6]/80 hover:bg-[#8B5CF6]">
                      Waiting
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
              <Calendar className="mr-2 h-5 w-5 text-[#3B82F6]" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-muted-foreground">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-md bg-gradient-to-r from-[#3B82F6]/5 to-transparent hover:from-[#3B82F6]/10"
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time}
                      </p>
                    </div>
                    <Button
                      className="bg-[#3B82F6]/80 hover:bg-[#3B82F6] text-white"
                      size="sm"
                      onClick={() =>
                        navigate(`/appointments/${appointment.id}/check-in`)
                      }
                    >
                      Check-in
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-[#10B981]" />
              Recent Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 rounded-md bg-gradient-to-r from-[#10B981]/5 to-transparent hover:from-[#10B981]/10"
                >
                  <div>
                    <p className="font-medium">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                  <Button
                    className="bg-[#10B981]/80 hover:bg-[#10B981] text-white"
                    size="sm"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    View
                  </Button>
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
          onClick={handleNewClient}
        >
          <UserPlus className="h-10 w-10 mb-4 text-[#10B981]" />
          <h3 className="font-medium">New Client</h3>
        </Card>

        <Card
          className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer"
          onClick={() => navigate("/appointments")}
        >
          <Calendar className="h-10 w-10 mb-4 text-[#3B82F6]" />
          <h3 className="font-medium">New Appointment</h3>
        </Card>

        <Card
          className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer"
          onClick={handleCheckIn}
        >
          <CheckCircle className="h-10 w-10 mb-4 text-[#8B5CF6]" />
          <h3 className="font-medium">Check-in</h3>
        </Card>

        <Card
          className="flex flex-col items-center justify-center p-6 hover:bg-muted/50 cursor-pointer"
          onClick={() => navigate("/clients")}
        >
          <ListChecks className="h-10 w-10 mb-4 text-[#F59E0B]" />
          <h3 className="font-medium">Client List</h3>
        </Card>
      </div>
    </div>
  );
};
