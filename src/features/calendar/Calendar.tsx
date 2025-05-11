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
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  UserX,
  UserCheck,
  Activity,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { nl } from "date-fns/locale";

const getAppointmentStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case "INGEPLAND":
      return "default";
    case "AANGEMELD":
      return "info";
    case "IN_BEHANDELING":
      return "warning";
    case "VOLTOOID":
      return "success";
    case "GEANNULEERD":
      return "destructive";
    case "NIET_VERSCHENEN":
      return "destructive";
    default:
      return "default";
  }
};

const getStatusIcon = (status: AppointmentStatus) => {
  switch (status) {
    case "INGEPLAND":
      return <CalendarIcon className="h-4 w-4" />;
    case "AANGEMELD":
      return <UserCheck className="h-4 w-4" />;
    case "IN_BEHANDELING":
      return <Activity className="h-4 w-4" />;
    case "VOLTOOID":
      return <CheckCircle className="h-4 w-4" />;
    case "GEANNULEERD":
      return <XCircle className="h-4 w-4" />;
    case "NIET_VERSCHENEN":
      return <UserX className="h-4 w-4" />;
    default:
      return <CalendarIcon className="h-4 w-4" />;
  }
};

const getStatusBadgeVariant = (
  status: AppointmentStatus
): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "INGEPLAND":
      return "default";
    case "AANGEMELD":
    case "IN_BEHANDELING":
      return "secondary";
    case "GEANNULEERD":
    case "NIET_VERSCHENEN":
      return "destructive";
    case "VOLTOOID":
      return "secondary";
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
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  const getAppointmentsForDate = (date: Date) => {
    return (
      appointments?.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getDate() === date.getDate() &&
          appointmentDate.getMonth() === date.getMonth() &&
          appointmentDate.getFullYear() === date.getFullYear()
        );
      }) || []
    );
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
                          getAppointmentStatusColor(appointment.status)
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
                          Tijd:{" "}
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
                          <div className="font-medium">Patiënt</div>
                          <div className="text-sm text-muted-foreground">
                            {patient?.name}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Klant</div>
                          <div className="text-sm text-muted-foreground">
                            {client && `${client.firstName} ${client.lastName}`}
                          </div>
                        </div>
                        {appointment.isRecurring &&
                          appointment.recurringPattern && (
                            <div className="text-sm text-muted-foreground">
                              Herhaling:{" "}
                              {appointment.recurringPattern.frequency}
                            </div>
                          )}
                        {appointment.notes && (
                          <div>
                            <div className="font-medium">Notities</div>
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
                      {getStatusIcon(appointment.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Patiënt</p>
                    <p className="text-sm text-muted-foreground">
                      {patient?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Klant</p>
                    <p className="text-sm text-muted-foreground">
                      {client && `${client.firstName} ${client.lastName}`}
                    </p>
                  </div>
                  {appointment.notes && (
                    <div>
                      <p className="text-sm font-medium">Notities</p>
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

      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date
                ? format(date, "PPP", { locale: nl })
                : "Selecteer een datum"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) {
                  setSelectedDate(newDate);
                }
              }}
              locale={nl}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        {date && (
          <>
            <h3 className="font-medium">
              Afspraken voor {format(date, "PPP", { locale: nl })}
            </h3>
            <div className="space-y-2">
              {getAppointmentsForDate(date).map((appointment) => {
                const patient = patients?.find(
                  (p) => p.id === appointment.patientId
                );
                return (
                  <div
                    key={appointment.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg p-3",
                      getAppointmentStatusColor(appointment.status)
                    )}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(appointment.status)}
                      <div>
                        <p className="font-medium">{patient?.name}</p>
                        <p className="text-sm">{appointment.type}</p>
                      </div>
                    </div>
                    <p className="text-sm">{appointment.time}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
