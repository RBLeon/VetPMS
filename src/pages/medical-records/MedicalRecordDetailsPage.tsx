import { useParams } from "react-router-dom";
import { MedicalRecordDetails } from "@/features/medical-records/MedicalRecordDetails";

export function MedicalRecordDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medisch Dossier Details</h1>
      {id && <MedicalRecordDetails recordId={id} />}
    </div>
  );
}
