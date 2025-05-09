import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ReceptionistDashboard } from "../ReceptionistDashboard";
import { useAppointments } from "@/lib/hooks/useApi";
import { useClients } from "@/lib/hooks/useClients";
import { usePatients } from "@/lib/hooks/useApi";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  useAppointments: vi.fn(),
  usePatients: vi.fn(),
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
    status: "checked-in",
    notes: "Spay surgery",
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

describe("ReceptionistDashboard", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (useAppointments as any).mockReturnValue({
      data: mockAppointments,
      isLoading: false,
      error: null,
    });

    (useClients as any).mockReturnValue({
      data: mockClients,
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
    render(<ReceptionistDashboard />);

    // Check for main sections
    expect(screen.getByText("Today's Schedule")).toBeInTheDocument();
    expect(screen.getByText("Waiting Room")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Appointments")).toBeInTheDocument();
    expect(screen.getByText("Client Communications")).toBeInTheDocument();
    expect(screen.getByText("Quick Stats")).toBeInTheDocument();
  });

  it("displays today's schedule correctly", () => {
    render(<ReceptionistDashboard />);

    // Check for schedule items
    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("Luna")).toBeInTheDocument();
  });

  it("shows waiting room with check-in status", () => {
    render(<ReceptionistDashboard />);

    // Check for waiting room items
    const waitingItems = screen.getAllByTestId("waiting-item");
    expect(waitingItems).toHaveLength(1);

    // Check for check-in status
    expect(screen.getByText("Checked In")).toBeInTheDocument();
  });

  it("displays upcoming appointments with confirmation status", () => {
    render(<ReceptionistDashboard />);

    // Check for upcoming appointments
    expect(screen.getByText("Upcoming Appointments")).toBeInTheDocument();
    expect(screen.getByText("Needs Confirmation")).toBeInTheDocument();
  });

  it("shows client communications with pending items", () => {
    render(<ReceptionistDashboard />);

    // Check for communication items
    expect(screen.getByText("Pending Callbacks")).toBeInTheDocument();
    expect(screen.getByText("Appointment Confirmations")).toBeInTheDocument();
  });

  it("displays quick stats with correct metrics", () => {
    render(<ReceptionistDashboard />);

    // Check for stat cards
    expect(screen.getByText("Daily Check-ins")).toBeInTheDocument();
    expect(screen.getByText("No-show Rate")).toBeInTheDocument();
    expect(screen.getByText("Average Wait Time")).toBeInTheDocument();

    // Check for metric values
    expect(screen.getByText("1")).toBeInTheDocument(); // Daily check-ins
    expect(screen.getByText("5%")).toBeInTheDocument(); // No-show rate
    expect(screen.getByText("15 min")).toBeInTheDocument(); // Average wait time
  });

  it("handles loading states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<ReceptionistDashboard />);

    // Check for loading indicators
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(5);
  });

  it("handles error states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch appointments"),
    });

    render(<ReceptionistDashboard />);

    // Check for error message
    expect(
      screen.getByText("Failed to fetch appointments")
    ).toBeInTheDocument();
  });

  it("allows checking in a patient", async () => {
    render(<ReceptionistDashboard />);

    // Click check-in button
    const checkInButtons = screen.getAllByText("Check In");
    await userEvent.click(checkInButtons[0]);

    // Check if status is updated
    expect(screen.getByText("Checked In")).toBeInTheDocument();
  });

  it("allows confirming an appointment", async () => {
    render(<ReceptionistDashboard />);

    // Click confirm button
    const confirmButtons = screen.getAllByText("Confirm");
    await userEvent.click(confirmButtons[0]);

    // Check if status is updated
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });
});
