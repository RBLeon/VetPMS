import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/features/ui/components/button";
import { Input } from "@/features/ui/components/input";
import { Label } from "@/features/ui/components/label";
import { Textarea } from "@/features/ui/components/textarea";
import { Prescription } from "@/lib/api/types";

const prescriptionSchema = z.object({
  medication: z.string().min(1, "Medicijnnaam is verplicht"),
  dosage: z.string().min(1, "Dosering is verplicht"),
  frequency: z.string().min(1, "Frequentie is verplicht"),
  duration: z.string().min(1, "Duur is verplicht"),
  notes: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface PrescriptionFormProps {
  prescriptionId?: string;
  onAdd: (prescription: Prescription) => void;
  onRemove?: () => void;
  isSubmitting?: boolean;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescriptionId,
  onAdd,
  onRemove,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      frequency: "DAILY",
    },
  });

  const onSubmit = (data: PrescriptionFormData) => {
    const prescription: Prescription = {
      id: prescriptionId || "",
      medicationName: data.medication,
      dosage: data.dosage,
      frequency: data.frequency,
      duration: data.duration,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      prescribedBy: "1", // This will be populated by the backend
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAdd(prescription);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medication">Medicijn</Label>
          <Input
            id="medication"
            {...register("medication")}
            error={errors.medication?.message}
          />
        </div>
        <div>
          <Label htmlFor="dosage">Dosering</Label>
          <Input
            id="dosage"
            {...register("dosage")}
            error={errors.dosage?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="frequency">Frequentie</Label>
          <Input
            id="frequency"
            {...register("frequency")}
            error={errors.frequency?.message}
          />
        </div>
        <div>
          <Label htmlFor="duration">Duur</Label>
          <Input
            id="duration"
            {...register("duration")}
            error={errors.duration?.message}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notities</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          error={errors.notes?.message}
        />
      </div>

      <div className="flex justify-end space-x-4">
        {onRemove && (
          <Button
            type="button"
            variant="destructive"
            onClick={onRemove}
            disabled={isSubmitting}
          >
            Verwijderen
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Opslaan..." : "Voorschrift Toevoegen"}
        </Button>
      </div>
    </form>
  );
};
