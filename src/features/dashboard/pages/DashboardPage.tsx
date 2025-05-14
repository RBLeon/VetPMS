import { RoleBasedDashboard } from "@/features/dashboard/components/RoleBasedDashboard";
import { useRole } from "@/lib/context/RoleContext";
import { Badge } from "@/features/ui/components/badge";

export function DashboardPage() {
  const { role } = useRole();

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "CEO":
        return "bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30 text-[#3B82F6] dark:text-[#3B82F6]";
      case "MANAGER":
        return "bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]";
      case "VETERINARIAN":
        return "bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/20 dark:hover:bg-[#8B5CF6]/30 text-[#8B5CF6] dark:text-[#8B5CF6]";
      case "NURSE":
        return "bg-[#10B981]/10 hover:bg-[#10B981]/20 dark:bg-[#10B981]/20 dark:hover:bg-[#10B981]/30 text-[#10B981] dark:text-[#10B981]";
      case "RECEPTIONIST":
        return "bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 dark:bg-[#3B82F6]/20 dark:hover:bg-[#3B82F6]/30 text-[#3B82F6] dark:text-[#3B82F6]";
      default:
        return "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {role && (
          <Badge variant="outline" className={getRoleBadgeColor(role)}>
            {role}
          </Badge>
        )}
      </div>
      <RoleBasedDashboard role={role} />
    </div>
  );
}
