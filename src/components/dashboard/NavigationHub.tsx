// src/components/dashboard/NavigationHub.tsx
import React from "react";
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
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      onClick: () => navigate("/"),
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      onClick: () => navigate("/appointments"),
    },
    {
      id: "clients",
      label: "Clients",
      icon: Users,
      color: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      onClick: () => navigate("/clients"),
    },
    {
      id: "patients",
      label: "Patients",
      icon: User,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
      onClick: () => navigate("/patients"),
    },
    {
      id: "medical",
      label: "Medical Records",
      icon: ClipboardList,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
      onClick: () => navigate("/medical"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
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