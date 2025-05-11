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

interface PatientListProps {
  patients?: Patient[];
  isLoading?: boolean;
  error?: Error;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients: propPatients,
  isLoading: propIsLoading,
  error: propError,
}) => {
  const navigate = useNavigate();
  const {
    data: hookPatients = [],
    isLoading: hookIsLoading = false,
    error: hookError = undefined,
  } = usePatients() || {};
  const [searchQuery, setSearchQuery] = useState("");

  const patients = propPatients || hookPatients;
  const isLoading = propIsLoading || hookIsLoading;
  const error = propError || hookError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Laden...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Fout bij het laden van patiënten: {error.message}
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
      header: "Geslacht",
      accessorKey: "gender",
      cell: ({ row }: { row: { original: Patient } }) =>
        row.original.gender
          ? row.original.gender.charAt(0).toUpperCase() +
            row.original.gender.slice(1)
          : "Onbekend",
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
      cell: ({ row }: { row: { original: Patient } }) => {
        const lastVisit = row.original.lastVisit;
        if (!lastVisit) return "Geen bezoeken";
        try {
          return format(new Date(lastVisit), "d MMM yyyy");
        } catch (error) {
          return "Ongeldige datum";
        }
      },
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patiënten</h1>
        <Button onClick={() => navigate("/patients/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Patiënt Toevoegen
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Zoek patiënten..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={setSearchQuery}
          className="max-w-sm"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Geen patiënten gevonden die aan uw zoekcriteria voldoen.
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
