import { useParams } from "react-router-dom";
import { ClientDetails } from "@/features/clients/ClientDetails";

export function ClientDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Klant Details</h1>
      {id && <ClientDetails clientId={id} />}
    </div>
  );
}
