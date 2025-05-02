import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/context/AuthContext";
import { useTenant } from "../../lib/context/TenantContext";
import { useUi, ContextualAction } from "../../lib/context/UiContext";
import GlobalSearch, { SearchResultItem } from "../shared/GlobalSearch";
import ContextPanel from "./ContextPanel";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { Switch } from "../../components/ui/switch";
import {
  LightbulbIcon,
  MoonIcon,
  SearchIcon,
  BellIcon,
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  UserIcon,
  PlusIcon,
  Settings2Icon,
  LogOutIcon,
  ChevronDownIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

// Helper function to get icon for workspace
const getWorkspaceIcon = (workspace: string) => {
  switch (workspace) {
    case "dashboard":
      return <HomeIcon className="w-5 h-5" />;
    case "appointments":
      return <CalendarIcon className="w-5 h-5" />;
    case "clients":
      return <UsersIcon className="w-5 h-5" />;
    case "patients":
      return <UserIcon className="w-5 h-5" />;
    default:
      return <HomeIcon className="w-5 h-5" />;
  }
};

const Layout: React.FC = () => {
  const { user, logout, backendType, toggleBackendType } = useAuth();
  const { currentTenant, accessibleTenants, setCurrentTenant } = useTenant();
  const {
    currentWorkspace,
    setCurrentWorkspace,
    contextualActions,
    setContextualActions,
    setBreadcrumb,
    isDarkMode,
    toggleDarkMode,
    globalSearch,
    isSearchActive,
    searchResults,
    clearSearch,
  } = useUi();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Define primary workspaces/hubs
  const primaryWorkspaces = [
    { id: "dashboard", name: "Dashboard", path: "/" },
    { id: "appointments", name: "Appointments", path: "/appointments" },
    { id: "clients", name: "Clients", path: "/clients" },
    { id: "patients", name: "Patients", path: "/patients" },
  ];

  // Determine current workspace based on path
  useEffect(() => {
    const path = location.pathname;
    let workspace = "dashboard";

    if (path.includes("/appointments")) {
      workspace = "appointments";
    } else if (path.includes("/clients")) {
      workspace = "clients";
    } else if (path.includes("/patients")) {
      workspace = "patients";
    }

    setCurrentWorkspace(workspace);

    // Set breadcrumb based on current path
    const breadcrumbItems = [
      {
        label: workspace.charAt(0).toUpperCase() + workspace.slice(1),
        icon: workspace,
      },
    ];

    setBreadcrumb(breadcrumbItems);

    // Set contextual actions based on current workspace
    const newContextualActions: ContextualAction[] = [];

    if (workspace === "dashboard") {
      // Dashboard specific actions would go here
    } else if (workspace === "appointments") {
      newContextualActions.push({
        id: "new-appointment",
        label: "New Appointment",
        icon: "calendar-plus",
        action: () => {
          // Logic to create new appointment
          console.log("Creating new appointment");
        },
      });
    } else if (workspace === "clients") {
      newContextualActions.push({
        id: "new-client",
        label: "New Client",
        icon: "user-plus",
        action: () => {
          // Logic to create new client
          console.log("Creating new client");
        },
      });
    } else if (workspace === "patients") {
      newContextualActions.push({
        id: "new-patient",
        label: "New Patient",
        icon: "plus-circle",
        action: () => {
          // Logic to create new patient
          console.log("Creating new patient");
        },
      });
    }

    setContextualActions(newContextualActions);
  }, [location, setCurrentWorkspace, setBreadcrumb, setContextualActions]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    globalSearch(query);
  };

  // Handle search selection
  const handleSearchItemClick = (item: SearchResultItem) => {
    if (item.type === "patient") {
      navigate(`/patients/${item.id}`);
    } else if (item.type === "client") {
      navigate(`/clients/${item.id}`);
    } else if (item.type === "appointment" && item.date) {
      navigate(`/appointments?date=${item.date}`);
    }
    clearSearch();
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Handle workspace selection
  const navigateToWorkspace = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top bar - constant throughout the application */}
      <header className="h-16 px-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center space-x-4">
          {/* Logo/Brand */}
          <div className="font-semibold text-xl text-primary">VetPMS</div>

          {/* Tenant Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {currentTenant?.name}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {accessibleTenants.map((tenant) => (
                <DropdownMenuItem
                  key={tenant.id}
                  onClick={() => setCurrentTenant(tenant)}
                >
                  {tenant.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Global search */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
            {isSearchOpen && (
              <GlobalSearch
                value={searchQuery}
                onChange={handleSearch}
                results={searchResults as SearchResultItem[] | null}
                isActive={isSearchActive}
                onItemClick={handleSearchItemClick}
                onClose={() => {
                  setIsSearchOpen(false);
                  clearSearch();
                  setSearchQuery("");
                }}
              />
            )}
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
          </Button>

          {/* Toggle backend */}
          <div className="flex items-center space-x-2 px-2">
            <span className="text-xs">
              {backendType === "animana" ? "Animana" : "VetPMS"}
            </span>
            <Switch
              checked={backendType === "VetPMS"}
              onCheckedChange={toggleBackendType}
            />
          </div>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <LightbulbIcon className="h-5 w-5" />
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.firstName} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start p-2">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings2Icon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Primary workspace selector (activity-based hub) */}
        <div className="w-20 border-r border-border p-2 flex flex-col items-center space-y-4">
          {primaryWorkspaces.map((workspace) => (
            <Button
              key={workspace.id}
              variant={currentWorkspace === workspace.id ? "default" : "ghost"}
              className="w-14 h-14 flex flex-col justify-center items-center gap-1 p-1"
              onClick={() => navigateToWorkspace(workspace.path)}
            >
              {getWorkspaceIcon(workspace.id)}
              <span className="text-xs">{workspace.name}</span>
            </Button>
          ))}
          <Separator className="my-2" />
          {/* Quick action button */}
          <Button
            className="w-14 h-14 rounded-full flex items-center justify-center"
            variant="outline"
          >
            <PlusIcon className="w-6 h-6" />
          </Button>
        </div>

        {/* Content area with contextual panel */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>

          {/* Contextual panel - shows actions relevant to current view */}
          <ContextPanel actions={contextualActions} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
