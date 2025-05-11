import { Calendar } from "@/features/calendar/Calendar";

export function AppointmentsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Afspraken</h1>
      <Calendar />
    </div>
  );
}
