import { PatientList } from "@/features/patients/PatientList";

export function PatientsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patiënten</h1>
      <PatientList />
    </div>
  );
}
