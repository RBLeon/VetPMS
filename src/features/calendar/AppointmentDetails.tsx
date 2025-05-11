import { useAppointment } from "@/lib/hooks/useAppointment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppointmentDetailsProps {
  appointmentId: string;
}

export function AppointmentDetails({ appointmentId }: AppointmentDetailsProps) {
  const { data: appointment, isLoading } = useAppointment(appointmentId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Patient</h3>
            <p>{appointment.patientName}</p>
          </div>
          <div>
            <h3 className="font-semibold">Client</h3>
            <p>{appointment.clientName}</p>
          </div>
          <div>
            <h3 className="font-semibold">Date and Time</h3>
            <p>
              {new Date(
                `${appointment.date}T${appointment.time}`
              ).toLocaleString("nl-NL")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Type</h3>
            <p>{appointment.type}</p>
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p>{appointment.status}</p>
          </div>
          {appointment.notes && (
            <div>
              <h3 className="font-semibold">Notes</h3>
              <p>{appointment.notes}</p>
            </div>
          )}
          {appointment.isRecurring && appointment.recurringPattern && (
            <div>
              <h3 className="font-semibold">Herhalingspatroon</h3>
              <p>
                {appointment.recurringPattern.frequency} elke{" "}
                {appointment.recurringPattern.interval}{" "}
                {appointment.recurringPattern.frequency.toLowerCase()}
                {appointment.recurringPattern.endDate && (
                  <>
                    {" "}
                    tot{" "}
                    {new Date(
                      appointment.recurringPattern.endDate
                    ).toLocaleDateString("nl-NL")}
                  </>
                )}
              </p>
            </div>
          )}
          {appointment.reminder && (
            <div>
              <h3 className="font-semibold">Herinnering</h3>
              <p>
                {appointment.reminder.type} melding {appointment.reminder.time}{" "}
                van tevoren
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
