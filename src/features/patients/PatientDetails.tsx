import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePatient } from "@/lib/hooks/useApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/ui/components/card";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/features/ui/components/alert";
import type { Patient } from "@/lib/api/types";
import { PageHeader } from "@/features/ui/components/page-header";
import { Button } from "@/features/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { MedicalRecordsList } from "@/features/medical-records/components/MedicalRecordsList";

interface PatientDetailsProps {
  patient?: Patient;
  isLoading?: boolean;
  error?: Error;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient: propPatient,
  isLoading: propIsLoading,
  error: propError,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    data: hookPatient,
    isLoading: hookIsLoading,
    error: hookError,
  } = usePatient(id || "");

  const patient = propPatient || hookPatient;
  const isLoading = propIsLoading || hookIsLoading;
  const error = propError || hookError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Fout bij het laden van patiënt: Laden mislukt
        </AlertDescription>
      </Alert>
    );
  }

  if (!patient) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Patiënt niet gevonden</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={patient.name}
        description="Bekijk en beheer patiëntgegevens"
      >
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/patients")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar Patiënten
          </Button>
          <Button onClick={() => navigate(`/patients/${patient.id}/edit`)}>
            Bewerken
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patiëntgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Soort</h3>
              <p>{patient.species}</p>
            </div>
            <div>
              <h3 className="font-semibold">Ras</h3>
              <p>{patient.breed}</p>
            </div>
            <div>
              <h3 className="font-semibold">Geslacht</h3>
              <p>
                {patient.gender
                  ? patient.gender.charAt(0).toUpperCase() +
                    patient.gender.slice(1)
                  : "Onbekend"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Leeftijd</h3>
              <p>{patient.age} jaar</p>
            </div>
            <div>
              <h3 className="font-semibold">Gewicht</h3>
              <p>{patient.weight} kg</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laatste Bezoek</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.lastVisit ? (
              <p>{format(new Date(patient.lastVisit), "d MMMM yyyy")}</p>
            ) : (
              <p>Geen bezoeken geregistreerd</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medische Dossiers</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicalRecordsList patientId={patient.id} />
        </CardContent>
      </Card>
    </div>
  );
};
