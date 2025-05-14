import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "@/lib/hooks/useApi";
import { DataTable } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format, isValid } from "date-fns";
import type { Client } from "@/lib/api/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export const ClientList = () => {
  const navigate = useNavigate();
  const { data: clients, isLoading, error } = useClients();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Klanten laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Fout bij het laden van klanten: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const filteredClients = (clients || []).filter(
    (client) =>
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "N/A";
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }: { row: { original: Client } }) =>
        `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: ({ row }: { row: { original: Client } }) =>
        row.original.address
          ? `${row.original.address.street}, ${row.original.address.city}, ${row.original.address.state} ${row.original.address.postalCode}`
          : "No address provided",
    },
    {
      header: "Member Since",
      accessorKey: "createdAt",
      cell: ({ row }: { row: { original: Client } }) =>
        formatDate(row.original.createdAt),
    },
    {
      header: "Last Visit",
      accessorKey: "lastVisit",
      cell: ({ row }: { row: { original: Client } }) =>
        formatDate(row.original.lastVisit),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Klanten</h1>
        <Button onClick={() => navigate("/clients/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Klant Toevoegen
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Zoek klanten..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={setSearchQuery}
          className="max-w-sm"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Geen klanten gevonden die aan uw zoekcriteria voldoen.
        </div>
      ) : (
        <div className="bg-card rounded-lg border shadow-sm">
          <DataTable
            columns={columns}
            data={filteredClients}
            onRowClick={(row: Client) => navigate(`/clients/${row.id}`)}
          />
        </div>
      )}
    </div>
  );
};
