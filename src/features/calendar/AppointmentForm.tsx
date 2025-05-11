import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AppointmentType,
  RecurringFrequency,
  Appointment,
} from "@/lib/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

const appointmentTypeLabels: Record<AppointmentType, string> = {
  CONTROLE: "Controle",
  VACCINATIE: "Vaccinatie",
  OPERATIE: "Operatie",
  CONSULT: "Consult",
  GEBITSVERZORGING: "Gebitsverzorging",
  SPOEDGEVAL: "Spoedgeval",
};

const recurringFrequencies: { value: RecurringFrequency; label: string }[] = [
  { value: "DAGELIJKS", label: "Dagelijks" },
  { value: "WEKELIJKS", label: "Wekelijks" },
  { value: "MAANDELIJKS", label: "Maandelijks" },
  { value: "JAARLIJKS", label: "Jaarlijks" },
];

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "CONTROLE",
      status: "INGEPLAND",
      isRecurring: false,
      ...initialData,
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-4">
      <PageHeader
        title={id ? "Afspraak Bewerken" : "Nieuwe Afspraak"}
        description="Plan een nieuwe afspraak of bewerk een bestaande"
      >
        <Button
          variant="outline"
          onClick={() => navigate("/appointments")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar Afspraken
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Afspraakgegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Datum</Label>
                <Input type="date" id="date" {...form.register("date")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Tijd</Label>
                <Input type="time" id="time" {...form.register("time")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type Afspraak</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("type", value as AppointmentType)
                }
                defaultValue={form.getValues("type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(appointmentTypeLabels).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notities</Label>
              <Textarea id="notes" {...form.register("notes")} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isRecurring"
                checked={form.watch("isRecurring")}
                onCheckedChange={(checked) =>
                  form.setValue("isRecurring", checked)
                }
              />
              <Label htmlFor="isRecurring">Terugkerende afspraak</Label>
            </div>

            {form.watch("isRecurring") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequentie</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue(
                        "recurringPattern.frequency",
                        value as RecurringFrequency
                      )
                    }
                    defaultValue={form.getValues("recurringPattern.frequency")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer frequentie" />
                    </SelectTrigger>
                    <SelectContent>
                      {recurringFrequencies.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Einddatum</Label>
                  <Input
                    type="date"
                    id="endDate"
                    {...form.register("recurringPattern.endDate")}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuleren
              </Button>
              <Button type="submit">{id ? "Bewerken" : "Aanmaken"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
