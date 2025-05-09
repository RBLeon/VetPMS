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

describe("MedicalRecordsList", () => {
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

  it("renders medical records list", () => {
    render(<MedicalRecordsList patientId="1" />);

    expect(screen.getByText("Medical Records")).toBeInTheDocument();
    expect(screen.getByText("Test diagnosis")).toBeInTheDocument();
    expect(screen.getByText("Test treatment")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useMedicalRecords as jest.Mock).mockReturnValue({
      ...mockUseMedicalRecords,
      isLoading: true,
    });

    render(<MedicalRecordsList patientId="1" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    (useMedicalRecords as jest.Mock).mockReturnValue({
      ...mockUseMedicalRecords,
      error: "Test error",
    });

    render(<MedicalRecordsList patientId="1" />);

    expect(screen.getByText("Error: Test error")).toBeInTheDocument();
  });

  it("opens add medical record modal when add button is clicked", () => {
    render(<MedicalRecordsList patientId="1" />);

    const addButton = screen.getByText("Add Medical Record");
    fireEvent.click(addButton);

    expect(screen.getByText("Add Medical Record")).toBeInTheDocument();
    expect(screen.getByLabelText("Diagnosis")).toBeInTheDocument();
    expect(screen.getByLabelText("Treatment")).toBeInTheDocument();
  });

  it("opens edit medical record modal when edit button is clicked", () => {
    render(<MedicalRecordsList patientId="1" />);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(screen.getByText("Edit Medical Record")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test diagnosis")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test treatment")).toBeInTheDocument();
  });

  it("calls deleteMedicalRecord when delete button is clicked", async () => {
    render(<MedicalRecordsList patientId="1" />);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockUseMedicalRecords.deleteMedicalRecord).toHaveBeenCalledWith(
        "1"
      );
    });
  });

  it("filters medical records by date range", () => {
    render(<MedicalRecordsList patientId="1" />);

    const startDateInput = screen.getByLabelText("Start Date");
    const endDateInput = screen.getByLabelText("End Date");

    fireEvent.change(startDateInput, { target: { value: "2024-03-19" } });
    fireEvent.change(endDateInput, { target: { value: "2024-03-21" } });

    expect(screen.getByText("Test diagnosis")).toBeInTheDocument();
  });

  it("filters medical records by status", () => {
    render(<MedicalRecordsList patientId="1" />);

    const statusSelect = screen.getByLabelText("Status");
    fireEvent.change(statusSelect, { target: { value: "active" } });

    expect(screen.getByText("Test diagnosis")).toBeInTheDocument();
  });

  describe("Date Validation", () => {
    it("should not allow follow-up date before record date in add form", async () => {
      render(<MedicalRecordsList patientId="1" />);

      // Open add modal
      const addButton = screen.getByText("Add Medical Record");
      fireEvent.click(addButton);

      // Fill in the form
      const dateInput = screen.getByLabelText("Date");
      const followUpDateInput = screen.getByLabelText("Follow-up Date");
      const diagnosisInput = screen.getByLabelText("Diagnosis");
      const treatmentInput = screen.getByLabelText("Treatment");
      const statusSelect = screen.getByLabelText("Status");

      // Set record date to tomorrow
      const tomorrow = dayjs().add(1, "day");
      fireEvent.change(dateInput, {
        target: { value: tomorrow.format("YYYY-MM-DD") },
      });

      // Set follow-up date to today (before record date)
      const today = dayjs();
      fireEvent.change(followUpDateInput, {
        target: { value: today.format("YYYY-MM-DD") },
      });

      // Fill in other required fields
      fireEvent.change(diagnosisInput, { target: { value: "Test diagnosis" } });
      fireEvent.change(treatmentInput, { target: { value: "Test treatment" } });
      fireEvent.change(statusSelect, { target: { value: "active" } });

      // Try to submit the form
      const submitButton = screen.getByText("Add");
      fireEvent.click(submitButton);

      // Check for validation error
      await waitFor(() => {
        expect(
          screen.getByText("Follow-up date must be after the record date")
        ).toBeInTheDocument();
      });
    });

    it("should not allow follow-up date before record date in edit form", async () => {
      render(<MedicalRecordsList patientId="1" />);

      // Open edit modal
      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);

      // Get form inputs
      const dateInput = screen.getByLabelText("Date");
      const followUpDateInput = screen.getByLabelText("Follow-up Date");

      // Set record date to tomorrow
      const tomorrow = dayjs().add(1, "day");
      fireEvent.change(dateInput, {
        target: { value: tomorrow.format("YYYY-MM-DD") },
      });

      // Set follow-up date to today (before record date)
      const today = dayjs();
      fireEvent.change(followUpDateInput, {
        target: { value: today.format("YYYY-MM-DD") },
      });

      // Try to submit the form
      const submitButton = screen.getByText("Update");
      fireEvent.click(submitButton);

      // Check for validation error
      await waitFor(() => {
        expect(
          screen.getByText("Follow-up date must be after the record date")
        ).toBeInTheDocument();
      });
    });

    it("should allow follow-up date after record date in add form", async () => {
      render(<MedicalRecordsList patientId="1" />);

      // Open add modal
      const addButton = screen.getByText("Add Medical Record");
      fireEvent.click(addButton);

      // Fill in the form
      const dateInput = screen.getByLabelText("Date");
      const followUpDateInput = screen.getByLabelText("Follow-up Date");
      const diagnosisInput = screen.getByLabelText("Diagnosis");
      const treatmentInput = screen.getByLabelText("Treatment");
      const statusSelect = screen.getByLabelText("Status");

      // Set record date to today
      const today = dayjs();
      fireEvent.change(dateInput, {
        target: { value: today.format("YYYY-MM-DD") },
      });

      // Set follow-up date to tomorrow (after record date)
      const tomorrow = dayjs().add(1, "day");
      fireEvent.change(followUpDateInput, {
        target: { value: tomorrow.format("YYYY-MM-DD") },
      });

      // Fill in other required fields
      fireEvent.change(diagnosisInput, { target: { value: "Test diagnosis" } });
      fireEvent.change(treatmentInput, { target: { value: "Test treatment" } });
      fireEvent.change(statusSelect, { target: { value: "active" } });

      // Try to submit the form
      const submitButton = screen.getByText("Add");
      fireEvent.click(submitButton);

      // Check that no validation error is shown
      await waitFor(() => {
        expect(
          screen.queryByText("Follow-up date must be after the record date")
        ).not.toBeInTheDocument();
      });
    });

    it("should allow follow-up date after record date in edit form", async () => {
      render(<MedicalRecordsList patientId="1" />);

      // Open edit modal
      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);

      // Get form inputs
      const dateInput = screen.getByLabelText("Date");
      const followUpDateInput = screen.getByLabelText("Follow-up Date");

      // Set record date to today
      const today = dayjs();
      fireEvent.change(dateInput, {
        target: { value: today.format("YYYY-MM-DD") },
      });

      // Set follow-up date to tomorrow (after record date)
      const tomorrow = dayjs().add(1, "day");
      fireEvent.change(followUpDateInput, {
        target: { value: tomorrow.format("YYYY-MM-DD") },
      });

      // Try to submit the form
      const submitButton = screen.getByText("Update");
      fireEvent.click(submitButton);

      // Check that no validation error is shown
      await waitFor(() => {
        expect(
          screen.queryByText("Follow-up date must be after the record date")
        ).not.toBeInTheDocument();
      });
    });
  });
});
