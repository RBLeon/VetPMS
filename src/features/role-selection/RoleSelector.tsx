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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

// Map role to appropriate icon
const getRoleIcon = (role: string) => {
  switch (role) {
    case "veterinarian":
      return Stethoscope;
    case "receptionist":
      return Calendar;
    case "nurse":
      return Users;
    case "manager":
      return BarChart3;
    case "admin":
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
      await setRole(
        selectedRole as import("../../lib/context/RoleContext").Role
      );
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set role");
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Your Role</DialogTitle>
          <DialogDescription>
            Choose a role to customize your VetPMS experience for this session
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {roles.map((roleKey, index) => {
            const roleConfig = roleConfigs[roleKey];
            const RoleIcon = getRoleIcon(roleKey);
            const isSelected = roleKey === selectedRole;

            return (
              <motion.div
                key={roleKey}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => handleRoleSelect(roleKey)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-2 rounded-full ${
                          roleConfig.navItems[0]?.color || "bg-blue-100"
                        }`}
                      >
                        <RoleIcon className="h-5 w-5" />
                      </div>
                      {isSelected && (
                        <div className="h-4 w-4 rounded-full bg-primary" />
                      )}
                    </div>
                    <CardTitle>{roleConfig.displayName}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {roleConfig.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold">Key features:</span>{" "}
                      {Object.entries(roleConfig.contextualFeatures)
                        .filter(([, value]) => value === true)
                        .map(([key]) => key.replace(/([A-Z])/g, " $1"))
                        .map((feature) =>
                          feature
                            .replace(/^show/g, "")
                            .replace(/^use/g, "")
                            .trim()
                        )
                        .slice(0, 3)
                        .join(", ")}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {error && <div className="text-sm text-red-500 mr-auto">{error}</div>}
          <Button
            onClick={confirmRoleSelection}
            disabled={!selectedRole || isLoading}
          >
            {isLoading
              ? "Setting role..."
              : `Continue as ${
                  selectedRole ? roleConfigs[selectedRole].displayName : ""
                }`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelector;
