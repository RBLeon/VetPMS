import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "@/AppRoutes";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRole } from "@/lib/context/RoleContext";
import { vi } from "vitest";
import { UiProvider } from "@/lib/context/UiContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TenantProvider } from "@/lib/context/TenantContext";
import { Menu } from "lucide-react";

// Create a new QueryClient for each test
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock the auth and role hooks
vi.mock("@/lib/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/lib/context/RoleContext", () => ({
  useRole: vi.fn(),
}));

describe("Navigation", () => {
  beforeEach(() => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      user: {
        firstName: "Test",
        lastName: "User",
      },
    });
    (useRole as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      role: "ADMIN",
      roleConfig: {
        displayName: "Administrator",
        navItems: [
          { title: "Dashboard", href: "/", icon: Menu },
          { title: "Settings", href: "/settings", icon: Menu },
          { title: "Patients", href: "/patients", icon: Menu },
          { title: "Medical Records", href: "/medical-records", icon: Menu },
          { title: "Appointments", href: "/appointments", icon: Menu },
          { title: "Clients", href: "/clients", icon: Menu },
          { title: "Tasks", href: "/tasks", icon: Menu },
          { title: "Analytics", href: "/analytics", icon: Menu },
          { title: "Search", href: "/search", icon: Menu },
        ],
      },
      userNavItems: [
        { title: "Dashboard", href: "/", icon: Menu },
        { title: "Settings", href: "/settings", icon: Menu },
        { title: "Patients", href: "/patients", icon: Menu },
        { title: "Medical Records", href: "/medical-records", icon: Menu },
        { title: "Appointments", href: "/appointments", icon: Menu },
        { title: "Clients", href: "/clients", icon: Menu },
        { title: "Tasks", href: "/tasks", icon: Menu },
        { title: "Analytics", href: "/analytics", icon: Menu },
        { title: "Search", href: "/search", icon: Menu },
      ],
      quickActions: [],
    });
  });

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <AuthProvider>
            <UiProvider>
              <MemoryRouter initialEntries={["/login"]}>
                <AppRoutes />
              </MemoryRouter>
            </UiProvider>
          </AuthProvider>
        </TenantProvider>
      </QueryClientProvider>
    );
  };

  const openNavigation = () => {
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);
  };

  const clickNavLink = (text: string) => {
    const links = screen.getAllByText(text);
    // Click the first link (navigation link) instead of the page heading
    fireEvent.click(links[0]);
  };

  it("navigates to dashboard when clicking on dashboard link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Dashboard");
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
  });

  it("navigates to settings when clicking on settings link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Settings");
    expect(screen.getAllByText("Instellingen").length).toBeGreaterThan(0);
  });

  it("navigates to patients when clicking on patients link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Patients");
    expect(screen.getAllByText("Patiënten").length).toBeGreaterThan(0);
  });

  it("navigates to medical records when clicking on medical records link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Medical Records");
    expect(screen.getAllByText("Medische Dossiers").length).toBeGreaterThan(0);
  });

  it("navigates to appointments when clicking on appointments link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Appointments");
    expect(screen.getByText(/Nieuw/i)).toBeInTheDocument();
  });

  it("navigates to clients when clicking on clients link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Clients");
    expect(screen.getByText("Klanten")).toBeInTheDocument();
  });

  it("navigates to tasks when clicking on tasks link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Tasks");
    expect(screen.getByText("Taken")).toBeInTheDocument();
  });

  it("navigates to analytics when clicking on analytics link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Analytics");
    expect(screen.getAllByText("Analytics").length).toBeGreaterThan(0);
  });

  it("navigates to search when clicking on search link", () => {
    renderWithProviders();
    openNavigation();
    clickNavLink("Search");
    expect(screen.getByText("Zoeken")).toBeInTheDocument();
  });
});
