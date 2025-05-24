import { useState } from "react";
import { useRole } from "@/lib/context/RoleContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Link } from "react-router-dom";

export function Header() {
  const { role } = useRole();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const getRoleSpecificNotifications = () => {
    // This would typically come from a notifications context or API
    // For now, we'll return role-specific mock notifications
    switch (role) {
      case "VETERINARIAN":
        return [
          {
            id: 1,
            title: "Aankomende afspraken",
            message: "U heeft 3 afspraken vandaag",
          },
          {
            id: 2,
            title: "Lab resultaten",
            message: "Nieuwe lab resultaten beschikbaar voor Patiënt #123",
          },
          {
            id: 3,
            title: "Herhaling recepten",
            message: "2 recepten moeten worden vernieuwd",
          },
        ];
      case "NURSE":
        return [
          {
            id: 1,
            title: "Patiënt check-ins",
            message: "2 patiënten wachten op check-in",
          },
          {
            id: 2,
            title: "Behandelingstaken",
            message: "3 behandelingen gepland voor vandaag",
          },
        ];
      case "RECEPTIONIST":
        return [
          {
            id: 1,
            title: "Nieuwe afspraken",
            message: "5 nieuwe afspraken vandaag",
          },
          {
            id: 2,
            title: "Patiënt aankomsten",
            message: "3 patiënten zijn aangekomen",
          },
        ];
      default:
        return [];
    }
  };

  const notifications = getRoleSpecificNotifications();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
          >
            VetPMS
          </Link>
        </div>
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-3xl">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <DropdownMenu
            open={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Meldingen</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id}>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {notification.message}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
