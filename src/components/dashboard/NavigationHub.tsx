// src/components/dashboard/NavigationHub.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Home,
  Calendar,
  Users,
  User,
  ClipboardList,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface NavigationHubProps {
  onSelect: (section: string | null) => void;
  activeSection: string | null;
}

export function NavigationHub({ onSelect, activeSection }: NavigationHubProps) {
  const navigate = useNavigate();

  const hubItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      color: "bg-blue-100 text-blue-600",
      onClick: () => navigate("/"),
    },
    {
      id: "calendar",
      label: "Agenda",
      icon: Calendar,
      color: "bg-green-100 text-green-600",
      onClick: () => navigate("/calendar"),
    },
    {
      id: "clients",
      label: "Klanten",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      onClick: () => navigate("/clients"),
    },
    {
      id: "patients",
      label: "Patiënten",
      icon: User,
      color: "bg-orange-100 text-orange-600",
      onClick: () => navigate("/patients"),
    },
    {
      id: "tasks",
      label: "Taken",
      icon: ClipboardList,
      color: "bg-red-100 text-red-600",
      onClick: () => navigate("/tasks"),
    },
    {
      id: "settings",
      label: "Instellingen",
      icon: Settings,
      color: "bg-gray-100 text-gray-600",
      onClick: () => navigate("/settings"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {hubItems.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          className={cn(
            "flex items-center gap-2 hover:shadow-md transition-all",
            activeSection === item.id && "ring-2 ring-primary/30"
          )}
          onClick={() => {
            onSelect(item.id);
            item.onClick();
          }}
        >
          <div className={cn("rounded-full p-1", item.color)}>
            <item.icon className="h-4 w-4" />
          </div>
          <span>{item.label}</span>
        </Button>
      ))}
    </div>
  );
}
