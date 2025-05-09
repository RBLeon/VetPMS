import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../AppRoutes";
import { vi } from "vitest";

// Mock the components
vi.mock("../features/auth/LoginPage", () => ({
  LoginPage: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock("../features/role-selection/RoleSelectionPage", () => ({
  RoleSelectionPage: () => (
    <div data-testid="role-selection-page">Role Selection Page</div>
  ),
}));

vi.mock("../components/layout/AppLayout", () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

vi.mock("../components/auth/ProtectedRouteComponent", () => ({
  ProtectedRouteComponent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

describe("AppRoutes", () => {
  it("renders login page at /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("renders role selection page at /role-selection", () => {
    render(
      <MemoryRouter initialEntries={["/role-selection"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId("role-selection-page")).toBeInTheDocument();
  });

  it("renders protected route wrapper for authenticated routes", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByTestId("protected-route")).toBeInTheDocument();
  });
});
