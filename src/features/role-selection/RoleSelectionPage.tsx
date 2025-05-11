import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/context/AuthContext";
import { useRole } from "@/lib/context/RoleContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Role } from "@/lib/api/types";

const roles: { id: Role; title: string; description: string; icon: string }[] =
  [
    {
      id: "RECEPTIONIST",
      title: "Receptioniste",
      description: "Beheer afspraken, klanten en balie",
      icon: "👋",
    },
    {
      id: "VETERINARIAN",
      title: "Dierenarts",
      description: "Beheer patiëntenzorg, medische dossiers en behandelingen",
      icon: "👨‍⚕️",
    },
    {
      id: "NURSE",
      title: "Verpleegkundige",
      description: "Assisteer bij patiëntenzorg en medische procedures",
      icon: "👩‍⚕️",
    },
    {
      id: "MANAGER",
      title: "Manager",
      description: "Beheer operaties, personeel en bedrijfsresultaten",
      icon: "👔",
    },
    {
      id: "CEO",
      title: "CEO",
      description: "Toegang tot alle functies en bedrijfsanalyses",
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

  const handleRoleSelect = (roleId: Role) => {
    // Clear the current role from localStorage first
    localStorage.removeItem("vc_role");
    // Set the new role
    setRole(roleId);
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Selecteer Uw Rol</h1>
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
                    Selecteer {role.title}
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
