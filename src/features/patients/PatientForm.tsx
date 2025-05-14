import { useNavigate } from "react-router-dom";
import { useCreatePatient, useUpdatePatient } from "@/lib/hooks/useApi";
import { Button } from "@/features/ui/components/button";
import { Input } from "@/features/ui/components/input";
import { Label } from "@/features/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/ui/components/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription } from "@/features/ui/components/alert";
import { Loader2 } from "lucide-react";
import type { Patient } from "@/lib/api/types";

const patientSchema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  species: z.enum([
    "HOND",
    "KAT",
    "VOGEL",
    "REPTIEL",
    "KLEIN_ZOOGDIER",
    "ANDERS",
  ]),
  breed: z.string().min(1, "Ras is verplicht"),
  gender: z.enum(["mannelijk", "vrouwelijk", "onbekend"]),
  age: z.number().min(0, "Leeftijd moet positief zijn"),
  weight: z.number().min(0, "Gewicht moet positief zijn"),
  microchipNumber: z.string().optional(),
  color: z.string().optional(),
  clientId: z.string().min(1, "Eigenaar is verplicht"),
  dateOfBirth: z.string().min(1, "Geboortedatum is verplicht"),
  status: z.enum(["ACTIVE", "INACTIVE", "UNDER_CARE", "DECEASED"]),
  needsVitalsCheck: z.boolean(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  onSubmit?: (data: PatientFormData) => Promise<void>;
  isLoading?: boolean;
  error?: Error;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSubmit: propOnSubmit,
  isLoading: propIsLoading,
  error: propError,
}) => {
  const navigate = useNavigate();
  const { mutateAsync: createPatient } = useCreatePatient();
  const { mutateAsync: updatePatient } = useUpdatePatient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient
      ? {
          ...patient,
          dateOfBirth: patient.dateOfBirth,
          status: patient.status,
          needsVitalsCheck: patient.needsVitalsCheck,
          clientId: patient.clientId,
        }
      : {
          status: "ACTIVE",
          needsVitalsCheck: false,
          clientId: "1", // TODO: Get from auth context
        },
  });

  const isLoading = propIsLoading;
  const error = propError;

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (propOnSubmit) {
        await propOnSubmit(data);
      } else if (patient) {
        await updatePatient({ id: patient.id, data });
      } else {
        const now = new Date().toISOString();
        await createPatient({
          ...data,
          createdAt: now,
          updatedAt: now,
          registrationDate: now,
          lastVisit: now,
        });
      }
      navigate("/patients");
    } catch (error) {
      console.error("Error saving patient:", error);
      throw new Error("Opslaan mislukt");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {patient ? "Patiënt Bewerken" : "Nieuwe Patiënt"}
        </h1>
        <Button variant="outline" onClick={() => navigate("/patients")}>
          Terug
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Naam</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Naam van de patiënt"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Soort</Label>
            <Select
              defaultValue={patient?.species}
              onValueChange={(value) =>
                register("species").onChange({ target: { value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer soort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOND">Hond</SelectItem>
                <SelectItem value="KAT">Kat</SelectItem>
                <SelectItem value="VOGEL">Vogel</SelectItem>
                <SelectItem value="REPTIEL">Reptiel</SelectItem>
                <SelectItem value="KLEIN_ZOOGDIER">Klein zoogdier</SelectItem>
                <SelectItem value="ANDERS">Anders</SelectItem>
              </SelectContent>
            </Select>
            {errors.species && (
              <p className="text-sm text-red-500">{errors.species.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Ras</Label>
            <Input
              id="breed"
              {...register("breed")}
              placeholder="Bijv. Labrador, Siamees, etc."
            />
            {errors.breed && (
              <p className="text-sm text-red-500">{errors.breed.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Geslacht</Label>
            <Select
              defaultValue={patient?.gender}
              onValueChange={(value) =>
                register("gender").onChange({ target: { value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer geslacht" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mannelijk">Mannetje</SelectItem>
                <SelectItem value="vrouwelijk">Vrouwtje</SelectItem>
                <SelectItem value="onbekend">Onbekend</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Leeftijd (jaren)</Label>
            <Input
              id="age"
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Gewicht (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...register("weight", { valueAsNumber: true })}
              placeholder="0.0"
            />
            {errors.weight && (
              <p className="text-sm text-red-500">{errors.weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Geboortedatum</Label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchipNumber">Chipnummer (optioneel)</Label>
            <Input
              id="microchipNumber"
              {...register("microchipNumber")}
              placeholder="Chipnummer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Kleur (optioneel)</Label>
            <Input id="color" {...register("color")} placeholder="Kleur" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={patient?.status || "ACTIVE"}
              onValueChange={(value) =>
                register("status").onChange({ target: { value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Actief</SelectItem>
                <SelectItem value="INACTIVE">Inactief</SelectItem>
                <SelectItem value="UNDER_CARE">Onder behandeling</SelectItem>
                <SelectItem value="DECEASED">Overleden</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/patients")}
          >
            Annuleren
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {patient ? "Opslaan" : "Toevoegen"}
          </Button>
        </div>
      </form>
    </div>
  );
};
