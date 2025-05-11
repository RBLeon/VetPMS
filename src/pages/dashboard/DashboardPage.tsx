import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";
import { useRole } from "@/lib/context/RoleContext";

export function DashboardPage() {
  const { role } = useRole();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <RoleBasedDashboard role={role} />
    </div>
  );
}
