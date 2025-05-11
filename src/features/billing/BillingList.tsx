import { useBills } from "@/lib/hooks/useBills";

export function BillingList() {
  const { data: bills, isLoading } = useBills();

  if (isLoading) {
    return <div>Laden...</div>;
  }

  if (!bills?.length) {
    return <div>Geen facturen gevonden</div>;
  }

  return (
    <div className="space-y-4">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Factuur Nummer</th>
            <th className="text-left">Datum</th>
            <th className="text-left">Klant</th>
            <th className="text-right">Bedrag</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.invoiceNumber}</td>
              <td>{new Date(bill.date).toLocaleDateString("nl-NL")}</td>
              <td>{bill.clientName}</td>
              <td className="text-right">€{bill.amount.toFixed(2)}</td>
              <td>{bill.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
