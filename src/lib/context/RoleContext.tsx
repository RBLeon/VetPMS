// src/lib/context/RoleContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { roleConfigs, RoleConfig } from "../config/roleConfigs";

export type Role =
  | "VETERINARIAN"
  | "RECEPTIONIST"
  | "NURSE"
  | "MANAGER"
  | "CEO";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
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
  const [role, setRoleState] = useState<Role>(() => {
    // Try to get role from localStorage first
    const storedRole = localStorage.getItem("vc_role");
    if (storedRole && Object.keys(roleConfigs).includes(storedRole)) {
      return storedRole as Role;
    }
    // Fallback to user's role or default
    return (user?.role as Role) || "VETERINARIAN";
  });
  const [roleConfig, setRoleConfig] = useState<RoleConfig>(
    roleConfigs[role] || roleConfigs.veterinarian
  );

  // Update role configuration whenever role changes
  useEffect(() => {
    // If user has a role defined, use it
    if (user?.role && Object.keys(roleConfigs).includes(user.role)) {
      setRoleState(user.role as Role);
    }

    setRoleConfig(roleConfigs[role] || roleConfigs.veterinarian);
  }, [role, user?.role]);

  // Wrapper for setRole that also persists to localStorage
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("vc_role", newRole);
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
