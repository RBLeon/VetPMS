import { useParams } from "react-router-dom";

export function PatientDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patiënt Details</h1>
      <p>Patiënt details pagina in ontwikkeling...</p>
      <p>Patiënt ID: {id}</p>
    </div>
  );
}
