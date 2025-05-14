// src/lib/context/RoleContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { roleConfigs, RoleConfig } from "../config/roleConfigs";
import { useNavigate } from "react-router-dom";

export type Role =
  | "VETERINARIAN"
  | "RECEPTIONIST"
  | "NURSE"
  | "MANAGER"
  | "CEO";

interface RoleContextType {
  role: Role | null;
  setRole: (role: Role | null) => void;
  roleConfig: RoleConfig;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  userNavItems: NavItem[];
  quickActions: QuickAction[];
  contextualFeatures: { [key: string]: boolean };
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  color: string;
  requiredPermission?: string;
}

export interface QuickAction {
  title: string;
  href: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
  requiredPermission?: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [role, setRoleState] = useState<Role | null>(() => {
    // Try to get role from localStorage first
    const storedRole = localStorage.getItem("vc_role");
    if (storedRole && Object.keys(roleConfigs).includes(storedRole)) {
      return storedRole as Role;
    }
    return null;
  });

  const [roleConfig, setRoleConfig] = useState<RoleConfig>(
    role ? roleConfigs[role] : roleConfigs.VETERINARIAN
  );

  // Update role configuration whenever role changes
  useEffect(() => {
    if (role) {
      setRoleConfig(roleConfigs[role]);
    } else {
      // When role is null, use a default config with minimal permissions
      setRoleConfig({
        displayName: "No Role",
        description: "Please select a role",
        permissions: [],
        navItems: [],
        quickActions: [],
        contextualFeatures: {},
      });
    }
  }, [role]);

  // Handle user authentication state changes
  useEffect(() => {
    if (!user) {
      // Clear role when user logs out
      setRoleState(null);
      localStorage.removeItem("vc_role");
    } else if (user && !role) {
      // Redirect to role selection if user is logged in but has no role
      navigate("/role-selection");
    }
  }, [user, role, navigate]);

  // Wrapper for setRole that also persists to localStorage
  const setRole = (newRole: Role | null) => {
    if (newRole === null) {
      setRoleState(null);
      localStorage.removeItem("vc_role");
    } else {
      setRoleState(newRole);
      localStorage.setItem("vc_role", newRole);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return roleConfig.permissions.includes(permission);
  };

  const filterByPermission = <T extends { requiredPermission?: string }>(
    items: T[]
  ): T[] => {
    return items.filter(
      (item) =>
        !item.requiredPermission || hasPermission(item.requiredPermission)
    );
  };

  // Get role-specific nav items with permission filtering
  const userNavItems = filterByPermission(roleConfig.navItems);

  // Get role-specific quick actions with permission filtering
  const quickActions = filterByPermission(roleConfig.quickActions);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        roleConfig,
        permissions: roleConfig.permissions,
        hasPermission,
        userNavItems,
        quickActions,
        contextualFeatures: roleConfig.contextualFeatures,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
