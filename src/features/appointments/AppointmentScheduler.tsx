import React, { useState, useEffect } from "react";
import { useUi } from "../../lib/context/UiContext";
import { useTenant } from "../../lib/context/TenantContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format, addDays } from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";

// Type definitions
interface Resource {
  id: string;
  name: string;
  type: "ROOM" | "EQUIPMENT" | "PROVIDER" | "STAFF";
  color?: string;
}

interface AppointmentType {
  id: string;
  name: string;
  color: string;
  defaultDuration: number;
}

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  clientName: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  clientId: string;
  clientName: string;
  providerId: string;
  resourceIds: string[];
  typeId: string;
  type: AppointmentType;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status:
    | "INGEPLAND"
    | "AANGEMELD"
    | "IN_BEHANDELING"
    | "VOLTOOID"
    | "GEANNULEERD"
    | "NIET_VERSCHENEN";
}

const AppointmentScheduler: React.FC = () => {
  const { setCurrentWorkspace } = useUi();
  const { currentTenant } = useTenant();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(
    []
  );

  // New appointment form state
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] =
    useState(false);
  const [newAppointmentForm, setNewAppointmentForm] = useState({
    patientId: "",
    patientName: "",
    clientName: "",
    providerId: "",
    resourceIds: [] as string[],
    typeId: "",
    date: new Date(),
    startTime: "09:00",
    duration: 30,
    notes: "",
  });

  // Patient search state
  const [isPatientSearchOpen, setIsPatientSearchOpen] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>(
    []
  );

  // Set appointments as current workspace and fetch data
  useEffect(() => {
    setCurrentWorkspace("appointments");
    fetchResourcesAndAppointments();
  }, [setCurrentWorkspace, currentTenant?.id, selectedDate]);

  const fetchResourcesAndAppointments = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, this would be API calls
      // Mock implementation with setTimeout to simulate API latency
      setTimeout(() => {
        // Mock resources
        const mockResources: Resource[] = [
          { id: "1", name: "Dhr. Jansen", type: "PROVIDER", color: "#4338ca" },
          {
            id: "2",
            name: "Dhr. de Vries",
            type: "PROVIDER",
            color: "#0891b2",
          },
          { id: "3", name: "Onderzoekskamer 1", type: "ROOM" },
          { id: "4", name: "Onderzoekskamer 2", type: "ROOM" },
          { id: "5", name: "Onderzoekskamer 3", type: "ROOM" },
          { id: "6", name: "Echografie", type: "EQUIPMENT" },
        ];

        // Mock appointment types
        const mockAppointmentTypes: AppointmentType[] = [
          { id: "1", name: "Controle", color: "#22c55e", defaultDuration: 30 },
          { id: "2", name: "Operatie", color: "#ef4444", defaultDuration: 90 },
          {
            id: "3",
            name: "Vaccinatie",
            color: "#3b82f6",
            defaultDuration: 15,
          },
          {
            id: "4",
            name: "Tandheelkunde",
            color: "#f97316",
            defaultDuration: 60,
          },
          {
            id: "5",
            name: "Spoedgeval",
            color: "#dc2626",
            defaultDuration: 45,
          },
        ];

        // Mock appointments
        const today = new Date();
        const mockAppointments: Appointment[] = [
          {
            id: "1",
            patientId: "p1",
            patientName: "Max",
            clientId: "c1",
            clientName: "Jan de Vries",
            providerId: "1",
            resourceIds: ["1", "3"],
            typeId: "1",
            type: mockAppointmentTypes[0],
            startTime: new Date(today.setHours(9, 0, 0)),
            endTime: new Date(today.setHours(9, 30, 0)),
            status: "VOLTOOID",
          },
          {
            id: "2",
            patientId: "p2",
            patientName: "Bella",
            clientId: "c2",
            clientName: "Emma Jansen",
            providerId: "1",
            resourceIds: ["1", "3"],
            typeId: "3",
            type: mockAppointmentTypes[2],
            startTime: new Date(today.setHours(10, 0, 0)),
            endTime: new Date(today.setHours(10, 15, 0)),
            status: "AANGEMELD",
          },
          {
            id: "3",
            patientId: "p3",
            patientName: "Charlie",
            clientId: "c3",
            clientName: "Michael Bakker",
            providerId: "2",
            resourceIds: ["2", "4"],
            typeId: "4",
            type: mockAppointmentTypes[3],
            startTime: new Date(today.setHours(11, 0, 0)),
            endTime: new Date(today.setHours(12, 0, 0)),
            status: "INGEPLAND",
          },
          {
            id: "4",
            patientId: "p4",
            patientName: "Luna",
            clientId: "c4",
            clientName: "Sophia Visser",
            providerId: "2",
            resourceIds: ["2", "5", "6"],
            typeId: "2",
            type: mockAppointmentTypes[1],
            startTime: new Date(today.setHours(13, 30, 0)),
            endTime: new Date(today.setHours(15, 0, 0)),
            status: "INGEPLAND",
          },
        ];

        setResources(mockResources);
        setAppointmentTypes(mockAppointmentTypes);
        setAppointments(mockAppointments);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching scheduler data:", error);
      setIsLoading(false);
    }
  };

  // Handle date navigation
  const goToNextDay = () => {
    setSelectedDate((currentDate) => addDays(currentDate, 1));
  };

  const goToPreviousDay = () => {
    setSelectedDate((currentDate) => addDays(currentDate, -1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Handle new appointment creation
  const handleCreateNewAppointment = () => {
    // In a real app, this would save to an API
    console.log("Create appointment:", newAppointmentForm);

    // Create new appointment object
    const selectedType = appointmentTypes.find(
      (type) => type.id === newAppointmentForm.typeId
    );
    if (!selectedType) return;

    const startDateTime = new Date(newAppointmentForm.date);
    const [hours, minutes] = newAppointmentForm.startTime
      .split(":")
      .map(Number);
    startDateTime.setHours(hours, minutes, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(
      endDateTime.getMinutes() + newAppointmentForm.duration
    );

    const newAppointment: Appointment = {
      id: `new-${Date.now()}`,
      patientId: newAppointmentForm.patientId || "onbekend",
      patientName: newAppointmentForm.patientName,
      clientId: "onbekend",
      clientName: newAppointmentForm.clientName,
      providerId: newAppointmentForm.providerId,
      resourceIds: newAppointmentForm.providerId
        ? [newAppointmentForm.providerId]
        : [],
      typeId: newAppointmentForm.typeId,
      type: selectedType,
      startTime: startDateTime,
      endTime: endDateTime,
      notes: newAppointmentForm.notes,
      status: "INGEPLAND",
    };

    // Add to appointments list
    setAppointments((prev) => [...prev, newAppointment]);

    // Close modal and reset form
    setIsNewAppointmentModalOpen(false);
    setNewAppointmentForm({
      patientId: "",
      patientName: "",
      clientName: "",
      providerId: "",
      resourceIds: [],
      typeId: "",
      date: new Date(),
      startTime: "09:00",
      duration: 30,
      notes: "",
    });
  };

  // Handle patient search
  const handlePatientSearch = (query: string) => {
    setPatientSearchQuery(query);

    // In a real app, this would be an API call
    // Mock implementation for demo
    if (query.length > 2) {
      const mockResults: Patient[] = [
        {
          id: "p1",
          name: "Max",
          species: "Hond",
          breed: "Labrador",
          clientName: "Jan de Vries",
        },
        {
          id: "p2",
          name: "Bella",
          species: "Kat",
          breed: "Pers",
          clientName: "Emma Jansen",
        },
        {
          id: "p5",
          name: "Milo",
          species: "Hond",
          breed: "Beagle",
          clientName: "David Bakker",
        },
      ].filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.clientName.toLowerCase().includes(query.toLowerCase())
      );

      setPatientSearchResults(mockResults);
    } else {
      setPatientSearchResults([]);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setNewAppointmentForm((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      clientName: patient.clientName,
    }));
    setPatientSearchResults([]);
    setPatientSearchQuery("");
    setIsPatientSearchOpen(false);
  };

  // Calculate time slots for the scheduler
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // Get appointments for a specific resource at a specific time
  const getAppointmentsForCell = (resourceId: string, hour: number) => {
    const startHourTime = new Date(selectedDate);
    startHourTime.setHours(hour, 0, 0, 0);

    const endHourTime = new Date(selectedDate);
    endHourTime.setHours(hour + 1, 0, 0, 0);

    return appointments.filter((appt) => {
      const apptStart = new Date(appt.startTime);
      const apptEnd = new Date(appt.endTime);

      // Check if appointment involves this resource
      const usesResource = appt.resourceIds.includes(resourceId);

      // Check if appointment overlaps with this time slot
      const overlapsTimeSlot =
        (apptStart < endHourTime && apptStart >= startHourTime) ||
        (apptEnd > startHourTime && apptEnd <= endHourTime) ||
        (apptStart <= startHourTime && apptEnd >= endHourTime);

      return usesResource && overlapsTimeSlot;
    });
  };

  // Calculate the position and size of an appointment in the grid
  const getAppointmentStyle = (appt: Appointment, hour: number) => {
    const startTime = new Date(appt.startTime);
    const endTime = new Date(appt.endTime);

    // Calculate offset within the hour cell (in percentage)
    const hourStartTime = new Date(selectedDate);
    hourStartTime.setHours(hour, 0, 0, 0);

    const hourEndTime = new Date(selectedDate);
    hourEndTime.setHours(hour + 1, 0, 0, 0);

    // Calculate top position based on minutes past the hour
    const startMinutesPastHour =
      startTime >= hourStartTime
        ? (startTime.getHours() - hourStartTime.getHours()) * 60 +
          startTime.getMinutes()
        : 0;

    const topPercentage = (startMinutesPastHour / 60) * 100;

    // Calculate height based on appointment duration
    const appointmentDurationWithinCell = Math.min(
      ((endTime <= hourEndTime ? endTime : hourEndTime).getTime() -
        (startTime >= hourStartTime ? startTime : hourStartTime).getTime()) /
        (1000 * 60),
      60
    );

    const heightPercentage = (appointmentDurationWithinCell / 60) * 100;

    return {
      top: `${topPercentage}%`,
      height: `${heightPercentage}%`,
      backgroundColor: appt.type.color,
      opacity: appt.status === "GEANNULEERD" ? 0.5 : 1,
    };
  };

  // Show appointment details when clicking on an appointment
  const handleAppointmentClick = (appointment: Appointment) => {
    console.log("Appointment clicked:", appointment);
    // In a real app, this would open a detailed view or modal
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Afspraak Planner
          </h1>
          <p className="text-muted-foreground">Afspraak plannen en beheren</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousDay}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Vandaag
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextDay}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>

          <div className="h-8 border-l mx-2"></div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="h-8 border-l mx-2"></div>

          <Button onClick={() => setIsNewAppointmentModalOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nieuwe Afspraak
          </Button>
        </div>
      </div>

      {/* Scheduler view */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading scheduler...</span>
            </div>
          ) : (
            <div className="relative">
              {/* Header row with resources */}
              <div className="flex border-b">
                <div className="w-20 shrink-0 px-4 py-3 font-medium text-center border-r">
                  Tijd
                </div>
                {resources
                  .filter((r) => r.type === "PROVIDER") // Only show providers in the header
                  .map((resource) => (
                    <div
                      key={resource.id}
                      className="flex-1 px-4 py-3 font-medium text-center border-r"
                      style={{ color: resource.color }}
                    >
                      {resource.name}
                    </div>
                  ))}
              </div>

              {/* Time slots */}
              <div className="relative">
                {timeSlots.map((hour) => (
                  <div key={hour} className="flex border-b last:border-b-0">
                    {/* Time cell */}
                    <div className="w-20 shrink-0 px-4 py-3 text-sm text-center border-r">
                      {hour % 12 === 0 ? 12 : hour % 12}:00{" "}
                      {hour < 12 ? "AM" : "PM"}
                    </div>

                    {/* Resource cells */}
                    {resources
                      .filter((r) => r.type === "PROVIDER") // Only show providers in the grid
                      .map((resource) => (
                        <div
                          key={`${resource.id}-${hour}`}
                          className="flex-1 border-r relative h-24"
                        >
                          {/* Half-hour line */}
                          <div className="absolute w-full border-t border-dashed border-border opacity-50 top-1/2 left-0"></div>

                          {/* Appointment slots */}
                          {getAppointmentsForCell(resource.id, hour).map(
                            (appt) => (
                              <div
                                key={appt.id}
                                className="absolute left-2 right-2 rounded p-2 text-xs text-white overflow-hidden cursor-pointer"
                                style={getAppointmentStyle(appt, hour)}
                                onClick={() => handleAppointmentClick(appt)}
                              >
                                <div className="font-semibold">
                                  {appt.patientName}
                                </div>
                                <div className="text-xs opacity-90">
                                  {appt.type.name}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Appointment Modal */}
      <Dialog
        open={isNewAppointmentModalOpen}
        onOpenChange={setIsNewAppointmentModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nieuwe Afspraak</DialogTitle>
            <DialogDescription>
              Afspraak plannen voor een patiënt.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patient">Patiënt</Label>
              <div className="relative">
                <Input
                  id="patient"
                  placeholder="Patiënt zoeken..."
                  value={patientSearchQuery}
                  onClick={() => setIsPatientSearchOpen(true)}
                  onChange={(e) => handlePatientSearch(e.target.value)}
                  className="w-full"
                />

                {isPatientSearchOpen && (
                  <div className="absolute top-full left-0 z-50 w-full mt-1 bg-card border rounded-md shadow-lg">
                    <div className="p-3">
                      {patientSearchResults.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-2">
                          Geen patiënten gevonden. Typ om te zoeken...
                        </p>
                      ) : (
                        <div className="max-h-48 overflow-auto">
                          {patientSearchResults.map((patient) => (
                            <div
                              key={patient.id}
                              className="flex justify-between p-3 hover:bg-accent rounded cursor-pointer"
                              onClick={() => handlePatientSelect(patient)}
                            >
                              <div>
                                <div className="font-medium">
                                  {patient.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {patient.species} • {patient.breed}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {patient.clientName}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {newAppointmentForm.patientId && (
                <div className="flex justify-between bg-muted p-3 rounded text-sm">
                  <span>
                    {newAppointmentForm.patientName} •{" "}
                    {newAppointmentForm.clientName}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() =>
                      setNewAppointmentForm((prev) => ({
                        ...prev,
                        patientId: "",
                        patientName: "",
                        clientName: "",
                      }))
                    }
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Appointment Type */}
            <div className="space-y-2">
              <Label htmlFor="appointmentType">Afspraak Type</Label>
              <Select
                value={newAppointmentForm.typeId}
                onValueChange={(value) => {
                  const selectedType = appointmentTypes.find(
                    (type) => type.id === value
                  );
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    typeId: value,
                    duration: selectedType?.defaultDuration || prev.duration,
                  }));
                }}
              >
                <SelectTrigger id="appointmentType" className="w-full">
                  <SelectValue placeholder="Afspraak type selecteren" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: type.color }}
                        />
                        <span>{type.name}</span>
                        <span className="ml-1 text-muted-foreground">
                          ({type.defaultDuration} min)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select
                value={newAppointmentForm.providerId}
                onValueChange={(value) =>
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    providerId: value,
                  }))
                }
              >
                <SelectTrigger id="provider" className="w-full">
                  <SelectValue placeholder="Provider selecteren" />
                </SelectTrigger>
                <SelectContent>
                  {resources
                    .filter((r) => r.type === "PROVIDER")
                    .map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                      disabled={!newAppointmentForm.typeId}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newAppointmentForm.date
                        ? format(newAppointmentForm.date, "PPP")
                        : "Datum selecteren"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newAppointmentForm.date}
                      onSelect={(date) =>
                        date &&
                        setNewAppointmentForm((prev) => ({ ...prev, date }))
                      }
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Tijd</Label>
                <div className="flex items-center space-x-2">
                  <Select
                    value={newAppointmentForm.startTime}
                    onValueChange={(value) =>
                      setNewAppointmentForm((prev) => ({
                        ...prev,
                        startTime: value,
                      }))
                    }
                  >
                    <SelectTrigger id="startTime" className="w-full">
                      <SelectValue placeholder="Tijd selecteren" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, hour) => {
                        return [
                          <SelectItem
                            key={`${hour}:00`}
                            value={`${hour.toString().padStart(2, "0")}:00`}
                          >
                            {hour === 0
                              ? "12:00 AM"
                              : hour < 12
                              ? `${hour}:00 AM`
                              : hour === 12
                              ? "12:00 PM"
                              : `${hour - 12}:00 PM`}
                          </SelectItem>,
                          <SelectItem
                            key={`${hour}:30`}
                            value={`${hour.toString().padStart(2, "0")}:30`}
                          >
                            {hour === 0
                              ? "12:30 AM"
                              : hour < 12
                              ? `${hour}:30 AM`
                              : hour === 12
                              ? "12:30 PM"
                              : `${hour - 12}:30 PM`}
                          </SelectItem>,
                        ];
                      }).flat()}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="duration">Duur (minuten)</Label>
                <span className="text-sm text-muted-foreground">
                  {new Date(
                    0,
                    0,
                    0,
                    0,
                    newAppointmentForm.duration
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() =>
                    setNewAppointmentForm((prev) => ({
                      ...prev,
                      duration: Math.max(5, prev.duration - 5),
                    }))
                  }
                  disabled={newAppointmentForm.duration <= 5}
                >
                  -
                </Button>
                <Input
                  id="duration"
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={newAppointmentForm.duration}
                  onChange={(e) =>
                    setNewAppointmentForm((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() =>
                    setNewAppointmentForm((prev) => ({
                      ...prev,
                      duration: Math.min(120, prev.duration + 5),
                    }))
                  }
                  disabled={newAppointmentForm.duration >= 120}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notities</Label>
              <Textarea
                id="notes"
                placeholder="Extra informatie toevoegen..."
                value={newAppointmentForm.notes}
                onChange={(e) =>
                  setNewAppointmentForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewAppointmentModalOpen(false)}
            >
              Annuleren
            </Button>
            <Button
              onClick={handleCreateNewAppointment}
              disabled={
                !newAppointmentForm.patientName ||
                !newAppointmentForm.typeId ||
                !newAppointmentForm.providerId
              }
            >
              Afspraak Plannen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentScheduler;
