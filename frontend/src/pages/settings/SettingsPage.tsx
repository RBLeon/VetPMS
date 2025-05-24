import { SettingsForm } from "@/features/settings/SettingsForm";

export function SettingsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Instellingen</h1>
      <SettingsForm />
    </div>
  );
}
