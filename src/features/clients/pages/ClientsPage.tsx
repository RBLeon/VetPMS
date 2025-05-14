import { ClientList } from "@/features/clients/ClientList";

export function ClientsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Klanten</h1>
      <ClientList />
    </div>
  );
}
