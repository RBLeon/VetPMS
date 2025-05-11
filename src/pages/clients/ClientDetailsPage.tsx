import { useParams } from "react-router-dom";

export function ClientDetailsPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Klant Details</h1>
      <p>Klant details pagina in ontwikkeling...</p>
      <p>Klant ID: {id}</p>
    </div>
  );
}
