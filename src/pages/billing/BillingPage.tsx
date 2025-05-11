import { BillingList } from "@/features/billing/BillingList";

export function BillingPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Facturatie</h1>
      <BillingList />
    </div>
  );
}
