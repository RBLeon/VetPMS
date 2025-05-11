import { MedicalRecordList } from "@/features/medical-records/MedicalRecordList";

export function MedicalRecordsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medische Dossiers</h1>
      <MedicalRecordList />
    </div>
  );
}
