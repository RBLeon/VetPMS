import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../AppRoutes";
import { AuthProvider } from "../lib/context/AuthContext";
import { RoleProvider } from "../lib/context/RoleContext";

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>{component}</RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("AppRoutes", () => {
  it("renders login page at /login", () => {
    renderWithRouter(<AppRoutes />);
    expect(
      screen.getByRole("button", { name: /inloggen/i })
    ).toBeInTheDocument();
  });

  it("renders protected route wrapper for authenticated routes", () => {
    renderWithRouter(<AppRoutes />);
    expect(
      screen.getByText(/voer uw gegevens in om in te loggen/i)
    ).toBeInTheDocument();
  });
});
