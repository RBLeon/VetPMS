import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";
import { useAuth } from "@/lib/context/AuthContext";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <RoleBasedDashboard role={user?.role || "RECEPTIONIST"} />
    </div>
  );
}
