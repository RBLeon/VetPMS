import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { VeterinarianDashboard } from "../VeterinarianDashboard";
import { useAppointments } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { usePatients } from "@/lib/hooks/useApi";
import { useClients } from "@/lib/hooks/useClients";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  useAppointments: vi.fn(),
  usePatients: vi.fn(),
}));

vi.mock("@/lib/hooks/useMedicalRecords", () => ({
  useMedicalRecords: vi.fn(),
}));

vi.mock("@/lib/hooks/useClients", () => ({
  useClients: vi.fn(),
}));

// Mock data
const mockAppointments = [
  {
    id: "1",
    patientId: "1",
    clientId: "1",
    date: new Date().toISOString(),
    time: "09:00",
    type: "checkup",
    status: "scheduled",
    notes: "Regular checkup",
  },
  {
    id: "2",
    patientId: "2",
    clientId: "2",
    date: new Date().toISOString(),
    time: "10:00",
    type: "surgery",
    status: "in-progress",
    notes: "Spay surgery",
  },
];

const mockMedicalRecords = [
  {
    id: "1",
    patientId: "1",
    date: new Date().toISOString(),
    diagnosis: "Healthy",
    treatment: "Regular checkup completed",
    notes: "All vitals normal",
  },
  {
    id: "2",
    patientId: "2",
    date: new Date().toISOString(),
    diagnosis: "Spay surgery",
    treatment: "Surgery completed successfully",
    notes: "Recovery going well",
  },
];

const mockPatients = [
  {
    id: "1",
    name: "Max",
    species: "dog",
    breed: "Golden Retriever",
    dateOfBirth: "2020-01-01",
  },
  {
    id: "2",
    name: "Luna",
    species: "cat",
    breed: "Siamese",
    dateOfBirth: "2021-03-15",
  },
];

const mockClients = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "123-456-7890",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "098-765-4321",
  },
];

describe("VeterinarianDashboard", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (useAppointments as any).mockReturnValue({
      data: mockAppointments,
      isLoading: false,
      error: null,
    });

    (useMedicalRecords as any).mockReturnValue({
      data: mockMedicalRecords,
      isLoading: false,
      error: null,
    });

    (usePatients as any).mockReturnValue({
      data: mockPatients,
      isLoading: false,
      error: null,
    });

    (useClients as any).mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null,
    });
  });

  it("renders the dashboard with all sections", () => {
    render(<VeterinarianDashboard />);

    // Check for main sections
    expect(screen.getByText("Today's Appointments")).toBeInTheDocument();
    expect(screen.getByText("Patient Queue")).toBeInTheDocument();
    expect(screen.getByText("Recent Medical Records")).toBeInTheDocument();
    expect(screen.getByText("Clinical Tasks")).toBeInTheDocument();
    expect(screen.getByText("Quick Stats")).toBeInTheDocument();
  });

  it("displays today's appointments correctly", () => {
    render(<VeterinarianDashboard />);

    // Check for appointment details
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("Luna")).toBeInTheDocument();
    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("shows patient queue with priority indicators", () => {
    render(<VeterinarianDashboard />);

    // Check for queue items
    const queueItems = screen.getAllByTestId("queue-item");
    expect(queueItems).toHaveLength(2);

    // Check for priority indicators
    expect(screen.getByText("High Priority")).toBeInTheDocument();
  });

  it("displays recent medical records with quick actions", () => {
    render(<VeterinarianDashboard />);

    // Check for medical record details
    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.getByText("Spay surgery")).toBeInTheDocument();

    // Check for quick action buttons
    expect(screen.getAllByText("View Details")).toHaveLength(2);
  });

  it("shows clinical tasks with status indicators", () => {
    render(<VeterinarianDashboard />);

    // Check for task items
    expect(screen.getByText("Lab Results Pending")).toBeInTheDocument();
    expect(screen.getByText("Prescriptions to Review")).toBeInTheDocument();

    // Check for status indicators
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });

  it("displays quick stats with correct metrics", () => {
    render(<VeterinarianDashboard />);

    // Check for stat cards
    expect(screen.getByText("Patients Seen Today")).toBeInTheDocument();
    expect(screen.getByText("Average Consultation Time")).toBeInTheDocument();
    expect(screen.getByText("Follow-up Rate")).toBeInTheDocument();

    // Check for metric values
    expect(screen.getByText("2")).toBeInTheDocument(); // Patients seen
    expect(screen.getByText("30 min")).toBeInTheDocument(); // Avg consultation time
    expect(screen.getByText("85%")).toBeInTheDocument(); // Follow-up rate
  });

  it("handles loading states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<VeterinarianDashboard />);

    // Check for loading indicators
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(5);
  });

  it("handles error states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch appointments"),
    });

    render(<VeterinarianDashboard />);

    // Check for error message
    expect(
      screen.getByText("Failed to fetch appointments")
    ).toBeInTheDocument();
  });

  it("allows starting an appointment", async () => {
    render(<VeterinarianDashboard />);

    // Click start appointment button
    const startButtons = screen.getAllByText("Start Appointment");
    await userEvent.click(startButtons[0]);

    // Check if appointment status is updated
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("allows viewing medical record details", async () => {
    render(<VeterinarianDashboard />);

    // Click view details button
    const viewButtons = screen.getAllByText("View Details");
    await userEvent.click(viewButtons[0]);

    // Check if modal opens with details
    expect(screen.getByText("Medical Record Details")).toBeInTheDocument();
    expect(screen.getByText("Diagnosis: Healthy")).toBeInTheDocument();
  });
});
