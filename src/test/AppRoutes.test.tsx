import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AppRoutes } from "../AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/context/AuthContext";
import { RoleProvider } from "@/lib/context/RoleContext";
import React from "react";

// Mock the auth context
const useAuthMock = vi.fn();
useAuthMock.mockImplementation(() => ({
  user: null,
  isLoading: false,
  error: null,
  login: vi.fn(),
  logout: vi.fn(),
}));
vi.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>
          <BrowserRouter>{ui}</BrowserRouter>
        </RoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Mock the components
vi.mock("@/pages/auth/LoginPage", () => ({
  LoginPage: () => <div data-testid="login-page">Inlogpagina</div>,
}));

vi.mock("@/pages/auth/RegisterPage", () => ({
  RegisterPage: () => <div data-testid="register-page">Registratiepagina</div>,
}));

vi.mock("@/pages/auth/ForgotPasswordPage", () => ({
  ForgotPasswordPage: () => (
    <div data-testid="forgot-password-page">Wachtwoord vergeten pagina</div>
  ),
}));

vi.mock("@/pages/auth/ResetPasswordPage", () => ({
  ResetPasswordPage: () => (
    <div data-testid="reset-password-page">Wachtwoord resetten pagina</div>
  ),
}));

vi.mock("@/components/layout/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

vi.mock("../components/auth/ProtectedRouteComponent", () => ({
  ProtectedRouteComponent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));

describe("AppRoutes", () => {
  it("renders login page at /login", async () => {
    window.history.pushState({}, "", "/login");
    renderWithProviders(<AppRoutes />);

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });

  it("renders protected route wrapper for authenticated routes", async () => {
    // Mock useAuth to return a user
    useAuthMock.mockImplementation(() => ({
      user: { id: "1", name: "Test User" },
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    }));

    window.history.pushState({}, "", "/");
    renderWithProviders(<AppRoutes />);

    await waitFor(() => {
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
    });

    useAuthMock.mockReset();
  });
});
