import { useParams } from "react-router-dom";

export function MedicalRecordDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medisch Dossier Details</h1>
      <p>Medisch dossier details pagina in ontwikkeling...</p>
      <p>Dossier ID: {id}</p>
    </div>
  );
}
