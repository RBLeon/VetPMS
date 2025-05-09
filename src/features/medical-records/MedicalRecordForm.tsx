import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCreateMedicalRecord,
  useUpdateMedicalRecord,
} from "@/lib/hooks/useApi";
import { MedicalRecord, Prescription, Attachment } from "@/lib/api/types";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface MedicalRecordFormProps {
  patientId: string;
  record?: MedicalRecord;
  onSuccess?: () => void;
}

interface MedicalRecordFormData {
  type: string;
  notes: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan?: string;
  vitalSigns?: {
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
    bloodPressure?: string;
    weight?: number;
  };
  prescriptions?: Prescription[];
  attachments?: Attachment[];
  followUpDate?: string;
  followUpNotes?: string;
}

export const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  patientId,
  record,
  onSuccess,
}) => {
  const { toast } = useToast();
  const createRecord = useCreateMedicalRecord();
  const updateRecord = useUpdateMedicalRecord();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MedicalRecordFormData>({
    defaultValues: record
      ? {
          type: record.type,
          notes: record.notes,
          chiefComplaint: record.chiefComplaint,
          diagnosis: record.diagnosis,
          treatmentPlan: record.treatmentPlan,
          vitalSigns: record.vitalSigns,
          prescriptions: record.prescriptions,
          attachments: record.attachments,
          followUpDate: record.followUpDate,
          followUpNotes: record.followUpNotes,
        }
      : {
          type: "",
          notes: "",
          chiefComplaint: "",
          diagnosis: "",
          treatmentPlan: "",
          vitalSigns: undefined,
          prescriptions: [],
          attachments: [],
          followUpDate: "",
          followUpNotes: "",
        },
  });

  const onSubmit = async (formData: MedicalRecordFormData) => {
    try {
      setIsSubmitting(true);
      const now = new Date().toISOString();
      const recordData: Omit<MedicalRecord, "id"> = {
        ...formData,
        patientId,
        date: format(new Date(), "yyyy-MM-dd"),
        veterinarianId: "1", // TODO: Get from auth context
        status: "ACTIVE",
        hasAttachments: (formData.attachments?.length ?? 0) > 0,
        followUpScheduled: !!formData.followUpDate,
        createdAt: now,
        updatedAt: now,
      };

      if (record) {
        await updateRecord.mutateAsync({
          id: record.id,
          data: recordData,
        });
      } else {
        await createRecord.mutateAsync(recordData);
      }
      toast({
        title: "Success",
        description: `Medical record ${
          record ? "updated" : "created"
        } successfully.`,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          record ? "update" : "create"
        } medical record.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>
            {record ? "Edit Medical Record" : "New Medical Record"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              {...register("type", { required: "Type is required" })}
              placeholder="e.g., Check-up, Surgery, Vaccination"
            />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint</Label>
            <Textarea
              id="chiefComplaint"
              {...register("chiefComplaint", {
                required: "Chief complaint is required",
              })}
              placeholder="Enter the main reason for visit"
            />
            {errors.chiefComplaint && (
              <p className="text-sm text-red-500">
                {errors.chiefComplaint.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              {...register("diagnosis", { required: "Diagnosis is required" })}
              placeholder="Enter the diagnosis"
            />
            {errors.diagnosis && (
              <p className="text-sm text-red-500">{errors.diagnosis.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatmentPlan">Treatment Plan</Label>
            <Textarea
              id="treatmentPlan"
              {...register("treatmentPlan", {
                required: "Treatment plan is required",
              })}
              placeholder="Enter the treatment plan"
            />
            {errors.treatmentPlan && (
              <p className="text-sm text-red-500">
                {errors.treatmentPlan.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vitalSigns">Vital Signs</Label>
            <Textarea
              id="vitalSigns"
              {...register("vitalSigns")}
              placeholder="Enter vital signs (temperature, heart rate, etc.)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prescriptions">Prescriptions</Label>
            <Textarea
              id="prescriptions"
              {...register("prescriptions")}
              placeholder="Enter prescriptions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Enter any additional notes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input
              type="date"
              id="followUpDate"
              {...register("followUpDate")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpNotes">Follow-up Notes</Label>
            <Textarea
              id="followUpNotes"
              {...register("followUpNotes")}
              placeholder="Enter follow-up instructions"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{record ? "Update" : "Create"} Record</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
