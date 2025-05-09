import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MedicalRecordsList } from "../MedicalRecordsList";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { MedicalRecord } from "@/types/medical";
import dayjs from "dayjs";

// Mock the hooks
jest.mock("@/hooks/useMedicalRecords");
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "1", role: "veterinarian" },
    isAuthenticated: true,
  }),
}));

describe("MedicalRecordsList Integration", () => {
  const mockMedicalRecords: MedicalRecord[] = [
    {
      id: "1",
      patientId: "1",
      veterinarianId: "1",
      date: "2024-03-20",
      diagnosis: "Test diagnosis",
      treatment: "Test treatment",
      notes: "Test notes",
      followUpDate: "2024-03-27",
      status: "active",
      createdAt: "2024-03-20T10:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
    },
  ];

  const mockUseMedicalRecords = {
    medicalRecords: mockMedicalRecords,
    isLoading: false,
    error: null,
    addMedicalRecord: jest.fn(),
    updateMedicalRecord: jest.fn(),
    deleteMedicalRecord: jest.fn(),
  };

  beforeEach(() => {
    (useMedicalRecords as jest.Mock).mockReturnValue(mockUseMedicalRecords);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should complete the full CRUD flow", async () => {
    render(<MedicalRecordsList patientId="1" />);

    // 1. Verify initial state
    expect(screen.getByText("Test diagnosis")).toBeInTheDocument();
    expect(screen.getByText("Test treatment")).toBeInTheDocument();

    // 2. Add a new record
    const addButton = screen.getByText("Add Medical Record");
    fireEvent.click(addButton);

    const today = dayjs();
    const tomorrow = dayjs().add(1, "day");

    // Fill in the add form
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: today.format("YYYY-MM-DD") },
    });
    fireEvent.change(screen.getByLabelText("Follow-up Date"), {
      target: { value: tomorrow.format("YYYY-MM-DD") },
    });
    fireEvent.change(screen.getByLabelText("Diagnosis"), {
      target: { value: "New diagnosis" },
    });
    fireEvent.change(screen.getByLabelText("Treatment"), {
      target: { value: "New treatment" },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "active" },
    });

    // Submit the add form
    fireEvent.click(screen.getByText("Add"));

    // Verify add was called
    await waitFor(() => {
      expect(mockUseMedicalRecords.addMedicalRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          diagnosis: "New diagnosis",
          treatment: "New treatment",
          status: "active",
        })
      );
    });

    // 3. Edit the record
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    // Fill in the edit form
    fireEvent.change(screen.getByLabelText("Diagnosis"), {
      target: { value: "Updated diagnosis" },
    });
    fireEvent.change(screen.getByLabelText("Treatment"), {
      target: { value: "Updated treatment" },
    });

    // Submit the edit form
    fireEvent.click(screen.getByText("Update"));

    // Verify update was called
    await waitFor(() => {
      expect(mockUseMedicalRecords.updateMedicalRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          diagnosis: "Updated diagnosis",
          treatment: "Updated treatment",
        })
      );
    });

    // 4. Delete the record
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByText("Yes");
    fireEvent.click(confirmButton);

    // Verify delete was called
    await waitFor(() => {
      expect(mockUseMedicalRecords.deleteMedicalRecord).toHaveBeenCalledWith(
        "1"
      );
    });
  });

  it("should handle errors gracefully", async () => {
    // Mock error states
    const errorMessage = "Failed to perform operation";
    (useMedicalRecords as jest.Mock).mockReturnValue({
      ...mockUseMedicalRecords,
      error: errorMessage,
    });

    render(<MedicalRecordsList patientId="1" />);

    // Verify error state is displayed
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();

    // Reset error state
    (useMedicalRecords as jest.Mock).mockReturnValue(mockUseMedicalRecords);

    // Verify component recovers
    expect(screen.getByText("Test diagnosis")).toBeInTheDocument();
  });

  it("should handle loading state", async () => {
    // Mock loading state
    (useMedicalRecords as jest.Mock).mockReturnValue({
      ...mockUseMedicalRecords,
      isLoading: true,
    });

    render(<MedicalRecordsList patientId="1" />);

    // Verify loading state is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Reset loading state
    (useMedicalRecords as jest.Mock).mockReturnValue(mockUseMedicalRecords);

    // Verify component recovers
    expect(screen.getByText("Test diagnosis")).toBeInTheDocument();
  });

  it("should filter records by date range and status", async () => {
    render(<MedicalRecordsList patientId="1" />);

    // Filter by date range
    const dateRangePicker = screen.getByRole("combobox", {
      name: /date range/i,
    });
    fireEvent.change(dateRangePicker, {
      target: { value: ["2024-03-19", "2024-03-21"] },
    });

    // Filter by status
    const statusSelect = screen.getByLabelText("Filter by status");
    fireEvent.change(statusSelect, { target: { value: "active" } });

    // Verify filtered records
    expect(screen.getByText("Test diagnosis")).toBeInTheDocument();
  });
});
