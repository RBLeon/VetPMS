import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Species",
    accessorKey: "species",
  },
  {
    header: "Breed",
    accessorKey: "breed",
  },
  {
    header: "Age",
    accessorKey: "age",
    cell: ({ row }: { row: { original: Patient } }) =>
      `${row.original.age} years`,
  },
  {
    header: "Weight",
    accessorKey: "weight",
    cell: ({ row }: { row: { original: Patient } }) =>
      `${row.original.weight} kg`,
  },
  {
    header: "Last Visit",
    accessorKey: "lastVisit",
    cell: ({ row }: { row: { original: Patient } }) =>
      format(new Date(row.original.lastVisit), "MMM d, yyyy"),
  },
];

export function ClientDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading: isLoadingClient } = useClient(id || "");
  const { data: patients, isLoading: isLoadingPatients } = useClientPatients(
    id || ""
  );
  const deleteClient = useDeleteClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteClient.mutateAsync(id);
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  if (isLoadingClient || isLoadingPatients) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return (
      <div className="p-4">
        <p className="text-red-500">Client not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        description="Client details and associated pets"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/clients")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/clients/${id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Client
          </Button>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Client
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this client? This action
                  cannot be undone. All associated patient records will also be
                  deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{client.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{client.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p>
                {client.address
                  ? `${client.address.street}, ${client.address.city}, ${client.address.state} ${client.address.postalCode}`
                  : "No address provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Preferred Communication
              </p>
              <p className="capitalize">{client.preferredCommunication}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Client Since
              </p>
              <p>{format(new Date(client.createdAt), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Visit
              </p>
              <p>{format(new Date(client.lastVisit), "MMM d, yyyy")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full justify-start gap-2"
              onClick={() => navigate(`/patients/new?clientId=${id}`)}
            >
              <Plus className="h-4 w-4" />
              Add New Pet
            </Button>
            <Button
              className="w-full justify-start gap-2"
              onClick={() => navigate(`/appointments/new?clientId=${id}`)}
            >
              <Plus className="h-4 w-4" />
              Schedule Appointment
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pets</CardTitle>
          <Button
            onClick={() => navigate(`/patients/new?clientId=${id}`)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Pet
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
              <p className="text-lg font-medium">No pets registered</p>
              <p className="text-sm text-muted-foreground">
                Add a new pet to this client's record
              </p>
              <Button
                onClick={() => navigate(`/patients/new?clientId=${id}`)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Pet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
