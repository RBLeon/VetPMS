import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";
import { useRole } from "@/lib/context/RoleContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/lib/hooks/useApi";
import { format, parseISO, isValid, isToday } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppointmentForm } from "@/features/appointments/AppointmentForm";

export function DashboardPage() {
  const { role } = useRole();
  const navigate = useNavigate();
  const { data: appointments = [], isLoading: appointmentsLoading } =
    useAppointments();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  // Filter appointments for selected date
  useEffect(() => {
    if (appointments.length) {
      const filtered = appointments.filter((appointment) => {
        try {
          const appointmentDate = parseISO(appointment.date);
          return (
            isValid(appointmentDate) &&
            format(appointmentDate, "yyyy-MM-dd") ===
              format(selectedDate, "yyyy-MM-dd")
          );
        } catch (error) {
          return false;
        }
      });

      // Sort by time
      filtered.sort((a, b) => {
        const aTime = parseISO(`${a.date}T${a.time}`);
        const bTime = parseISO(`${b.date}T${b.time}`);
        return aTime.getTime() - bTime.getTime();
      });

      setTodayAppointments(filtered);
    }
  }, [appointments, selectedDate]);

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "CEO":
        return "bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30 text-[#3B82F6] dark:text-[#3B82F6]";
      case "MANAGER":
        return "bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]";
      case "VETERINARIAN":
        return "bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:hover:bg-[#8B5CF6]/30 text-[#8B5CF6] dark:text-[#8B5CF6]";
      case "NURSE":
        return "bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]";
      case "RECEPTIONIST":
        return "bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30 text-[#3B82F6] dark:text-[#3B82F6]";
      default:
        return "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300";
    }
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "CHECKED_IN":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatAppointmentTime = (timeStr: string) => {
    try {
      // Time is already in HH:mm format
      return timeStr;
    } catch (error) {
      return "Invalid time";
    }
  };

  const handleAppointmentSubmit = (data: any) => {
    // TODO: Implement appointment creation
    console.log("Creating appointment:", data);
    setIsAppointmentDialogOpen(false);
    // You can add actual appointment creation logic here
  };

  const handleAppointmentCancel = () => {
    setIsAppointmentDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {role && (
            <Badge variant="outline" className={getRoleBadgeColor(role)}>
              {role}
            </Badge>
          )}
        </div>
        <Button
          onClick={() => navigate("/appointments")}
          className="bg-primary"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Full Scheduler
        </Button>
      </div>

      {/* Quick Scheduler View - Hide for CEO */}
      {role !== "CEO" && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span>Today's Schedule</span>
              </CardTitle>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={goToPreviousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={isToday(selectedDate) ? "default" : "outline"}
                  size="sm"
                  onClick={goToToday}
                >
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading appointments...</span>
              </div>
            ) : todayAppointments.length > 0 ? (
              <div className="space-y-1">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center py-2 px-3 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => navigate(`/appointments/${appointment.id}`)}
                  >
                    <div className="w-16 text-muted-foreground">
                      {formatAppointmentTime(appointment.time)}
                    </div>
                    <div className="flex-1 ml-2">
                      <div className="font-medium">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.type || "Regular checkup"}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">
                  No appointments for {format(selectedDate, "MMMM d")}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {isToday(selectedDate)
                    ? "Free day! Nothing scheduled today."
                    : "There are no appointments scheduled for this day."}
                </p>
                <Dialog
                  open={isAppointmentDialogOpen}
                  onOpenChange={setIsAppointmentDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="mt-4">Schedule an appointment</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Nieuwe Afspraak</DialogTitle>
                    </DialogHeader>
                    <AppointmentForm
                      onSubmit={handleAppointmentSubmit}
                      onCancel={handleAppointmentCancel}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <RoleBasedDashboard role={role} />
    </div>
  );
}
