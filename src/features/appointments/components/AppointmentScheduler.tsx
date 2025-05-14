import React, { useState, useEffect } from "react";
import { useUi } from "@/lib/context/UiContext";
import { useTenant } from "@/lib/context/TenantContext";
import { Button } from "@/features/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/ui/components/dialog";
import { format, addDays } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { useToast } from "@/features/ui/components/use-toast";
import { Resource, AppointmentTypeConfig } from "./types/appointment";
import { AppointmentForm } from "./AppointmentForm";

const AppointmentScheduler: React.FC = () => {
  const { setCurrentWorkspace } = useUi();
  const { currentTenant } = useTenant();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [resources, setResources] = useState<Resource[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<
    AppointmentTypeConfig[]
  >([]);

  // Modal states
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] =
    useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    providerId: string;
    hour: number;
  } | null>(null);

  // Set appointments as current workspace and fetch data
  useEffect(() => {
    setCurrentWorkspace("appointments");
    fetchResourcesAndAppointments();
  }, [setCurrentWorkspace, currentTenant?.id, selectedDate]);

  const fetchResourcesAndAppointments = async () => {
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
        const mockAppointmentTypes: AppointmentTypeConfig[] = [
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

        setResources(mockResources);
        setAppointmentTypes(mockAppointmentTypes);
      }, 500);
    } catch (error) {
      toast({
        title: "Fout",
        description:
          "Er is een fout opgetreden bij het ophalen van de gegevens",
        variant: "destructive",
      });
    }
  };

  const handleCellClick = (providerId: string, hour: number) => {
    setSelectedTimeSlot({ providerId, hour });
    setIsNewAppointmentModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(selectedDate, "EEEE d MMMM yyyy", { locale: nl })}
          </h2>
        </div>
        <Button onClick={() => setIsNewAppointmentModalOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nieuwe Afspraak
        </Button>
      </div>

      {/* Scheduler Grid */}
      <div className="grid grid-cols-[200px_1fr] gap-4">
        {/* Time slots */}
        <div className="space-y-2">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="h-12 flex items-center justify-end pr-2">
              {`${i.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>

        {/* Resources and appointments */}
        <div className="grid grid-cols-1 gap-4">
          {resources
            .filter((r) => r.type === "PROVIDER")
            .map((resource) => (
              <div key={resource.id} className="grid grid-cols-24 gap-1">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div
                    key={hour}
                    className="h-12 border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCellClick(resource.id, hour)}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>

      {/* New Appointment Modal */}
      <Dialog
        open={isNewAppointmentModalOpen}
        onOpenChange={setIsNewAppointmentModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe Afspraak</DialogTitle>
            <DialogDescription>
              Maak een nieuwe afspraak aan voor{" "}
              {selectedTimeSlot &&
                format(selectedDate, "EEEE d MMMM yyyy", { locale: nl })}
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            appointmentTypes={appointmentTypes}
            onSubmit={() => {
              setIsNewAppointmentModalOpen(false);
              toast({
                title: "Succes",
                description: "Afspraak succesvol aangemaakt",
              });
            }}
            onCancel={() => setIsNewAppointmentModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentScheduler;
