import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AppointmentStatus } from "@/types/appointment";

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

export type SchedulerAppointment = {
  id: string;
  patientId: string;
  patientName: string;
  clientId: string;
  clientName: string;
  providerId: number;
  resourceIds: string[];
  typeId: string;
  type: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status: AppointmentStatus;
};

interface AppointmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentCreated?: (appointment: SchedulerAppointment) => void;
}

export const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  isOpen,
  onOpenChange,
  onAppointmentCreated,
}) => {
  const { toast } = useToast();

  // State for resources and appointment types
  const [resources, setResources] = useState<Resource[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(
    []
  );

  // New appointment form state
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

  // Mock data - in a real app this would come from API
  useEffect(() => {
    // Mock resources
    const mockResources: Resource[] = [
      { id: "1", name: "Dhr. Jansen", type: "PROVIDER", color: "#4338ca" },
      { id: "2", name: "Dhr. de Vries", type: "PROVIDER", color: "#0891b2" },
      { id: "3", name: "Onderzoekskamer 1", type: "ROOM" },
      { id: "4", name: "Onderzoekskamer 2", type: "ROOM" },
      { id: "5", name: "Onderzoekskamer 3", type: "ROOM" },
      { id: "6", name: "Echografie", type: "EQUIPMENT" },
    ];

    // Mock appointment types
    const mockAppointmentTypes: AppointmentType[] = [
      { id: "1", name: "Controle", color: "#22c55e", defaultDuration: 30 },
      { id: "2", name: "Operatie", color: "#ef4444", defaultDuration: 90 },
      { id: "3", name: "Vaccinatie", color: "#3b82f6", defaultDuration: 15 },
      { id: "4", name: "Tandheelkunde", color: "#f97316", defaultDuration: 60 },
      { id: "5", name: "Spoedgeval", color: "#dc2626", defaultDuration: 45 },
    ];

    setResources(mockResources);
    setAppointmentTypes(mockAppointmentTypes);
  }, []);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
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
      setPatientSearchQuery("");
      setPatientSearchResults([]);
      setIsPatientSearchOpen(false);
    }
  }, [isOpen]);

  const handlePatientSearch = (query: string) => {
    setPatientSearchQuery(query);

    if (query.length > 0) {
      // Mock patient search - in a real app this would be an API call
      const mockPatients: Patient[] = [
        {
          id: "p1",
          name: "Max",
          species: "Hond",
          breed: "Golden Retriever",
          clientName: "Jan de Vries",
        },
        {
          id: "p2",
          name: "Bella",
          species: "Kat",
          breed: "Britse Korthaar",
          clientName: "Emma Jansen",
        },
        {
          id: "p3",
          name: "Charlie",
          species: "Hond",
          breed: "Labrador",
          clientName: "Michael Bakker",
        },
        {
          id: "p4",
          name: "Luna",
          species: "Kat",
          breed: "Maine Coon",
          clientName: "Sophia Visser",
        },
        {
          id: "p5",
          name: "Rocky",
          species: "Hond",
          breed: "Bulldog",
          clientName: "David Wilson",
        },
      ];

      const filtered = mockPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query.toLowerCase()) ||
          patient.clientName.toLowerCase().includes(query.toLowerCase())
      );
      setPatientSearchResults(filtered);
      setIsPatientSearchOpen(true);
    } else {
      setPatientSearchResults([]);
      setIsPatientSearchOpen(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setNewAppointmentForm((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      clientName: patient.clientName,
    }));
    setPatientSearchQuery(patient.name);
    setIsPatientSearchOpen(false);
  };

  const handleCreateNewAppointment = () => {
    // Find the selected appointment type for duration
    const selectedType = appointmentTypes.find(
      (type) => type.id === newAppointmentForm.typeId
    );

    // Create start and end times
    const startDateTime = new Date(newAppointmentForm.date);
    const [hours, minutes] = newAppointmentForm.startTime
      .split(":")
      .map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(
      endDateTime.getMinutes() + newAppointmentForm.duration
    );

    const newAppointment: SchedulerAppointment = {
      id: `appointment-${Date.now()}`,
      patientId: newAppointmentForm.patientId || "onbekend",
      patientName: newAppointmentForm.patientName,
      clientId: "client-id", // This would come from the patient data
      clientName: newAppointmentForm.clientName,
      providerId: newAppointmentForm.providerId
        ? Number(newAppointmentForm.providerId)
        : 1,
      resourceIds: newAppointmentForm.providerId
        ? [newAppointmentForm.providerId]
        : [],
      typeId: newAppointmentForm.typeId,
      type: selectedType?.name || "Onbekend",
      startTime: startDateTime,
      endTime: endDateTime,
      notes: newAppointmentForm.notes,
      status: AppointmentStatus.SCHEDULED,
    };

    // Call the callback if provided
    if (onAppointmentCreated) {
      onAppointmentCreated(newAppointment);
    }

    // Show success toast
    toast({
      title: "Afspraak gepland",
      description: `Afspraak voor ${newAppointmentForm.patientName} is succesvol gepland.`,
    });

    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                              <div className="font-medium">{patient.name}</div>
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
                          {`${hour.toString().padStart(2, "0")}:00`}
                        </SelectItem>,
                        <SelectItem
                          key={`${hour}:30`}
                          value={`${hour.toString().padStart(2, "0")}:30`}
                        >
                          {`${hour.toString().padStart(2, "0")}:30`}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
};
