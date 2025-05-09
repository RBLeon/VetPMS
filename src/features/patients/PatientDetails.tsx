import { useParams, useNavigate } from "react-router-dom";
import { usePatient } from "@/lib/hooks/useApi";
import { Card, Descriptions } from "antd";
import { MedicalRecordsList } from "@/components/medical-records/MedicalRecordsList";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading, error } = usePatient(id || "");

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading patient details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading patient: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!patient) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Patient not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <PageHeader
        title={patient?.name || "Patient Details"}
        description="View and manage patient information"
      >
        <Button
          variant="outline"
          onClick={() => navigate("/patients")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>
      </PageHeader>

      <Card title="Patient Information">
        <Descriptions bordered>
          <Descriptions.Item label="Name">{patient.name}</Descriptions.Item>
          <Descriptions.Item label="Species">
            {patient.species}
          </Descriptions.Item>
          <Descriptions.Item label="Breed">{patient.breed}</Descriptions.Item>
          <Descriptions.Item label="Age">{patient.age}</Descriptions.Item>
          <Descriptions.Item label="Weight">
            {patient.weight} kg
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
          </Descriptions.Item>
          {patient.microchipNumber && (
            <Descriptions.Item label="Microchip Number">
              {patient.microchipNumber}
            </Descriptions.Item>
          )}
          {patient.color && (
            <Descriptions.Item label="Color">{patient.color}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="Medical Records">
        <MedicalRecordsList patientId={patient.id} />
      </Card>
    </div>
  );
};
