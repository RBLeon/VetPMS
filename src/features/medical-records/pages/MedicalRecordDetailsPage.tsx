import { useParams } from "react-router-dom";
import { useMedicalRecord } from "@/lib/hooks/useMedicalRecord";
import { FollowUpForm } from "@/features/medical-records/components/FollowUpForm";
import { FollowUpHistory } from "@/features/medical-records/components/FollowUpHistory";

export const MedicalRecordDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: record, isLoading, error } = useMedicalRecord(id || "");

  if (isLoading) {
    return <div>Laden...</div>;
  }

  if (error || !record) {
    return <div>Fout bij het ophalen van het medisch record</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Medisch Record Details</h1>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Basisinformatie</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Datum</dt>
                <dd>{new Date(record.date).toLocaleDateString("nl-NL")}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Diagnose</dt>
                <dd>{record.diagnosis}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Behandeling
                </dt>
                <dd>{record.treatment}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>{record.status}</dd>
              </div>
              {record.notes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Notities
                  </dt>
                  <dd>{record.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        <div className="space-y-4">
          <FollowUpForm recordDate={record.date} />
          <FollowUpHistory recordId={record.id} />
        </div>
      </div>
    </div>
  );
};
