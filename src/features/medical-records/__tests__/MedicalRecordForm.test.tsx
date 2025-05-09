import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { MedicalRecordForm } from "../MedicalRecordForm";
import { usePatients, useClients } from "@/lib/hooks/useApi";
import { QueryObserverSuccessResult } from "@tanstack/react-query";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  usePatients: vi.fn(),
  useClients: vi.fn(),
  useCreateMedicalRecord: vi.fn(),
}));

describe("MedicalRecordForm", () => {
  beforeEach(() => {
    // Mock the hooks' return values
    (usePatients as any).mockReturnValue({
      data: [
        {
          id: "1",
          name: "Test Patient",
          species: "Dog",
          breed: "Labrador",
          age: 5,
          weight: 20,
          lastVisit: "2024-02-01",
          dateOfBirth: "2019-01-01",
          clientId: "1",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      status: "success",
    } as QueryObserverSuccessResult<any[], Error>);

    (useClients as any).mockReturnValue({
      data: [
        {
          id: "1",
          name: "Test Client",
          email: "test@example.com",
          phone: "123-456-7890",
          address: "123 Test St",
          createdAt: "2024-01-01",
          lastVisit: "2024-02-01",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      status: "success",
    } as QueryObserverSuccessResult<any[], Error>);
  });

  it("renders the form correctly", () => {
    render(<MedicalRecordForm patientId="1" />);

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<MedicalRecordForm patientId="1" />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveButton);

    expect(await screen.findByText(/date is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/type is required/i)).toBeInTheDocument();
  });

  it("renders the form with patient information", async () => {
    render(<MedicalRecordForm patientId="1" />);
    await waitFor(() => {
      expect(screen.getByText("Test Patient")).toBeInTheDocument();
      expect(screen.getByText("Dog")).toBeInTheDocument();
      expect(screen.getByText("Labrador")).toBeInTheDocument();
    });
  });

  it("allows adding vital signs", async () => {
    render(<MedicalRecordForm patientId="1" />);
    const addVitalSignsButton = screen.getByText("Add Vital Signs");
    await userEvent.click(addVitalSignsButton);

    const temperatureInput = screen.getByLabelText("Temperature (°C)");
    const heartRateInput = screen.getByLabelText("Heart Rate (bpm)");
    const respiratoryRateInput = screen.getByLabelText(
      "Respiratory Rate (rpm)"
    );
    const weightInput = screen.getByLabelText("Weight (kg)");

    await userEvent.type(temperatureInput, "38.5");
    await userEvent.type(heartRateInput, "110");
    await userEvent.type(respiratoryRateInput, "25");
    await userEvent.type(weightInput, "16.0");

    await waitFor(() => {
      expect(temperatureInput).toHaveValue(38.5);
      expect(heartRateInput).toHaveValue(110);
      expect(respiratoryRateInput).toHaveValue(25);
      expect(weightInput).toHaveValue(16.0);
    });
  });

  it("allows adding prescriptions", async () => {
    render(<MedicalRecordForm patientId="1" />);
    const addPrescriptionButton = screen.getByText("Add Prescription");
    await userEvent.click(addPrescriptionButton);

    const medicationInput = screen.getByLabelText("Medication");
    const dosageInput = screen.getByLabelText("Dosage");
    const frequencyInput = screen.getByLabelText("Frequency");
    const durationInput = screen.getByLabelText("Duration");

    await userEvent.type(medicationInput, "Amoxicillin");
    await userEvent.type(dosageInput, "250mg");
    await userEvent.type(frequencyInput, "Twice daily");
    await userEvent.type(durationInput, "7 days");

    const addButton = screen.getByText("Add Prescription");
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Amoxicillin - 250mg")).toBeInTheDocument();
      expect(screen.getByText("Twice daily for 7 days")).toBeInTheDocument();
    });
  });

  it("allows file uploads", async () => {
    render(<MedicalRecordForm patientId="1" />);
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const fileInput = screen.getByLabelText("Upload Files");

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });
  });

  it("allows scheduling follow-up", async () => {
    render(<MedicalRecordForm patientId="1" />);
    const scheduleButton = screen.getByText("Schedule Follow-up");
    await userEvent.click(scheduleButton);

    const dateInput = screen.getByLabelText("Follow-up Date");
    const notesInput = screen.getByLabelText("Notes");

    await userEvent.type(dateInput, "2024-04-15");
    await userEvent.type(notesInput, "Check progress");

    const scheduleConfirmButton = screen.getByText("Schedule");
    await userEvent.click(scheduleConfirmButton);

    await waitFor(() => {
      expect(screen.getByText("Apr 15, 2024")).toBeInTheDocument();
      expect(screen.getByText("Check progress")).toBeInTheDocument();
    });
  });

  it("handles form submission", async () => {
    const { useCreateMedicalRecord } = await import("@/lib/hooks/useApi");
    const mockMutateAsync = vi.fn();
    (useCreateMedicalRecord as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    render(<MedicalRecordForm patientId="1" />);

    await userEvent.type(
      screen.getByLabelText("Chief Complaint"),
      "Test complaint"
    );
    await userEvent.type(screen.getByLabelText("Diagnosis"), "Test diagnosis");
    await userEvent.type(screen.getByLabelText("Treatment Plan"), "Test plan");

    const submitButton = screen.getByText("Save Record");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  it("handles navigation", async () => {
    const mockNavigate = vi.fn();
    vi.mock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    render(<MedicalRecordForm patientId="1" />);
    const backButton = screen.getByText("Back to Records");
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/patients/1/records");
  });
});
