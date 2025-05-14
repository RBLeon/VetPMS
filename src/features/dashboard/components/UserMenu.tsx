// src/components/dashboard/UserMenu.tsx
import { useAuth } from "@/lib/context/AuthContext";
import { useRole } from "@/lib/context/RoleContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/ui/components/avatar";
import { Button } from "@/features/ui/components/button";
import { Settings, LogOut, User, HelpCircle, Users } from "lucide-react";

interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { setRole, roleConfig } = useRole();
  const navigate = useNavigate();

  if (!user) return null;

  const displayName = user.displayName || user.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/settings/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleRoleSwitch = () => {
    // Clear the current role
    localStorage.removeItem("vc_role");
    setRole(null);
    navigate("/role-selection");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profiel</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Instellingen</span>
          </DropdownMenuItem>
          {roleConfig?.permissions?.includes("help:view") && (
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
          )}
          {roleConfig?.permissions?.includes("users:manage") && (
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Gebruikersbeheer</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRoleSwitch}>
          <Users className="mr-2 h-4 w-4" />
          <span>Rol Wisselen</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Uitloggen</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
