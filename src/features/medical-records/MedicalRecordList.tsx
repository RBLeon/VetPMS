import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";

export function MedicalRecordList() {
  const { data: records, isLoading } = useMedicalRecords();

  if (isLoading) {
    return <div>Laden...</div>;
  }

  if (!records?.length) {
    return <div>Geen medische dossiers gevonden</div>;
  }

  return (
    <div className="space-y-4">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Datum</th>
            <th className="text-left">Patiënt</th>
            <th className="text-left">Type</th>
            <th className="text-left">Dierenarts</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{new Date(record.date).toLocaleDateString("nl-NL")}</td>
              <td>{record.patientName}</td>
              <td>{record.type}</td>
              <td>{record.veterinarianName}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
