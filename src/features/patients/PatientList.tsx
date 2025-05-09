import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "@/lib/hooks/useApi";
import { DataTable } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import type { Patient } from "@/lib/api/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export const PatientList = () => {
  const navigate = useNavigate();
  const { data: patients = [], isLoading, error } = usePatients();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading patients...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading patients: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
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
      header: "Gender",
      accessorKey: "gender",
      cell: ({ row }: { row: { original: Patient } }) =>
        row.original.gender
          ? row.original.gender.charAt(0).toUpperCase() +
            row.original.gender.slice(1)
          : "Unknown",
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
      cell: ({ row }: { row: { original: Patient } }) => {
        const lastVisit = row.original.lastVisit;
        if (!lastVisit) return "No visits";
        try {
          return format(new Date(lastVisit), "MMM d, yyyy");
        } catch (error) {
          return "Invalid date";
        }
      },
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button onClick={() => navigate("/patients/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={setSearchQuery}
          className="max-w-sm"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No patients found matching your search criteria.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredPatients}
          onRowClick={(row: Patient) => navigate(`/patients/${row.id}`)}
        />
      )}
    </div>
  );
};
