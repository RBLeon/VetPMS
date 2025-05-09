// src/lib/config/roleConfigs.ts
import {
  Calendar,
  Home,
  Settings,
  Stethoscope,
  Users,
  Search,
  Database,
  CalendarRange,
  User,
  FileText,
  CreditCard,
  BarChart3,
  FilePlus,
  Heart,
  CircuitBoard,
  TrendingUp,
} from "lucide-react";
import { NavItem, QuickAction } from "../context/RoleContext";

// Common navigation items shared across multiple roles
const commonNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  },
];

// Common quick actions shared across multiple roles
const commonQuickActions: QuickAction[] = [
  {
    title: "Search",
    href: "/search",
    icon: Search,
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
    onClick: () => {
      // Implement search functionality
      const searchInput = document.querySelector<HTMLInputElement>(
        '[data-testid="global-search"]'
      );
      if (searchInput) {
        searchInput.focus();
      }
    },
  },
];

export interface RoleConfig {
  displayName: string;
  description: string;
  navItems: NavItem[];
  quickActions: QuickAction[];
  permissions: string[];
  contextualFeatures: { [key: string]: boolean };
}

export const roleConfigs: { [key: string]: RoleConfig } = {
  veterinarian: {
    displayName: "Veterinarian",
    description: "Clinical staff focused on patient care and treatment",
    permissions: [
      "medical_records:read",
      "medical_records:write",
      "appointments:read",
      "patients:read",
      "patients:write",
      "clients:read",
      "prescriptions:write",
    ],
    navItems: [
      ...commonNavItems,
      {
        title: "Appointments",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "Clients",
        href: "/clients",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Patients",
        href: "/patients",
        icon: User,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Medical Records",
        href: "/medical",
        icon: Stethoscope,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "New SOAP Note",
        href: "/medical/soap/new",
        icon: FilePlus,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "New Appointment",
        href: "/appointments/new",
        icon: Calendar,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Patient Lookup",
        href: "/patients",
        icon: Heart,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
    ],
    contextualFeatures: {
      showPatientBanner: true,
      showMedicalRecordTabs: true,
      showPrescriptionTools: true,
      showBillingDetails: false,
      showAdvancedClinical: true,
      useRoleBasedDashboard: true,
    },
  },

  receptionist: {
    displayName: "Receptionist",
    description:
      "Front desk staff managing appointments and client interaction",
    permissions: [
      "appointments:read",
      "appointments:write",
      "clients:read",
      "clients:write",
      "patients:read",
      "invoices:read",
      "invoices:create",
      "medical_records:read",
    ],
    navItems: [
      ...commonNavItems,
      {
        title: "Appointments",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "Clients",
        href: "/clients",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Patients",
        href: "/patients",
        icon: User,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Medical Records",
        href: "/medical",
        icon: Stethoscope,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "New Appointment",
        href: "/appointments/new",
        icon: Calendar,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "New Client",
        href: "/clients/new",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Check-In Patient",
        href: "/appointments/check-in",
        icon: User,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
    ],
    contextualFeatures: {
      showPatientBanner: true,
      showMedicalRecordTabs: false,
      showPrescriptionTools: false,
      showBillingDetails: true,
      showAdvancedClinical: false,
      useRoleBasedDashboard: true,
    },
  },

  nurse: {
    displayName: "Veterinary Nurse",
    description: "Clinical support staff assisting veterinarians",
    permissions: [
      "medical_records:read",
      "medical_records:write:basic",
      "appointments:read",
      "patients:read",
      "patients:write:vitals",
      "clients:read",
      "treatments:execute",
    ],
    navItems: [
      ...commonNavItems,
      {
        title: "Appointments",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "Patients",
        href: "/patients",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Medical Records",
        href: "/medical",
        icon: Stethoscope,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Tasks",
        href: "/tasks",
        icon: FileText,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "Record Vitals",
        href: "/patients/vitals",
        icon: Heart,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Treatment Tasks",
        href: "/tasks/treatments",
        icon: FileText,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
      {
        title: "Patient Lookup",
        href: "/patients",
        icon: Heart,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
    ],
    contextualFeatures: {
      showPatientBanner: true,
      showMedicalRecordTabs: true,
      showPrescriptionTools: false,
      showBillingDetails: false,
      showAdvancedClinical: false,
      useRoleBasedDashboard: true,
    },
  },

  manager: {
    displayName: "Practice Manager",
    description: "Administrative staff overseeing practice operations",
    permissions: [
      "reports:read",
      "staff:read",
      "staff:write",
      "billing:read",
      "billing:write",
      "inventory:read",
      "inventory:write",
      "settings:read",
      "settings:write",
      "appointments:read",
      "clients:read",
      "patients:read",
    ],
    navItems: [
      ...commonNavItems,
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Staff Management",
        href: "/staff",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Billing & Finance",
        href: "/finance",
        icon: CreditCard,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
      {
        title: "Inventory",
        href: "/inventory",
        icon: Database,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "Daily Report",
        href: "/analytics/daily",
        icon: BarChart3,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Staff Schedule",
        href: "/staff/schedule",
        icon: CalendarRange,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Inventory Check",
        href: "/inventory/check",
        icon: Database,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
    ],
    contextualFeatures: {
      showPatientBanner: false,
      showMedicalRecordTabs: false,
      showPrescriptionTools: false,
      showBillingDetails: true,
      showAdvancedClinical: false,
      useRoleBasedDashboard: true,
    },
  },

  admin: {
    displayName: "System Administrator",
    description: "Technical staff with full system access",
    permissions: ["*"], // All permissions
    navItems: [
      ...commonNavItems,
      {
        title: "Users & Permissions",
        href: "/admin/users",
        icon: Users,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "System Configuration",
        href: "/admin/config",
        icon: Settings,
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
      },
      {
        title: "Practice Settings",
        href: "/admin/practice",
        icon: CircuitBoard,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Logs & Monitoring",
        href: "/admin/logs",
        icon: FileText,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "System Status",
        href: "/admin/status",
        icon: CircuitBoard,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
    ],
    contextualFeatures: {
      showPatientBanner: true,
      showMedicalRecordTabs: true,
      showPrescriptionTools: true,
      showBillingDetails: true,
      showAdvancedClinical: true,
      useRoleBasedDashboard: true,
    },
  },

  ceo: {
    displayName: "Chief Executive Officer",
    description:
      "Executive leadership with full system access and strategic oversight",
    permissions: ["*"], // All permissions
    navItems: [
      ...commonNavItems,
      {
        title: "Practice Analytics",
        href: "/analytics",
        icon: BarChart3,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Staff Management",
        href: "/staff",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Financial Overview",
        href: "/finance",
        icon: CreditCard,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
      {
        title: "Practice Settings",
        href: "/settings",
        icon: Settings,
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
      },
      {
        title: "Multi-Tenant Management",
        href: "/tenants",
        icon: CircuitBoard,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "Financial Report",
        href: "/finance/report",
        icon: BarChart3,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Staff Overview",
        href: "/staff/overview",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Practice Growth",
        href: "/analytics/growth",
        icon: TrendingUp,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
    ],
    contextualFeatures: {
      showPatientBanner: true,
      showMedicalRecordTabs: true,
      showPrescriptionTools: true,
      showBillingDetails: true,
      showAdvancedClinical: true,
      useRoleBasedDashboard: true,
    },
  },
};
