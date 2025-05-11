import { useParams } from "react-router-dom";
import { PatientDetails } from "@/features/patients/PatientDetails";

export function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patiënt Details</h1>
      {id && <PatientDetails />}
    </div>
  );
}
