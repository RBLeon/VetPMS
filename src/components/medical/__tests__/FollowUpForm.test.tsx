import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FollowUpForm } from "../FollowUpForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

describe("FollowUpForm", () => {
  const mockOnSubmit = vi.fn();
  const mockPatient = {
    id: "1",
    name: "Max",
    species: "HOND",
    breed: "Labrador",
  };

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <FollowUpForm patient={mockPatient} onSubmit={mockOnSubmit} />
      </QueryClientProvider>
    );
  };

  it("renders the follow-up form with all required fields", () => {
    renderComponent();

    expect(screen.getByLabelText("Datum")).toBeInTheDocument();
    expect(screen.getByLabelText("Tijd")).toBeInTheDocument();
    expect(screen.getByLabelText("Notities")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Inplannen" })
    ).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderComponent();

    const submitButton = screen.getByRole("button", { name: "Inplannen" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Datum is verplicht")).toBeInTheDocument();
      expect(screen.getByText("Tijd is verplicht")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    renderComponent();

    const dateInput = screen.getByLabelText("Datum");
    const timeInput = screen.getByLabelText("Tijd");
    const notesInput = screen.getByLabelText("Notities");

    fireEvent.change(dateInput, { target: { value: "2024-04-01" } });
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    fireEvent.change(notesInput, {
      target: { value: "Controle na behandeling" },
    });

    const submitButton = screen.getByRole("button", { name: "Inplannen" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        date: "2024-04-01",
        time: "14:30",
        notes: "Controle na behandeling",
        patientId: "1",
      });
    });
  });

  it("displays patient information", () => {
    renderComponent();

    expect(
      screen.getByText((_, element) => {
        return element?.textContent === "Max - Labrador (HOND)";
      })
    ).toBeInTheDocument();
  });

  it("handles form cancellation", () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", { name: "Annuleren" });
    fireEvent.click(cancelButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
