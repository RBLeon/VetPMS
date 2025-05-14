import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/features/ui/components/card";
import { Button } from "@/features/ui/components/button";
import { Input } from "@/features/ui/components/input";
import { Label } from "@/features/ui/components/label";
import { Textarea } from "@/features/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/ui/components/select";
import { useCreateMedicalRecord } from "@/lib/hooks/useApi";
import { MedicalRecord } from "@/lib/api/types";
import { Loader2 } from "lucide-react";

const medicalRecordSchema = z.object({
  type: z.string().min(1, "Type is verplicht"),
  date: z.string().min(1, "Datum is verplicht"),
  chiefComplaint: z.string().min(1, "Hoofdklacht is verplicht"),
  diagnosis: z.string().min(1, "Diagnose is verplicht"),
  treatment: z.string().min(1, "Behandeling is verplicht"),
  notes: z.string().optional(),
  status: z.enum(["ACTIEF", "OPGELOST", "IN_AFWACHTING", "GEANNULEERD"]),
  veterinarianId: z.string().min(1),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

interface MedicalRecordFormProps {
  patientId: string;
  defaultValues?: Partial<MedicalRecord>;
}

export const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  patientId,
  defaultValues,
}) => {
  const navigate = useNavigate();
  const { mutate: createMedicalRecord, isPending } = useCreateMedicalRecord();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      veterinarianId: "1", // TODO: Get from auth context
      type: defaultValues?.type || "",
      status: defaultValues?.status || "ACTIEF",
      ...defaultValues,
    },
  });

  const onSubmit = (data: MedicalRecordFormData) => {
    const now = new Date().toISOString();
    createMedicalRecord(
      {
        ...data,
        patientId,
        patientName: "", // This should be fetched from the patient data
        veterinarianName: "", // This should be fetched from the veterinarian data
        createdAt: now,
        updatedAt: now,
        followUpDate: "",
        vitalSigns: "",
        followUpNotes: "",
        treatments: [],
        prescriptions: [],
        attachments: [],
      },
      {
        onSuccess: () => {
          navigate(`/patients/${patientId}/records`);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Nieuw Medisch Dossier</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("veterinarianId")} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    data-testid="type-select"
                  >
                    <SelectTrigger
                      id="type"
                      aria-label="Type"
                      data-testid="type-trigger"
                    >
                      <SelectValue placeholder="Selecteer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONSULTATIE">Consultatie</SelectItem>
                      <SelectItem value="BEHANDELING">Behandeling</SelectItem>
                      <SelectItem value="OPERATIE">Operatie</SelectItem>
                      <SelectItem value="CONTROLE">Controle</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p
                  className="text-sm text-red-500 mt-1"
                  data-testid="error-type"
                >
                  {errors.type.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                aria-invalid={errors.date ? "true" : "false"}
              />
              {errors.date && (
                <p
                  className="text-sm text-red-500 mt-1"
                  data-testid="error-date"
                >
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="chiefComplaint">Hoofdklacht</Label>
            <Input
              id="chiefComplaint"
              {...register("chiefComplaint")}
              aria-invalid={errors.chiefComplaint ? "true" : "false"}
            />
            {errors.chiefComplaint && (
              <p
                className="text-sm text-red-500 mt-1"
                data-testid="error-chiefComplaint"
              >
                {errors.chiefComplaint.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="diagnosis">Diagnose</Label>
            <Textarea
              id="diagnosis"
              {...register("diagnosis")}
              aria-invalid={errors.diagnosis ? "true" : "false"}
              data-testid="diagnosis-textarea"
            />
            {errors.diagnosis && (
              <p
                className="text-sm text-red-500 mt-1"
                data-testid="error-diagnosis"
              >
                {errors.diagnosis.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="treatment">Behandeling</Label>
            <Textarea
              id="treatment"
              {...register("treatment")}
              aria-invalid={errors.treatment ? "true" : "false"}
              data-testid="treatment-textarea"
            />
            {errors.treatment && (
              <p
                className="text-sm text-red-500 mt-1"
                data-testid="error-treatment"
              >
                {errors.treatment.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="notes">Notities</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              aria-invalid={errors.notes ? "true" : "false"}
              data-testid="notes-textarea"
            />
            {errors.notes && (
              <p
                className="text-sm text-red-500 mt-1"
                data-testid="error-notes"
              >
                {errors.notes.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  data-testid="status-select"
                >
                  <SelectTrigger
                    id="status"
                    aria-label="Status"
                    data-testid="status-trigger"
                  >
                    <SelectValue placeholder="Selecteer status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIEF">Actief</SelectItem>
                    <SelectItem value="OPGELOST">Opgelost</SelectItem>
                    <SelectItem value="IN_AFWACHTING">In afwachting</SelectItem>
                    <SelectItem value="GEANNULEERD">Geannuleerd</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p
                className="text-sm text-red-500 mt-1"
                data-testid="error-status"
              >
                {errors.status.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/patients/${patientId}/records`)}
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Opslaan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
