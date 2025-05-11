import { useMedicalRecord } from "@/lib/hooks/useMedicalRecord";

interface MedicalRecordDetailsProps {
  recordId: string;
}

export function MedicalRecordDetails({ recordId }: MedicalRecordDetailsProps) {
  const { data: record, isLoading } = useMedicalRecord(recordId);

  if (isLoading) {
    return <div>Laden...</div>;
  }

  if (!record) {
    return <div>Medisch dossier niet gevonden</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Datum</h3>
          <p>{new Date(record.date).toLocaleDateString("nl-NL")}</p>
        </div>
        <div>
          <h3 className="font-semibold">Patiënt</h3>
          <p>{record.patientName}</p>
        </div>
        <div>
          <h3 className="font-semibold">Type</h3>
          <p>{record.type}</p>
        </div>
        <div>
          <h3 className="font-semibold">Dierenarts</h3>
          <p>{record.veterinarianName}</p>
        </div>
        <div>
          <h3 className="font-semibold">Status</h3>
          <p>{record.status}</p>
        </div>
      </div>
      {record.diagnosis && (
        <div>
          <h3 className="font-semibold">Diagnose</h3>
          <p>{record.diagnosis}</p>
        </div>
      )}
      {record.treatment && (
        <div>
          <h3 className="font-semibold">Behandeling</h3>
          <p>{record.treatment}</p>
        </div>
      )}
      {record.notes && (
        <div>
          <h3 className="font-semibold">Notities</h3>
          <p>{record.notes}</p>
        </div>
      )}
    </div>
  );
}
