import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FollowUpForm } from "../FollowUpForm";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("FollowUpForm", () => {
  const mockOnSchedule = vi.fn();
  const mockOnCancel = vi.fn();
  const recordDate = "2024-03-20";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with required fields", () => {
    render(
      <FollowUpForm
        recordDate={recordDate}
        onSchedule={mockOnSchedule}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/Vervolgdatum/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notities/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Inplannen/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Annuleren/i })
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(
      <FollowUpForm
        recordDate={recordDate}
        onSchedule={mockOnSchedule}
        onCancel={mockOnCancel}
      />
    );

    const dateInput = screen.getByTestId("follow-up-date");
    const notesInput = screen.getByTestId("follow-up-notes");
    const submitButton = screen.getByTestId("submit-button");

    await user.type(dateInput, "2024-03-21");
    await user.type(notesInput, "Test notities");
    await user.click(submitButton);

    expect(mockOnSchedule).toHaveBeenCalledWith({
      followUpDate: "2024-03-21",
      followUpNotes: "Test notities",
    });
  });

  it("handles form cancellation", async () => {
    const user = userEvent.setup();
    render(
      <FollowUpForm
        recordDate={recordDate}
        onSchedule={mockOnSchedule}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByTestId("cancel-button");
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
