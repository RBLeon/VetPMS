import { render, screen, fireEvent } from "@testing-library/react";
import { AppointmentForm } from "../AppointmentForm";
import { AppointmentTypeConfig } from "../../types/appointment";
import { describe, it, expect, vi } from "vitest";

const mockAppointmentTypes: AppointmentTypeConfig[] = [
  {
    id: "1",
    name: "Controle",
    color: "#22c55e",
    defaultDuration: 30,
  },
  {
    id: "2",
    name: "Operatie",
    color: "#ef4444",
    defaultDuration: 90,
  },
];

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();

describe("AppointmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <AppointmentForm
        appointmentTypes={mockAppointmentTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );
    const cancelButton = screen.getByRole("button", { name: /annuleren/i });
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("renders in edit mode with different button text", () => {
    render(
      <AppointmentForm
        appointmentTypes={mockAppointmentTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        mode="edit"
      />
    );
    expect(
      screen.getByRole("button", { name: /bijwerken/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /afspraak plannen/i })
    ).not.toBeInTheDocument();
  });
});
