import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { RoleProvider } from "../../lib/context/RoleContext";
import { ContextAwareNavigation } from "./ContextAwareNavigation";
import { SearchBar } from "../dashboard/SearchBar";
import { useAuth } from "../../lib/context/AuthContext";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { UserMenu } from "../dashboard/UserMenu";

/**
 * Modern application layout with role-based UI adaptations
 * Integrates the context-aware navigation system that changes based on user role
 */
export function AppLayout() {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <RoleProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-full bg-teal-500 p-1.5 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  <path d="M12 7c-1.95 0-2.92 1.5-2.92 3.5 0 2 .97 3.5 2.92 3.5 1.95 0 2.92-1.5 2.92-3.5 0-2-.97-3.5-2.92-3.5z" />
                  <path d="M10 14.5c-1.666 0-2.5 1.333-2.5 4 0 2.667.833 4 2.5 4 1.666 0 2.5-1.333 2.5-4 0-2.667-.834-4-2.5-4z" />
                  <path d="M14 14.5c1.666 0 2.5 1.333 2.5 4 0 2.667-.834 4-2.5 4-1.667 0-2.5-1.333-2.5-4 0-2.667.833-4 2.5-4z" />
                  <path d="M9.5 10.5c-1 0-1.5.5-1.5 1.5s.5 1.5 1.5 1.5 1.5-.5 1.5-1.5-.5-1.5-1.5-1.5z" />
                  <path d="M14.5 10.5c1 0 1.5.5 1.5 1.5s-.5 1.5-1.5 1.5-1.5-.5-1.5-1.5.5-1.5 1.5-1.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold tracking-tight">VetPMS</h1>
            </Link>
          </div>

          <div className="hidden flex-1 px-8 md:block">
            <SearchBar placeholder="Search clients, patients, appointments..." />
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              <span className="sr-only">Notifications</span>
            </Button>
            <UserMenu />
          </div>
        </header>

        {/* Main content */}
        <main className="relative">
          <Outlet />

          {/* Modern Navigation */}
          <ContextAwareNavigation />
        </main>
      </div>
    </RoleProvider>
  );
}
