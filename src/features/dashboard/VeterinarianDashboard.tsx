import { useAppointments, usePatients, useInventory } from "@/lib/hooks/useApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";
import { Skeleton } from "@/features/ui/components/skeleton";
import {
  AlertCircle,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Activity,
  Syringe,
  FileText,
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
import { useNavigate } from "react-router-dom";
import type { Appointment, Patient, MedicalRecord } from "@/lib/api/types";

interface VeterinarianDashboardProps {
  appointments?: Appointment[];
  patients?: Patient[];
  medicalRecords?: MedicalRecord[];
  isLoading?: boolean;
  error?: Error;
  onStartConsultation?: (appointmentId: string) => Promise<void>;
  onCompleteConsultation?: (appointmentId: string) => Promise<void>;
  stats?: {
    completedTreatments: number;
    averageTreatmentTime: string;
    completedConsultations: number;
    averageConsultationTime: string;
    pendingRecords: number;
  };
}

export const VeterinarianDashboard: React.FC<VeterinarianDashboardProps> = ({
  appointments: propAppointments,
  patients: propPatients,
  isLoading: propIsLoading,
  onStartConsultation: propOnStartConsultation,
  onCompleteConsultation: propOnCompleteConsultation,
  stats: propStats,
}) => {
  const {
    data: hookAppointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAppointments();
  const {
    data: hookPatients = [],
    isLoading: patientsLoading,
    error: patientsError,
  } = usePatients();
  const {
    data: inventory = [],
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useInventory();

  const appointments = propAppointments ?? hookAppointments;
  const patients = propPatients ?? hookPatients;
  const isLoading =
    propIsLoading !== undefined
      ? propIsLoading
      : appointmentsLoading || patientsLoading || inventoryLoading;

  const today = new Date();

  const waitingRoom = appointments.filter(
    (appointment) => appointment.status === "AANGEMELD"
  );

  const stats = propStats ?? {
    completedTreatments: 5,
    averageTreatmentTime: "45",
    completedConsultations: 0,
    averageConsultationTime: "0",
    pendingRecords: 0,
  };

  const navigate = useNavigate();

  const handleNewConsultation = () => {
    navigate("/consultations/new");
  };

  const handleVaccination = () => {
    navigate("/consultations/vaccination");
  };

  const handleSurgery = () => {
    navigate("/consultations/surgery");
  };

  const handleMedicalRecords = () => {
    navigate("/medical-records");
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

  if (appointmentsError || patientsError || inventoryError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">Fout bij het ophalen van gegevens</p>
        </div>
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
                appointments.filter((a) => {
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

        <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/20 dark:from-[#8B5CF6]/20 dark:to-[#8B5CF6]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wachtkamer</CardTitle>
            <User className="h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B5CF6] dark:text-[#8B5CF6]">
              {waitingRoom.length}
            </div>
            <p className="text-xs text-[#8B5CF6] dark:text-[#8B5CF6]">
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
                inventory.filter((item) => item.quantity <= item.reorderLevel)
                  .length
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
            value="consultations"
            className="data-[state=active]:bg-[#3B82F6]/10 dark:data-[state=active]:bg-[#3B82F6]/20"
          >
            <Stethoscope className="h-4 w-4 mr-2 text-[#3B82F6] dark:text-[#3B82F6]" />
            Consultaties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patiënten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map((patient) => (
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

        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle>Consultaties Vandaag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10"
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
                        className="bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30 text-[#3B82F6] dark:text-[#3B82F6]"
                      >
                        Bekijk Patiënt
                      </Button>
                      {appointment.status === "INGEPLAND" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            propOnStartConsultation?.(appointment.id)
                          }
                          className="bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30 text-[#3B82F6] dark:text-[#3B82F6]"
                        >
                          Start Consultatie
                        </Button>
                      )}
                      {appointment.status === "IN_BEHANDELING" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            propOnCompleteConsultation?.(appointment.id)
                          }
                          className="bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]"
                        >
                          Voltooi Consultatie
                        </Button>
                      )}
                    </div>
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
            <CardTitle>Consultatiestatistieken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Voltooide Consultaties
                  </span>
                  <span className="text-sm font-medium">
                    {stats.completedConsultations}
                  </span>
                </div>
                <Progress
                  value={stats.completedConsultations * 10}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#10B981] dark:[&>div]:bg-[#10B981]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Gemiddelde Consultatietijd
                  </span>
                  <span className="text-sm font-medium">
                    {stats.averageConsultationTime} min
                  </span>
                </div>
                <Progress
                  value={parseInt(stats.averageConsultationTime) * 2}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#3B82F6] dark:[&>div]:bg-[#3B82F6]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Openstaande Dossiers
                  </span>
                  <span className="text-sm font-medium">
                    {stats.pendingRecords}
                  </span>
                </div>
                <Progress
                  value={stats.pendingRecords * 10}
                  className="h-2 bg-gray-100 dark:bg-gray-800 [&>div]:bg-[#8B5CF6] dark:[&>div]:bg-[#8B5CF6]"
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
                className="w-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30"
                variant="outline"
                onClick={handleNewConsultation}
              >
                <Stethoscope className="mr-2 h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
                Nieuwe Consultatie
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
                onClick={handleSurgery}
              >
                <Activity className="mr-2 h-4 w-4 text-[#8B5CF6] dark:text-[#8B5CF6]" />
                Operatie
              </Button>
              <Button
                className="w-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30"
                variant="outline"
                onClick={handleMedicalRecords}
              >
                <FileText className="mr-2 h-4 w-4 text-[#3B82F6] dark:text-[#3B82F6]" />
                Medische Dossiers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
