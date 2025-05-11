import { useParams } from "react-router-dom";
import { AppointmentDetails } from "@/features/calendar/AppointmentDetails";

export function AppointmentDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Afspraak Details</h1>
      {id && <AppointmentDetails appointmentId={id} />}
    </div>
  );
}
