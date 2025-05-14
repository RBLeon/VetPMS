import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Stethoscope,
  Calendar,
  BarChart3,
  CircuitBoard,
} from "lucide-react";
import { useRole } from "../../lib/context/RoleContext";
import { roleConfigs } from "../../lib/config/roleConfigs";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "../../lib/utils";
import type { Role } from "@/lib/context/RoleContext";

// Map role to appropriate icon
const getRoleIcon = (role: string) => {
  switch (role) {
    case "VETERINARIAN":
      return Stethoscope;
    case "RECEPTIONIST":
      return Calendar;
    case "NURSE":
      return Users;
    case "MANAGER":
      return BarChart3;
    case "CEO":
      return CircuitBoard;
    default:
      return Users;
  }
};

interface RoleSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  open,
  onOpenChange,
}) => {
  const { setRole } = useRole();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roles = Object.keys(roleConfigs);

  // Handle role selection
  const handleRoleSelect = (roleKey: string) => {
    setSelectedRole(roleKey);
    setError(null);
  };

  // Confirm role selection and navigate to dashboard
  const confirmRoleSelection = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    setError(null);

    try {
      await setRole(selectedRole as Role);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Fout bij het instellen van rol"
      );
      console.error("Role selection failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for the role cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecteer je rol</DialogTitle>
          <DialogDescription>
            Kies de rol die het beste past bij je huidige taken.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {roles.map((roleKey, index) => {
            const roleConfig = roleConfigs[roleKey];
            const Icon = getRoleIcon(roleKey);
            return (
              <motion.div
                key={roleKey}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedRole === roleKey && "ring-2 ring-primary"
                  )}
                  onClick={() => handleRoleSelect(roleKey)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "rounded-full p-2",
                          roleConfig.navItems[0].color
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>{roleConfig.displayName}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={isLoading}
          >
            Annuleren
          </Button>
          <Button
            onClick={confirmRoleSelection}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? "Bezig..." : "Bevestigen"}
          </Button>
        </div>
        {error && (
          <div className="mt-4 text-sm text-red-500 text-center">{error}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelector;
