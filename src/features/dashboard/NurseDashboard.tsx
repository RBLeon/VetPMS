import { useAppointments, usePatients, useInventory } from "@/lib/hooks/useApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";
import { Badge } from "@/features/ui/components/badge";
import { Skeleton } from "@/features/ui/components/skeleton";
import {
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Activity,
  Syringe,
  Pill,
  Bandage,
} from "lucide-react";
import { Button } from "@/features/ui/components/button";
import { format } from "date-fns";
import { Progress } from "@/features/ui/components/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/ui/components/tabs";
import type { Appointment, Patient, InventoryItem } from "@/lib/api/types";
import { useNavigate } from "react-router-dom";

interface NurseDashboardProps {
  appointments?: Appointment[];
  patients?: Patient[];
  inventory?: InventoryItem[];
  isLoading?: boolean;
  onStartTreatment?: (appointmentId: string) => Promise<void>;
  onCompleteTreatment?: (appointmentId: string) => Promise<void>;
  stats?: {
    completedTreatments: number;
    averageTreatmentTime: string;
  };
}

export const NurseDashboard: React.FC<NurseDashboardProps> = ({
  appointments: propAppointments,
  patients: propPatients,
  inventory: propInventory,
  isLoading: propIsLoading,
  onStartTreatment: propOnStartTreatment,
  onCompleteTreatment: propOnCompleteTreatment,
  stats: propStats,
}) => {
  const navigate = useNavigate();

  const { data: hookAppointments = [], isLoading: appointmentsLoading } =
    useAppointments();
  const { data: hookPatients = [], isLoading: patientsLoading } = usePatients();
  const { data: hookInventory = [], isLoading: inventoryLoading } =
    useInventory();

  const appointments = propAppointments ?? hookAppointments;
  const patients = propPatients ?? hookPatients;
  const inventory = propInventory ?? hookInventory;
  const isLoading =
    propIsLoading !== undefined
      ? propIsLoading
      : appointmentsLoading || patientsLoading || inventoryLoading;

  const today = new Date();

  const waitingRoom = appointments.filter(
    (appointment: Appointment) => appointment.status === "AANGEMELD"
  );

  const stats = propStats ?? {
    completedTreatments: 5,
    averageTreatmentTime: "45",
  };

  const handleNewTreatment = () => {
    navigate("/treatments/new");
  };

  const handleVaccination = () => {
    navigate("/treatments/vaccination");
  };

  const handleMedication = () => {
    navigate("/treatments/medication");
  };

  const handleVitals = () => {
    navigate("/treatments/vitals");
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vandaag</CardTitle>
            <Calendar className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {
                appointments.filter((a: Appointment) => {
                  const d = new Date(a.date);
                  return (
                    d.getDate() === today.getDate() &&
                    d.getMonth() === today.getMonth() &&
                    d.getFullYear() === today.getFullYear()
                  );
                }).length
              }
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">
              Afspraken
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/20 dark:from-[#10B981]/20 dark:to-[#10B981]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wachtkamer</CardTitle>
            <User className="h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981] dark:text-[#10B981]">
              {waitingRoom.length}
            </div>
            <p className="text-xs text-[#10B981] dark:text-[#10B981]">
              Patiënten
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/20 dark:from-[#10B981]/20 dark:to-[#10B981]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Voltooide Behandelingen
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981] dark:text-[#10B981]">
              {stats.completedTreatments}
            </div>
            <p className="text-xs text-[#10B981] dark:text-[#10B981]">
              Vandaag
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/20 dark:from-[#3B82F6]/20 dark:to-[#3B82F6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Voorraad Alert
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B82F6] dark:text-[#3B82F6]">
              {
                inventory.filter(
                  (item: InventoryItem) => item.quantity <= item.reorderLevel
                ).length
              }
            </div>
            <p className="text-xs text-[#3B82F6] dark:text-[#3B82F6]">Items</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients">
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="patients"
            className="data-[state=active]:bg-[#8B5CF6]/10 dark:data-[state=active]:bg-[#8B5CF6]/20"
          >
            <User className="h-4 w-4 mr-2 text-[#8B5CF6] dark:text-[#8B5CF6]" />
            Patiënten
          </TabsTrigger>
          <TabsTrigger
            value="treatments"
            className="data-[state=active]:bg-[#10B981]/10 dark:data-[state=active]:bg-[#10B981]/20"
          >
            <Stethoscope className="h-4 w-4 mr-2 text-[#10B981] dark:text-[#10B981]" />
            Behandelingen
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-[#3B82F6]/10 dark:data-[state=active]:bg-[#3B82F6]/20"
          >
            <Activity className="h-4 w-4 mr-2 text-[#3B82F6] dark:text-[#3B82F6]" />
            Voorraad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patiënten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map((patient: Patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10"
                  >
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.species} - {patient.breed}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPatient(patient.id)}
                      className="bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:hover:bg-[#8B5CF6]/30 text-[#8B5CF6] dark:text-[#8B5CF6]"
                    >
                      Bekijk Patiënt
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Behandelingen Vandaag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment: Appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#10B981]/5 dark:bg-[#10B981]/10"
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.date), "HH:mm")} -{" "}
                        {appointment.type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPatient(appointment.patientId)}
                        className="bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:hover:bg-[#8B5CF6]/30 text-[#8B5CF6] dark:text-[#8B5CF6]"
                      >
                        Bekijk Patiënt
                      </Button>
                      {appointment.status === "INGEPLAND" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => propOnStartTreatment?.(appointment.id)}
                          className="bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]"
                        >
                          Start Behandeling
                        </Button>
                      )}
                      {appointment.status === "IN_BEHANDELING" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            propOnCompleteTreatment?.(appointment.id)
                          }
                          className="bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]"
                        >
                          Voltooi Behandeling
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Voorraad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.map((item: InventoryItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Aantal: {item.quantity} (Bestelpunt: {item.reorderLevel}
                        )
                      </p>
                    </div>
                    {item.quantity <= item.reorderLevel && (
                      <Badge
                        variant="destructive"
                        className="bg-red-300 hover:bg-red-400 text-white dark:bg-red-900/50 dark:hover:bg-red-900/70"
                      >
                        Lage Voorraad
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Behandelingsstatistieken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Voltooide Behandelingen
                  </span>
                  <span className="text-sm font-medium">
                    {stats.completedTreatments}
                  </span>
                </div>
                <Progress
                  value={stats.completedTreatments * 10}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#10B981] dark:[&>div]:bg-[#10B981]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Gemiddelde Behandelingstijd
                  </span>
                  <span className="text-sm font-medium">
                    {stats.averageTreatmentTime} min
                  </span>
                </div>
                <Progress
                  value={parseInt(stats.averageTreatmentTime) * 2}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#10B981] dark:[&>div]:bg-[#10B981]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Voorraad Alert
                  </span>
                  <span className="text-sm font-medium">
                    {
                      inventory.filter(
                        (item: InventoryItem) =>
                          item.quantity <= item.reorderLevel
                      ).length
                    }
                  </span>
                </div>
                <Progress
                  value={
                    inventory.filter(
                      (item: InventoryItem) =>
                        item.quantity <= item.reorderLevel
                    ).length * 10
                  }
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#3B82F6] dark:[&>div]:bg-[#3B82F6]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snelle Acties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="w-full bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30"
                variant="outline"
                onClick={handleNewTreatment}
              >
                <Bandage className="mr-2 h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
                Nieuwe Behandeling
              </Button>
              <Button
                className="w-full bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30"
                variant="outline"
                onClick={handleVaccination}
              >
                <Syringe className="mr-2 h-4 w-4 text-[#10B981] dark:text-[#10B981]" />
                Vaccinatie
              </Button>
              <Button
                className="w-full bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:hover:bg-[#8B5CF6]/30"
                variant="outline"
                onClick={handleMedication}
              >
                <Pill className="mr-2 h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
                Medicatie
              </Button>
              <Button
                className="w-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30"
                variant="outline"
                onClick={handleVitals}
              >
                <Activity className="mr-2 h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
                Vitalen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
