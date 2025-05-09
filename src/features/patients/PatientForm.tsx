import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { usePatient, useCreatePatient } from "@/lib/hooks/useApi";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";

interface PatientFormData {
  clientId: string;
  name: string;
  species: "DOG" | "CAT" | "BIRD" | "REPTILE" | "SMALL_MAMMAL" | "OTHER";
  breed: string;
  age: number;
  weight: number;
  dateOfBirth: string;
  gender: "male" | "female" | "unknown";
  microchipNumber?: string;
  color?: string;
  allergies?: string[];
  medicalConditions?: string[];
  notes?: string;
}

interface FormErrors {
  clientId?: string;
  name?: string;
  species?: string;
  breed?: string;
  age?: string;
  weight?: string;
  gender?: string;
  dateOfBirth?: string;
  microchipNumber?: string;
  color?: string;
  allergies?: string;
  medicalConditions?: string;
  notes?: string;
}

const initialFormData: PatientFormData = {
  clientId: "",
  name: "",
  species: "DOG",
  breed: "",
  age: 0,
  weight: 0,
  dateOfBirth: "",
  gender: "unknown",
  microchipNumber: "",
  color: "",
  allergies: [],
  medicalConditions: [],
  notes: "",
};

const speciesOptions = [
  { value: "DOG", label: "Dog" },
  { value: "CAT", label: "Cat" },
  { value: "BIRD", label: "Bird" },
  { value: "REPTILE", label: "Reptile" },
  { value: "SMALL_MAMMAL", label: "Small Mammal" },
  { value: "OTHER", label: "Other" },
];

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;
  const defaultClientId = searchParams.get("clientId") || "";
  const { toast } = useToast();

  const {
    data: patient,
    isLoading: isLoadingPatient,
    error: patientError,
  } = usePatient(id || "");
  const createPatient = useCreatePatient();

  const [formData, setFormData] = useState<PatientFormData>({
    ...initialFormData,
    clientId: defaultClientId,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  React.useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        species: patient.species,
        breed: patient.breed,
        age: patient.age,
        weight: patient.weight,
        clientId: patient.clientId,
        dateOfBirth: patient.dateOfBirth
          ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: patient.gender,
        microchipNumber: patient.microchipNumber || "",
        color: patient.color || "",
        allergies: patient.allergies || [],
        medicalConditions: patient.medicalConditions || [],
        notes: patient.notes || "",
      });
    }
  }, [patient]);

  const handleBack = () => {
    navigate(-1);
  };

  const onFinish = async (values: any) => {
    try {
      await createPatient.mutateAsync(values);
      toast({
        title: "Success",
        description: "Patient created successfully",
      });
      navigate("/patients");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create patient",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | {
          name: keyof PatientFormData;
          value: PatientFormData[keyof PatientFormData];
        }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" || name === "weight" ? Number(value) : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isLoadingPatient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading patient data...</span>
      </div>
    );
  }

  if (patientError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading patient: {patientError.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <PageHeader
        title={isEditing ? "Edit Patient" : "Add New Patient"}
        description="Add or update patient information"
      >
        <Button
          variant="outline"
          onClick={() => navigate("/patients")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onFinish} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select
                name="species"
                value={formData.species}
                onValueChange={(value) =>
                  handleChange({ name: "species", value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {speciesOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.species && (
                <p className="text-sm text-red-500">{errors.species}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
              {errors.breed && (
                <p className="text-sm text-red-500">{errors.breed}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min={0}
                step={0.1}
                value={formData.weight}
                onChange={handleChange}
                required
              />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPatient.isPending}>
                {createPatient.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Patient"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export { PatientForm };
