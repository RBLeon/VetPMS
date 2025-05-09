import { render, screen, fireEvent } from "@testing-library/react";
import { ContextAwareNavigation } from "../ContextAwareNavigation";
import { useRole } from "../../../lib/context/RoleContext";
import { useAuth } from "../../../lib/context/AuthContext";
import { MemoryRouter } from "react-router-dom";

// Mock the hooks
jest.mock("../../../lib/context/RoleContext");
jest.mock("../../../lib/context/AuthContext");

describe("ContextAwareNavigation", () => {
  const mockQuickActions = [
    {
      title: "New Appointment",
      href: "/appointments/new",
      icon: "Calendar",
      color: "bg-blue-100",
    },
    {
      title: "New Client",
      href: "/clients/new",
      icon: "Users",
      color: "bg-teal-100",
    },
  ];

  beforeEach(() => {
    (useRole as jest.Mock).mockReturnValue({
      roleConfig: {
        quickActions: mockQuickActions,
      },
    });
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: "Test User" },
    });
  });

  it("renders quick actions button", () => {
    render(
      <MemoryRouter>
        <ContextAwareNavigation />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /plus/i })).toBeInTheDocument();
  });

  it("shows quick actions menu when plus button is clicked", () => {
    render(
      <MemoryRouter>
        <ContextAwareNavigation />
      </MemoryRouter>
    );

    const plusButton = screen.getByRole("button", { name: /plus/i });
    fireEvent.click(plusButton);

    expect(screen.getByText("New Appointment")).toBeInTheDocument();
    expect(screen.getByText("New Client")).toBeInTheDocument();
  });

  it("navigates to correct route when quick action is clicked", () => {
    render(
      <MemoryRouter>
        <ContextAwareNavigation />
      </MemoryRouter>
    );

    const plusButton = screen.getByRole("button", { name: /plus/i });
    fireEvent.click(plusButton);

    const appointmentAction = screen.getByText("New Appointment");
    fireEvent.click(appointmentAction);

    // Check if navigation occurred
    expect(window.location.pathname).toBe("/appointments/new");
  });

  it("closes quick actions menu when close button is clicked", () => {
    render(
      <MemoryRouter>
        <ContextAwareNavigation />
      </MemoryRouter>
    );

    // Open quick actions
    const plusButton = screen.getByRole("button", { name: /plus/i });
    fireEvent.click(plusButton);

    // Close quick actions
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Check if menu is closed
    expect(screen.queryByText("New Appointment")).not.toBeInTheDocument();
  });
});
