import { AccessControlProvider } from "@refinedev/core";
import { useRole } from "@/lib/context/RoleContext";

type RoleType = "CEO" | "MANAGER" | "VETERINARIAN" | "NURSE" | "RECEPTIONIST";

// Define access permissions for each resource and action by role
const rolePermissions: Record<
  RoleType,
  Record<string, Record<string, boolean>>
> = {
  CEO: {
    all: { list: true, show: true, create: true, edit: true, delete: true },
  },
  MANAGER: {
    all: { list: true, show: true, create: true, edit: true, delete: true },
    analytics: {
      list: true,
      show: true,
      create: false,
      edit: false,
      delete: false,
    },
  },
  VETERINARIAN: {
    dashboard: {
      list: true,
      show: true,
      create: false,
      edit: false,
      delete: false,
    },
    clients: {
      list: true,
      show: true,
      create: false,
      edit: false,
      delete: false,
    },
    patients: {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    appointments: {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    "medical-records": {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    tasks: { list: true, show: true, create: true, edit: true, delete: true },
  },
  NURSE: {
    dashboard: {
      list: true,
      show: true,
      create: false,
      edit: false,
      delete: false,
    },
    clients: {
      list: true,
      show: true,
      create: false,
      edit: false,
      delete: false,
    },
    patients: {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    appointments: {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    "medical-records": {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    tasks: { list: true, show: true, create: true, edit: true, delete: true },
  },
  RECEPTIONIST: {
    dashboard: {
      list: true,
      show: true,
      create: false,
      edit: false,
      delete: false,
    },
    clients: {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    patients: {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    appointments: {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    billing: {
      list: true,
      show: true,
      create: true,
      edit: true,
      delete: false,
    },
    tasks: { list: true, show: true, create: true, edit: true, delete: true },
  },
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    // Get current user role from context
    // Note: This is a hook, so we can't use it directly in this function
    // In a real app, you'd get the role from a state/context that's not a hook
    // or use a different pattern. This is just for the example.
    const role = localStorage.getItem("role") as RoleType | null;

    if (!role) {
      return { can: false, reason: "Unauthorized: No role assigned" };
    }

    // Get permissions for the role
    const rolePermission = rolePermissions[role];

    if (!rolePermission) {
      return { can: false, reason: "Unauthorized: Invalid role" };
    }

    // Check if role has permissions for all resources
    if (rolePermission.all) {
      return { can: rolePermission.all[action] || false };
    }

    // Check if role has permissions for the specific resource
    if (rolePermission[resource]) {
      return { can: rolePermission[resource][action] || false };
    }

    // Default deny
    return { can: false };
  },
};
