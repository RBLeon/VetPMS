import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MedicalRecordsList } from "../MedicalRecordsList";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";

// Mock the hooks
vi.mock("@/lib/hooks/useMedicalRecords", () => ({
  useMedicalRecords: vi.fn(),
}));

describe("MedicalRecordsList", () => {
  beforeEach(() => {
    // Mock the hooks' return values
    (useMedicalRecords as any).mockReturnValue({
      data: [
        {
          id: "1",
          patientId: "1",
          date: "2024-02-01",
          type: "Check-up",
          notes: "Regular check-up",
          status: "Active",
          hasPrescription: true,
        },
        {
          id: "2",
          patientId: "1",
          date: "2024-02-02",
          type: "Vaccination",
          notes: "Annual vaccination",
          status: "Completed",
          hasPrescription: false,
        },
      ],
      isLoading: false,
    });
  });

  it("renders the list correctly", () => {
    render(<MedicalRecordsList patientId="1" />);

    expect(screen.getByText(/medical records/i)).toBeInTheDocument();
    expect(screen.getByText(/check-up/i)).toBeInTheDocument();
    expect(screen.getByText(/vaccination/i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useMedicalRecords as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<MedicalRecordsList patientId="1" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("filters records by status", async () => {
    render(<MedicalRecordsList patientId="1" />);

    const activeFilter = screen.getByRole("button", { name: /active/i });
    activeFilter.click();

    expect(screen.getByText(/check-up/i)).toBeInTheDocument();
    expect(screen.queryByText(/vaccination/i)).not.toBeInTheDocument();
  });

  it("renders the list with quick filters", async () => {
    render(<MedicalRecordsList patientId="1" />);
    await waitFor(() => {
      expect(screen.getByText("Medical Records")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.getByText("With Prescriptions")).toBeInTheDocument();
      expect(screen.getByText("With Attachments")).toBeInTheDocument();
    });
  });

  it("allows quick filtering with chips", async () => {
    render(<MedicalRecordsList patientId="1" />);
    await userEvent.click(screen.getByText("Active"));

    await waitFor(() => {
      expect(screen.getByText("Fever and lethargy")).toBeInTheDocument();
      expect(screen.queryByText("Annual check-up")).not.toBeInTheDocument();
    });
  });

  it("supports advanced search with natural language", async () => {
    render(<MedicalRecordsList patientId="1" />);
    const searchInput = screen.getByPlaceholderText("Search records...");
    await userEvent.type(searchInput, "fever");

    await waitFor(() => {
      expect(screen.getByText("Fever and lethargy")).toBeInTheDocument();
      expect(screen.queryByText("Annual check-up")).not.toBeInTheDocument();
    });
  });

  it("shows record preview on hover", async () => {
    render(<MedicalRecordsList patientId="1" />);
    const record = screen.getByText("Fever and lethargy");
    await userEvent.hover(record);

    await waitFor(() => {
      expect(
        screen.getByText("Diagnosis: Upper respiratory infection")
      ).toBeInTheDocument();
      expect(screen.getByText("Prescription: Yes")).toBeInTheDocument();
      expect(screen.getByText("Follow-up: Scheduled")).toBeInTheDocument();
    });
  });

  it("allows quick actions from the list", async () => {
    render(<MedicalRecordsList patientId="1" />);
    const record = screen.getByText("Fever and lethargy");
    await userEvent.hover(record);

    await waitFor(() => {
      expect(screen.getByText("View Details")).toBeInTheDocument();
      expect(screen.getByText("Edit Record")).toBeInTheDocument();
      expect(screen.getByText("Print Record")).toBeInTheDocument();
    });
  });

  it("supports timeline view", async () => {
    render(<MedicalRecordsList patientId="1" />);
    await userEvent.click(screen.getByText("Timeline View"));

    await waitFor(() => {
      expect(screen.getByText("March 2024")).toBeInTheDocument();
      expect(screen.getByText("February 2024")).toBeInTheDocument();
    });
  });

  it("allows bulk actions", async () => {
    render(<MedicalRecordsList patientId="1" />);
    const selectAll = screen.getByLabelText("Select all records");
    await userEvent.click(selectAll);

    await waitFor(() => {
      expect(screen.getByText("Export Selected")).toBeInTheDocument();
      expect(screen.getByText("Print Selected")).toBeInTheDocument();
    });
  });

  it("shows quick stats", async () => {
    render(<MedicalRecordsList patientId="1" />);
    await waitFor(() => {
      expect(screen.getByText("Total Records: 2")).toBeInTheDocument();
      expect(screen.getByText("Active: 1")).toBeInTheDocument();
      expect(screen.getByText("With Prescriptions: 1")).toBeInTheDocument();
    });
  });
});
