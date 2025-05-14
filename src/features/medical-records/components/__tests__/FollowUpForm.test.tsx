import { render, screen, fireEvent } from "@testing-library/react";
import { FollowUpForm } from "../FollowUpForm";

describe("FollowUpForm", () => {
  const mockRecordDate = "2024-03-20";

  it("renders the form with initial values", () => {
    render(<FollowUpForm recordDate={mockRecordDate} />);

    expect(screen.getByText("Nieuwe Controle Afspraak")).toBeInTheDocument();
    expect(screen.getByLabelText("Datum")).toHaveValue("2024-03-20");
    expect(screen.getByLabelText("Tijd")).toHaveValue("09:00");
  });

  it("allows form submission", () => {
    render(<FollowUpForm recordDate={mockRecordDate} />);

    const dateInput = screen.getByLabelText("Datum");
    const timeInput = screen.getByLabelText("Tijd");
    const notesInput = screen.getByLabelText("Notities");
    const submitButton = screen.getByRole("button", { name: "Inplannen" });

    fireEvent.change(dateInput, { target: { value: "2024-03-21" } });
    fireEvent.change(timeInput, { target: { value: "10:00" } });
    fireEvent.change(notesInput, { target: { value: "Test notities" } });
    fireEvent.click(submitButton);

    // TODO: Add assertions for form submission when implemented
  });
});
