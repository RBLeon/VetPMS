import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import type {
  Appointment,
  AppointmentType,
  AppointmentStatus,
} from "@/lib/api/types";

const formSchema = z.object({
  type: z.enum([
    "CONTROLE",
    "VACCINATIE",
    "OPERATIE",
    "CONSULT",
    "GEBITSVERZORGING",
    "SPOEDGEVAL",
  ]),
  date: z.string(),
  time: z.string(),
  status: z.enum([
    "INGEPLAND",
    "AANGEMELD",
    "IN_BEHANDELING",
    "VOLTOOID",
    "GEANNULEERD",
    "NIET_VERSCHENEN",
  ]),
  patientId: z.string(),
  clientId: z.string(),
  providerId: z.string(),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringPattern: z
    .object({
      frequency: z.enum(["DAGELIJKS", "WEKELIJKS", "MAANDELIJKS", "JAARLIJKS"]),
      interval: z.number(),
      endDate: z.string().optional(),
    })
    .optional(),
  reminder: z
    .object({
      type: z.enum(["EMAIL", "SMS", "PUSH"]),
      time: z.enum(["15m", "30m", "1u", "24u", "48u"]),
    })
    .optional(),
});

type AppointmentFormData = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  initialData?: Partial<Appointment>;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "CONTROLE",
      status: "INGEPLAND",
      isRecurring: false,
      ...initialData,
    },
  });

  const handleSubmit = (data: AppointmentFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type Afspraak</Label>
        <Select
          value={form.watch("type")}
          onValueChange={(value: AppointmentType) =>
            form.setValue("type", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecteer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONTROLE">Controle</SelectItem>
            <SelectItem value="VACCINATIE">Vaccinatie</SelectItem>
            <SelectItem value="OPERATIE">Operatie</SelectItem>
            <SelectItem value="CONSULT">Consult</SelectItem>
            <SelectItem value="GEBITSVERZORGING">Gebitsverzorging</SelectItem>
            <SelectItem value="SPOEDGEVAL">Spoedgeval</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Datum</Label>
        <Input type="date" {...form.register("date")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Tijd</Label>
        <Input type="time" {...form.register("time")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={form.watch("status")}
          onValueChange={(value: AppointmentStatus) =>
            form.setValue("status", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecteer status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INGEPLAND">Ingepland</SelectItem>
            <SelectItem value="AANGEMELD">Aangemeld</SelectItem>
            <SelectItem value="IN_BEHANDELING">In behandeling</SelectItem>
            <SelectItem value="VOLTOOID">Voltooid</SelectItem>
            <SelectItem value="GEANNULEERD">Geannuleerd</SelectItem>
            <SelectItem value="NIET_VERSCHENEN">Niet verschenen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notities</Label>
        <Input {...form.register("notes")} placeholder="Voer notities in" />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit">Opslaan</Button>
      </div>
    </form>
  );
};
