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
  {
    title: "Instellingen",
    href: "/settings",
    icon: Settings,
    color:
      "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
  },
  {
    title: "Profiel",
    href: "/settings/profile",
    icon: User,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
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
  ADMIN: {
    displayName: "Systeembeheerder",
    description: "Technisch personeel met volledige systeemtoegang",
    permissions: ["*"], // All permissions
    navItems: [
      ...commonNavItems,
      {
        title: "Gebruikers & Rechten",
        href: "/admin/users",
        icon: Users,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "Systeemconfiguratie",
        href: "/admin/config",
        icon: Settings,
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
      },
      {
        title: "Praktijkinstellingen",
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
        title: "Gebruikersbeheer",
        href: "/admin/users",
        icon: Users,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "Systeemstatus",
        href: "/admin/config",
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
  VETERINARIAN: {
    displayName: "Dierenarts",
    description: "Volledige toegang tot klinische functies en patiëntgegevens",
    permissions: [
      "patients.view",
      "patients.edit",
      "appointments.view",
      "appointments.edit",
      "medical_records.view",
      "medical_records.edit",
      "prescriptions.view",
      "prescriptions.edit",
    ],
    navItems: [
      ...commonNavItems,
      {
        title: "Afspraken",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Patiënten",
        href: "/patients",
        icon: Stethoscope,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Medische Dossiers",
        href: "/medical-records",
        icon: FileText,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "Nieuwe Afspraak",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Nieuwe Patiënt",
        href: "/patients/new",
        icon: Stethoscope,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Medisch Dossier",
        href: "/medical-records/new",
        icon: FileText,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
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
  NURSE: {
    displayName: "Dierenartsassistent",
    description: "Klinisch ondersteunend personeel dat dierenartsen assisteert",
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
        title: "Afspraken",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "Patiënten",
        href: "/patients",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Medische Dossiers",
        href: "/medical-records",
        icon: Stethoscope,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Taken",
        href: "/tasks",
        icon: FileText,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "Vitalen Registreren",
        href: "/patients/vitals",
        icon: Heart,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Nieuwe Afspraak",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
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
  RECEPTIONIST: {
    displayName: "Baliemedewerker",
    description:
      "Baliepersoneel voor het beheren van afspraken en klantcontact",
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
        title: "Afspraken",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
      {
        title: "Klanten",
        href: "/clients",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Patiënten",
        href: "/patients",
        icon: User,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Medische Dossiers",
        href: "/medical-records",
        icon: Stethoscope,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "Nieuwe Afspraak",
        href: "/appointments",
        icon: Calendar,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Nieuwe Klant",
        href: "/clients/new",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Patiënt Inchecken",
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
  MANAGER: {
    displayName: "Praktijkmanager",
    description: "Administratief personeel dat toezicht houdt op de praktijk",
    permissions: [
      "rapporten:lezen",
      "personeel:lezen",
      "personeel:schrijven",
      "facturering:lezen",
      "facturering:schrijven",
      "voorraad:lezen",
      "voorraad:schrijven",
      "instellingen:lezen",
      "instellingen:schrijven",
      "afspraken:lezen",
      "klanten:lezen",
      "patiënten:lezen",
      "financieel:lezen",
      "financieel:schrijven",
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
        title: "Personeelsbeheer",
        href: "/personeel",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Financieel Beheer",
        href: "/finance",
        icon: CreditCard,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
      {
        title: "Voorraad",
        href: "/voorraad",
        icon: Database,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "Dagelijks Rapport",
        href: "/analytics/daily",
        icon: BarChart3,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Personeelsrooster",
        href: "/staff/schedule",
        icon: CalendarRange,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Voorraadcontrole",
        href: "/inventory/check",
        icon: Database,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      },
      {
        title: "Financieel Overzicht",
        href: "/finance/overview",
        icon: CreditCard,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
      {
        title: "Facturen",
        href: "/finance/invoices",
        icon: FileText,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
    ],
    contextualFeatures: {
      showPatientBanner: true,
      showMedicalRecordTabs: true,
      showPrescriptionTools: false,
      showBillingDetails: true,
      showAdvancedClinical: false,
      useRoleBasedDashboard: true,
    },
  },
  CEO: {
    displayName: "Directeur",
    description:
      "Directie met volledige systeemtoegang en strategisch toezicht",
    permissions: ["*"], // All permissions
    navItems: [
      ...commonNavItems,
      {
        title: "Praktijk Analytics",
        href: "/analytics",
        icon: BarChart3,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Personeelsbeheer",
        href: "/staff",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Financieel Beheer",
        href: "/finance",
        icon: CreditCard,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
      {
        title: "Multi-Tenant Beheer",
        href: "/tenants",
        icon: CircuitBoard,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      },
    ],
    quickActions: [
      ...commonQuickActions,
      {
        title: "Financieel Rapport",
        href: "/finance/report",
        icon: BarChart3,
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      },
      {
        title: "Personeels Overzicht",
        href: "/staff/overview",
        icon: Users,
        color:
          "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      },
      {
        title: "Praktijk Groei",
        href: "/analytics/growth",
        icon: TrendingUp,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
      {
        title: "Financieel Dashboard",
        href: "/finance/overview",
        icon: CreditCard,
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      },
      {
        title: "Financiële Rapportages",
        href: "/finance/reports",
        icon: FileText,
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
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
