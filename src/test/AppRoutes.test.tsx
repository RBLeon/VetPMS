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
  it("renders role selection page by default", () => {
    renderWithRouter(<AppRoutes />);
    expect(screen.getByText("Selecteer Uw Rol")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /selecteer\s+receptioniste/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /selecteer\s+dierenarts/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /selecteer\s+verpleegkundige/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /selecteer\s+manager/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /selecteer\s+ceo/i })
    ).toBeInTheDocument();
  });
});
