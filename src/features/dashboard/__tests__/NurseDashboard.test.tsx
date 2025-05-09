import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { NurseDashboard } from "../NurseDashboard";
import { useAppointments } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { usePatients } from "@/lib/hooks/useApi";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  useAppointments: vi.fn(),
  usePatients: vi.fn(),
}));

vi.mock("@/lib/hooks/useMedicalRecords", () => ({
  useMedicalRecords: vi.fn(),
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
    status: "in-progress",
    notes: "Regular checkup",
  },
  {
    id: "2",
    patientId: "2",
    clientId: "2",
    date: new Date().toISOString(),
    time: "10:00",
    type: "surgery",
    status: "post-op",
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
    vitals: {
      temperature: 38.5,
      heartRate: 80,
      respiratoryRate: 20,
      weight: 25.5,
    },
  },
  {
    id: "2",
    patientId: "2",
    date: new Date().toISOString(),
    diagnosis: "Spay surgery",
    treatment: "Surgery completed successfully",
    notes: "Recovery going well",
    vitals: {
      temperature: 38.2,
      heartRate: 85,
      respiratoryRate: 22,
      weight: 4.5,
    },
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

describe("NurseDashboard", () => {
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
  });

  it("renders the dashboard with all sections", () => {
    render(<NurseDashboard />);

    // Check for main sections
    expect(screen.getByText("Treatment Schedule")).toBeInTheDocument();
    expect(screen.getByText("Patient Monitoring")).toBeInTheDocument();
    expect(screen.getByText("Clinical Tasks")).toBeInTheDocument();
    expect(screen.getByText("Patient Queue")).toBeInTheDocument();
    expect(screen.getByText("Quick Stats")).toBeInTheDocument();
  });

  it("displays treatment schedule correctly", () => {
    render(<NurseDashboard />);

    // Check for treatment items
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("Luna")).toBeInTheDocument();
    expect(screen.getByText("Regular checkup")).toBeInTheDocument();
    expect(screen.getByText("Post-op care")).toBeInTheDocument();
  });

  it("shows patient monitoring with vital signs", () => {
    render(<NurseDashboard />);

    // Check for monitoring items
    const monitoringItems = screen.getAllByTestId("monitoring-item");
    expect(monitoringItems).toHaveLength(2);

    // Check for vital signs
    expect(screen.getByText("38.5°C")).toBeInTheDocument();
    expect(screen.getByText("80 bpm")).toBeInTheDocument();
    expect(screen.getByText("20 rpm")).toBeInTheDocument();
  });

  it("displays clinical tasks with priority", () => {
    render(<NurseDashboard />);

    // Check for task items
    expect(screen.getByText("Medication Administration")).toBeInTheDocument();
    expect(screen.getByText("Sample Collection")).toBeInTheDocument();

    // Check for priority indicators
    expect(screen.getByText("High Priority")).toBeInTheDocument();
  });

  it("shows patient queue with preparation status", () => {
    render(<NurseDashboard />);

    // Check for queue items
    const queueItems = screen.getAllByTestId("queue-item");
    expect(queueItems).toHaveLength(1);

    // Check for preparation status
    expect(screen.getByText("Ready for Exam")).toBeInTheDocument();
  });

  it("displays quick stats with correct metrics", () => {
    render(<NurseDashboard />);

    // Check for stat cards
    expect(screen.getByText("Treatments Completed")).toBeInTheDocument();
    expect(screen.getByText("Average Recovery Time")).toBeInTheDocument();
    expect(screen.getByText("Patient Satisfaction")).toBeInTheDocument();

    // Check for metric values
    expect(screen.getByText("5")).toBeInTheDocument(); // Treatments completed
    expect(screen.getByText("45 min")).toBeInTheDocument(); // Avg recovery time
    expect(screen.getByText("95%")).toBeInTheDocument(); // Patient satisfaction
  });

  it("handles loading states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<NurseDashboard />);

    // Check for loading indicators
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(5);
  });

  it("handles error states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch appointments"),
    });

    render(<NurseDashboard />);

    // Check for error message
    expect(
      screen.getByText("Failed to fetch appointments")
    ).toBeInTheDocument();
  });

  it("allows updating vital signs", async () => {
    render(<NurseDashboard />);

    // Click update vitals button
    const updateButtons = screen.getAllByText("Update Vitals");
    await userEvent.click(updateButtons[0]);

    // Check if vitals form opens
    expect(screen.getByText("Update Vital Signs")).toBeInTheDocument();
    expect(screen.getByLabelText("Temperature")).toBeInTheDocument();
    expect(screen.getByLabelText("Heart Rate")).toBeInTheDocument();
  });

  it("allows marking treatment as completed", async () => {
    render(<NurseDashboard />);

    // Click complete button
    const completeButtons = screen.getAllByText("Complete");
    await userEvent.click(completeButtons[0]);

    // Check if status is updated
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
