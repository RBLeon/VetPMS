import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrescriptionForm } from "../PrescriptionForm";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("PrescriptionForm", () => {
  const mockOnAdd = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
    mockOnRemove.mockClear();
  });

  it("renders form with required fields", () => {
    render(<PrescriptionForm onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    expect(screen.getByLabelText("Medicijn")).toBeInTheDocument();
    expect(screen.getByLabelText("Dosering")).toBeInTheDocument();
    expect(screen.getByLabelText("Frequentie")).toBeInTheDocument();
    expect(screen.getByLabelText("Duur")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Voorschrift Toevoegen" })
    ).toBeInTheDocument();
  });

  it("submits form with required data", async () => {
    const user = userEvent.setup();
    render(<PrescriptionForm onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    await user.type(screen.getByLabelText("Medicijn"), "Amoxicilline");
    await user.type(screen.getByLabelText("Dosering"), "500mg");
    await user.type(screen.getByLabelText("Duur"), "7 dagen");

    await user.click(
      screen.getByRole("button", { name: "Voorschrift Toevoegen" })
    );

    expect(mockOnAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        medicationName: "Amoxicilline",
        dosage: "500mg",
        frequency: "DAILY",
        duration: "7 dagen",
      })
    );
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    render(<PrescriptionForm onAdd={mockOnAdd} onRemove={mockOnRemove} />);

    await user.click(screen.getByRole("button", { name: "Verwijderen" }));
    expect(mockOnRemove).toHaveBeenCalled();
  });
});
