import { Layout } from "@/components/layout/Layout";
import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { UserMenu } from "@/components/dashboard/UserMenu";

const getRoleLayout = () => Layout;
const getRoleDashboard = () => null;
const getRoleScheduler = () => null;

const RoleLayout = getRoleLayout();
const RoleDashboard = getRoleDashboard();
const RoleScheduler = getRoleScheduler();
