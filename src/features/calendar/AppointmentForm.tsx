import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  useAppointment,
  useCreateAppointment,
  useUpdateAppointment,
  usePatients,
  useClients,
} from "@/lib/hooks/useApi";
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
import { toast } from "sonner";
import {
  AppointmentType,
  AppointmentStatus,
  RecurringFrequency,
  ReminderType,
  ReminderTime,
} from "@/lib/api/types";
import { Client } from "@/lib/api/types";

interface AppointmentFormData {
  patientId: string;
  clientId: string;
  providerId: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: RecurringFrequency;
    interval: number;
    endDate: string;
  };
  reminder?: {
    type: ReminderType;
    time: ReminderTime;
  };
}

interface AppointmentFormErrors {
  patientId?: string;
  clientId?: string;
  date?: string;
  time?: string;
  type?: string;
  status?: string;
  recurringPattern?: {
    endDate?: string;
  };
}

const initialFormData: AppointmentFormData = {
  patientId: "",
  clientId: "",
  providerId: "",
  date: "",
  time: "",
  type: "CHECK_UP",
  status: "SCHEDULED",
  notes: "",
  isRecurring: false,
};

const appointmentTypes: AppointmentType[] = [
  "CHECK_UP",
  "VACCINATION",
  "SURGERY",
  "CONSULTATION",
  "DENTAL",
  "EMERGENCY",
];

const appointmentStatuses: AppointmentStatus[] = [
  "SCHEDULED",
  "CHECKED_IN",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
  "NO_SHOW",
];

const recurringFrequencies: { value: RecurringFrequency; label: string }[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

const reminderTypes: { value: ReminderType; label: string }[] = [
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
  { value: "PUSH", label: "Push Notification" },
];

const reminderTimes: { value: ReminderTime; label: string }[] = [
  { value: "15m", label: "15 minutes before" },
  { value: "30m", label: "30 minutes before" },
  { value: "1h", label: "1 hour before" },
  { value: "24h", label: "24 hours before" },
  { value: "48h", label: "48 hours before" },
];

export function AppointmentForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;
  const defaultPatientId = searchParams.get("patientId") || "";
  const defaultClientId = searchParams.get("clientId") || "";

  const { data: appointment, isLoading: isLoadingAppointment } = useAppointment(
    id || ""
  );
  const { data: patients } = usePatients();
  const { data: clients } = useClients();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const [formData, setFormData] = React.useState<AppointmentFormData>({
    ...initialFormData,
    patientId: defaultPatientId,
    clientId: defaultClientId,
  });
  const [errors, setErrors] = React.useState<AppointmentFormErrors>({});

  React.useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        clientId: appointment.clientId,
        providerId: appointment.providerId,
        date: appointment.date,
        time: appointment.time,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes,
        isRecurring: appointment.isRecurring || false,
        recurringPattern: appointment.recurringPattern
          ? {
              frequency: appointment.recurringPattern
                .frequency as RecurringFrequency,
              interval: appointment.recurringPattern.interval,
              endDate: appointment.recurringPattern.endDate || "",
            }
          : undefined,
        reminder: appointment.reminder
          ? {
              type: appointment.reminder.type as ReminderType,
              time: appointment.reminder.time as ReminderTime,
            }
          : undefined,
      });
    }
  }, [appointment]);

  const validateForm = () => {
    const newErrors: AppointmentFormErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = "Patient is required";
    }

    if (!formData.clientId) {
      newErrors.clientId = "Client is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    if (formData.isRecurring && !formData.recurringPattern?.endDate) {
      newErrors.recurringPattern = {
        endDate: "End date is required for recurring appointments",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const now = new Date().toISOString();
      const startTime = new Date(`${formData.date}T${formData.time}`);
      const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes duration

      const appointmentData = {
        ...formData,
        startTime,
        endTime,
        createdAt: isEditing ? appointment?.createdAt || now : now,
        updatedAt: now,
        reminder: formData.reminder
          ? {
              type: formData.reminder.type,
              time: formData.reminder.time,
            }
          : undefined,
      };

      if (isEditing && id) {
        await updateAppointment.mutateAsync({ id, data: appointmentData });
        toast.success("Appointment updated successfully");
      } else {
        await createAppointment.mutateAsync(appointmentData);
        toast.success("Appointment created successfully");
      }
      navigate("/calendar");
    } catch (error) {
      toast.error("Failed to save appointment");
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: keyof AppointmentFormData; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is modified
    if (errors[name as keyof AppointmentFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const getClientDisplayName = (client: Client) => {
    return `${client.firstName} ${client.lastName}`;
  };

  if (isLoadingAppointment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Appointment" : "Schedule Appointment"}
        description={
          isEditing ? "Update appointment details" : "Create a new appointment"
        }
      >
        <Button
          variant="outline"
          onClick={() => navigate("/calendar")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calendar
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    handleChange({ name: "clientId", value })
                  }
                >
                  <SelectTrigger
                    className={errors.clientId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {getClientDisplayName(client)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && (
                  <p className="text-sm text-red-500">{errors.clientId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) =>
                    handleChange({ name: "patientId", value })
                  }
                >
                  <SelectTrigger
                    className={errors.patientId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patientId && (
                  <p className="text-sm text-red-500">{errors.patientId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={errors.time ? "border-red-500" : ""}
                />
                {errors.time && (
                  <p className="text-sm text-red-500">{errors.time}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleChange({ name: "type", value })
                  }
                >
                  <SelectTrigger
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleChange({ name: "status", value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recurring Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recurring Appointment</Label>
                  <p className="text-sm text-muted-foreground">
                    Schedule this appointment to repeat
                  </p>
                </div>
                <Switch
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isRecurring: checked,
                      recurringPattern: checked
                        ? {
                            frequency: "WEEKLY",
                            interval: 1,
                            endDate: "",
                          }
                        : undefined,
                    }))
                  }
                />
              </div>

              {formData.isRecurring && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={formData.recurringPattern?.frequency}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurringPattern: {
                            ...prev.recurringPattern!,
                            frequency: value as RecurringFrequency,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {recurringFrequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interval">Interval</Label>
                    <Input
                      id="interval"
                      type="number"
                      min={1}
                      value={formData.recurringPattern?.interval}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurringPattern: {
                            ...prev.recurringPattern!,
                            interval: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.recurringPattern?.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurringPattern: {
                            ...prev.recurringPattern!,
                            endDate: e.target.value,
                          },
                        }))
                      }
                      className={
                        errors.recurringPattern?.endDate ? "border-red-500" : ""
                      }
                    />
                    {errors.recurringPattern?.endDate && (
                      <p className="text-sm text-red-500">
                        {errors.recurringPattern.endDate}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reminder</Label>
                  <p className="text-sm text-muted-foreground">
                    Set up a reminder for this appointment
                  </p>
                </div>
                <Switch
                  checked={!!formData.reminder}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      reminder: checked
                        ? {
                            type: "EMAIL",
                            time: "24h",
                          }
                        : undefined,
                    }))
                  }
                />
              </div>

              {formData.reminder && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reminderType">Reminder Type</Label>
                    <Select
                      value={formData.reminder.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          reminder: {
                            ...prev.reminder!,
                            type: value as ReminderType,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reminderTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminderTime">Reminder Time</Label>
                    <Select
                      value={formData.reminder.time}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          reminder: {
                            ...prev.reminder!,
                            time: value as ReminderTime,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder time" />
                      </SelectTrigger>
                      <SelectContent>
                        {reminderTimes.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/calendar")}
          >
            Back to Calendar
          </Button>
          <Button
            type="submit"
            disabled={
              createAppointment.isPending || updateAppointment.isPending
            }
          >
            {isEditing ? "Update Appointment" : "Schedule Appointment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
