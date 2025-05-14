import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useClient,
  useClientPatients,
  useDeleteClient,
} from "@/lib/hooks/useApi";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ArrowLeft, Edit, Trash2, Plus, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import type { Patient } from "@/lib/api/types";

const patientColumns = [
  {
    header: "Naam",
    accessorKey: "name",
  },
  {
    header: "Soort",
    accessorKey: "species",
  },
  {
    header: "Ras",
    accessorKey: "breed",
  },
  {
    header: "Leeftijd",
    accessorKey: "age",
    cell: ({ row }: { row: { original: Patient } }) =>
      `${row.original.age} jaar`,
  },
  {
    header: "Gewicht",
    accessorKey: "weight",
    cell: ({ row }: { row: { original: Patient } }) =>
      `${row.original.weight} kg`,
  },
  {
    header: "Laatste Bezoek",
    accessorKey: "lastVisit",
    cell: ({ row }: { row: { original: Patient } }) =>
      format(new Date(row.original.lastVisit), "d MMM yyyy"),
  },
];

interface ClientDetailsProps {
  clientId: string;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ clientId }) => {
  const navigate = useNavigate();
  const { data: client, isLoading: isLoadingClient } = useClient(clientId);
  const { data: patients, isLoading: isLoadingPatients } = useClientPatients(
    clientId || ""
  );
  const deleteClient = useDeleteClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!clientId) return;
    try {
      await deleteClient.mutateAsync(clientId);
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  if (isLoadingClient || isLoadingPatients) {
    return <div>Laden...</div>;
  }

  if (!client) {
    return (
      <div className="p-4">
        <p className="text-red-500">Klant niet gevonden</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        description="Klantgegevens en bijbehorende huisdieren"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/clients")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar Klanten
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/clients/${clientId}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Klant Bewerken
          </Button>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Klant Verwijderen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Klant Verwijderen</AlertDialogTitle>
                <AlertDialogDescription>
                  Weet u zeker dat u deze klant wilt verwijderen? Deze actie kan
                  niet ongedaan worden gemaakt. Alle bijbehorende
                  patiëntendossiers worden ook verwijderd.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Verwijderen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contactgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                E-mail
              </p>
              <p>{client.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Telefoon
              </p>
              <p>{client.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adres</p>
              <p>
                {client.address
                  ? `${client.address.street}, ${client.address.city}, ${client.address.state} ${client.address.postalCode}`
                  : "Geen adres opgegeven"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Voorkeurscommunicatie
              </p>
              <p className="capitalize">{client.preferredCommunication}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Klant Sinds
              </p>
              <p>{format(new Date(client.createdAt), "d MMM yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Laatste Bezoek
              </p>
              <p>{format(new Date(client.lastVisit), "d MMM yyyy")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snelle Acties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full justify-start gap-2"
              onClick={() => navigate(`/patients/new?clientId=${clientId}`)}
            >
              <Plus className="h-4 w-4" />
              Huisdier Toevoegen
            </Button>
            <Button
              className="w-full justify-start gap-2"
              onClick={() => navigate(`/appointments/new?clientId=${clientId}`)}
            >
              <Plus className="h-4 w-4" />
              Afspraak Inplannen
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Huisdieren</CardTitle>
          <Button
            onClick={() => navigate(`/patients/new?clientId=${clientId}`)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Huisdier Toevoegen
          </Button>
        </CardHeader>
        <CardContent>
          {patients && patients.length > 0 ? (
            <div className="bg-card rounded-lg border shadow-sm">
              <DataTable
                columns={patientColumns}
                data={patients}
                onRowClick={(row) => navigate(`/patients/${row.id}`)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">
                Geen huisdieren geregistreerd
              </p>
              <p className="text-sm text-muted-foreground">
                Voeg een nieuw huisdier toe aan deze klant
              </p>
              <Button
                onClick={() => navigate(`/patients/new?clientId=${clientId}`)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Huisdier Toevoegen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
