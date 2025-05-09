import { useState, useMemo } from "react";
import {
  format,
  parse,
  isToday,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppointments } from "../../lib/hooks/useAppointments";
import { usePatients } from "@/lib/hooks/useApi";
import { useClients } from "../../lib/hooks/useClients";
import type { AppointmentStatus, AppointmentType } from "../../lib/api/types";
import { Badge } from "@/components/ui/badge";

const getStatusColor = (status: AppointmentStatus): string => {
  switch (status) {
    case "SCHEDULED":
      return "bg-blue-100 text-blue-700";
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "CANCELED":
      return "bg-red-100 text-red-700";
    case "NO_SHOW":
      return "bg-yellow-100 text-yellow-700";
    case "CHECKED_IN":
      return "bg-purple-100 text-purple-700";
    case "IN_PROGRESS":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusBadgeVariant = (
  status: AppointmentStatus
): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "SCHEDULED":
      return "default";
    case "COMPLETED":
      return "secondary";
    case "CANCELED":
    case "NO_SHOW":
      return "destructive";
    default:
      return "default";
  }
};

export function Calendar() {
  const { data: appointments } = useAppointments();
  const { data: patients } = usePatients();
  const { data: clients } = useClients();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType] = useState<AppointmentType | null>(null);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter((appointment) => {
      if (selectedType && appointment.type !== selectedType) return false;
      const appointmentDate = `${appointment.date}T${appointment.time}`;
      return (
        appointmentDate.split("T")[0] ===
        selectedDate.toISOString().split("T")[0]
      );
    });
  }, [appointments, selectedType, selectedDate]);

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dayAppointments = appointments?.filter((appointment) => {
        const appointmentDate = `${appointment.date}T${appointment.time}`;
        return appointmentDate.split("T")[0] === format(day, "yyyy-MM-dd");
      });

      return {
        date: day,
        isCurrentMonth: isSameMonth(day, currentDate),
        isToday: isToday(day),
        appointments: dayAppointments || [],
      };
    });
  }, [appointments, currentDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  if (!appointments?.length) {
    return <div>No appointments scheduled</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-8 text-center text-sm font-medium leading-8"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted">
        {daysInMonth.map(({ date, isCurrentMonth, isToday, appointments }) => (
          <div
            key={date.toString()}
            className={cn(
              "relative h-32 bg-background p-2",
              !isCurrentMonth && "text-muted-foreground",
              isToday && "bg-accent"
            )}
            onClick={() => handleDateClick(date)}
          >
            <time
              dateTime={format(date, "yyyy-MM-dd")}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full",
                isToday && "bg-primary text-primary-foreground"
              )}
            >
              {format(date, "d")}
            </time>
            <div className="space-y-1">
              {appointments.map((appointment) => {
                const patient = patients?.find(
                  (p) => p.id === appointment.patientId
                );
                const client = clients?.find(
                  (c) => c.id === appointment.clientId
                );

                return (
                  <HoverCard key={appointment.id}>
                    <HoverCardTrigger asChild>
                      <div
                        className={cn(
                          "truncate rounded-md px-2 py-1 text-xs",
                          getStatusColor(appointment.status)
                        )}
                      >
                        {format(
                          parse(
                            `${appointment.date}T${appointment.time}`,
                            "yyyy-MM-dd'T'HH:mm",
                            new Date()
                          ),
                          "h:mm a"
                        )}{" "}
                        - {patient?.name}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <div className="font-medium">{appointment.type}</div>
                        <div className="text-sm text-muted-foreground">
                          Time:{" "}
                          {format(
                            parse(
                              `${appointment.date}T${appointment.time}`,
                              "yyyy-MM-dd'T'HH:mm",
                              new Date()
                            ),
                            "h:mm a"
                          )}
                        </div>
                        <div>
                          <div className="font-medium">Patient</div>
                          <div className="text-sm text-muted-foreground">
                            {patient?.name}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Client</div>
                          <div className="text-sm text-muted-foreground">
                            {client && `${client.firstName} ${client.lastName}`}
                          </div>
                        </div>
                        {appointment.isRecurring &&
                          appointment.recurringPattern && (
                            <div className="text-sm text-muted-foreground">
                              Recurring:{" "}
                              {appointment.recurringPattern.frequency}
                            </div>
                          )}
                        {appointment.notes && (
                          <div>
                            <div className="font-medium">Notes</div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">
          Appointments for {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        <div className="space-y-2">
          {filteredAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No appointments scheduled for this day.
            </p>
          ) : (
            filteredAppointments.map((appointment) => {
              const patient = patients?.find(
                (p) => p.id === appointment.patientId
              );
              const client = clients?.find(
                (c) => c.id === appointment.clientId
              );

              return (
                <div
                  key={appointment.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{appointment.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          parse(
                            `${appointment.date}T${appointment.time}`,
                            "yyyy-MM-dd'T'HH:mm",
                            new Date()
                          ),
                          "h:mm a"
                        )}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Patient</p>
                    <p className="text-sm text-muted-foreground">
                      {patient?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">
                      {client && `${client.firstName} ${client.lastName}`}
                    </p>
                  </div>
                  {appointment.notes && (
                    <div>
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
