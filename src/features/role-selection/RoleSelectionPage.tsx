import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/context/AuthContext";
import { RoleSelector } from "./RoleSelector";
import { useRole } from "../../lib/context/RoleContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";

const roles = [
  {
    id: "receptionist",
    title: "Receptionist",
    description: "Manage appointments, clients, and front desk operations",
    icon: "👋",
  },
  {
    id: "veterinarian",
    title: "Veterinarian",
    description: "Handle patient care, medical records, and treatments",
    icon: "👨‍⚕️",
  },
  {
    id: "nurse",
    title: "Nurse",
    description: "Assist with patient care and medical procedures",
    icon: "👩‍⚕️",
  },
  {
    id: "manager",
    title: "Manager",
    description: "Oversee operations, staff, and business metrics",
    icon: "👔",
  },
  {
    id: "ceo",
    title: "CEO",
    description: "Access all features and business analytics",
    icon: "👑",
  },
];

const RoleSelectionPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setRole } = useRole();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleRoleSelect = (roleId: string) => {
    setRole(roleId);
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Select Your Role</h1>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{role.icon}</span>
                    <div>
                      <CardTitle>{role.title}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleRoleSelect(role.id)}
                    className="w-full"
                  >
                    Select {role.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
