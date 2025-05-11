import { useParams } from "react-router-dom";

export function AppointmentDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Afspraak Details</h1>
      <p>Afspraak details pagina in ontwikkeling...</p>
      <p>Afspraak ID: {id}</p>
    </div>
  );
}
