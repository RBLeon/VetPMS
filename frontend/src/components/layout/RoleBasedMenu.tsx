import React from "react";
import { useResource, useNavigation, useGetIdentity } from "@refinedev/core";
import { useRole } from "@/lib/context/RoleContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export const RoleBasedMenu: React.FC = () => {
  const { resources } = useResource();
  const { role } = useRole();
  const { data: identity } = useGetIdentity<{ role: string }>();
  const location = useLocation();
  const { list } = useNavigation();

  if (!role && !identity?.role) {
    return null;
  }

  const userRole = role || identity?.role || "";

  // Filter resources based on user role
  const accessibleResources = resources.filter((resource) => {
    const canAccess = resource.meta?.canAccess as string[] | undefined;
    return !canAccess || canAccess.includes(userRole);
  });

  return (
    <div className="space-y-1 py-2">
      {accessibleResources.map((resource) => {
        const isActive = location.pathname.startsWith(
          resource.list?.toString() || ""
        );
        const icon = resource.meta?.icon || "Default";

        return (
          <Button
            key={resource.name}
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => {
              list(resource.name);
            }}
          >
            <span className="mr-2">{icon}</span>
            <span>{resource.meta?.label || resource.name}</span>
          </Button>
        );
      })}
    </div>
  );
};
