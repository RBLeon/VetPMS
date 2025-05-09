import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ManagerDashboard } from "../ManagerDashboard";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useStaff } from "@/lib/hooks/useStaff";
import { useInventory } from "@/lib/hooks/useInventory";

// Mock the hooks
vi.mock("@/lib/hooks/useAppointments", () => ({
  useAppointments: vi.fn(),
}));

vi.mock("@/lib/hooks/useInvoices", () => ({
  useInvoices: vi.fn(),
}));

vi.mock("@/lib/hooks/useStaff", () => ({
  useStaff: vi.fn(),
}));

vi.mock("@/lib/hooks/useInventory", () => ({
  useInventory: vi.fn(),
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
    status: "completed",
    notes: "Regular checkup",
    revenue: 150,
  },
  {
    id: "2",
    patientId: "2",
    clientId: "2",
    date: new Date().toISOString(),
    time: "10:00",
    type: "surgery",
    status: "completed",
    notes: "Spay surgery",
    revenue: 500,
  },
];

const mockInvoices = [
  {
    id: "1",
    clientId: "1",
    date: new Date().toISOString(),
    amount: 150,
    status: "paid",
  },
  {
    id: "2",
    clientId: "2",
    date: new Date().toISOString(),
    amount: 500,
    status: "pending",
  },
];

const mockStaff = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    role: "veterinarian",
    status: "active",
    hoursWorked: 40,
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    role: "nurse",
    status: "active",
    hoursWorked: 35,
  },
];

const mockInventory = [
  {
    id: "1",
    name: "Vaccine A",
    quantity: 50,
    reorderLevel: 20,
    expiryDate: "2024-12-31",
  },
  {
    id: "2",
    name: "Medication B",
    quantity: 15,
    reorderLevel: 25,
    expiryDate: "2024-10-31",
  },
];

describe("ManagerDashboard", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (useAppointments as any).mockReturnValue({
      data: mockAppointments,
      isLoading: false,
      error: null,
    });

    (useInvoices as any).mockReturnValue({
      data: mockInvoices,
      isLoading: false,
      error: null,
    });

    (useStaff as any).mockReturnValue({
      data: mockStaff,
      isLoading: false,
      error: null,
    });

    (useInventory as any).mockReturnValue({
      data: mockInventory,
      isLoading: false,
      error: null,
    });
  });

  it("renders the dashboard with all sections", () => {
    render(<ManagerDashboard />);

    // Check for main sections
    expect(screen.getByText("Practice Overview")).toBeInTheDocument();
    expect(screen.getByText("Financial Metrics")).toBeInTheDocument();
    expect(screen.getByText("Staff Management")).toBeInTheDocument();
    expect(screen.getByText("Inventory Status")).toBeInTheDocument();
    expect(screen.getByText("Quick Stats")).toBeInTheDocument();
  });

  it("displays practice overview correctly", () => {
    render(<ManagerDashboard />);

    // Check for overview items
    expect(screen.getByText("Daily Revenue")).toBeInTheDocument();
    expect(screen.getByText("Appointment Utilization")).toBeInTheDocument();
    expect(screen.getByText("Staff Productivity")).toBeInTheDocument();

    // Check for values
    expect(screen.getByText("$650")).toBeInTheDocument(); // Total revenue
    expect(screen.getByText("85%")).toBeInTheDocument(); // Utilization
    expect(screen.getByText("90%")).toBeInTheDocument(); // Productivity
  });

  it("shows financial metrics with correct data", () => {
    render(<ManagerDashboard />);

    // Check for financial items
    expect(screen.getByText("Revenue by Service")).toBeInTheDocument();
    expect(screen.getByText("Outstanding Invoices")).toBeInTheDocument();
    expect(screen.getByText("Payment Collection Rate")).toBeInTheDocument();

    // Check for values
    expect(screen.getByText("$500")).toBeInTheDocument(); // Outstanding
    expect(screen.getByText("75%")).toBeInTheDocument(); // Collection rate
  });

  it("displays staff management with schedule", () => {
    render(<ManagerDashboard />);

    // Check for staff items
    const staffItems = screen.getAllByTestId("staff-item");
    expect(staffItems).toHaveLength(2);

    // Check for staff details
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("40 hours")).toBeInTheDocument();
  });

  it("shows inventory status with alerts", () => {
    render(<ManagerDashboard />);

    // Check for inventory items
    const inventoryItems = screen.getAllByTestId("inventory-item");
    expect(inventoryItems).toHaveLength(2);

    // Check for alerts
    expect(screen.getByText("Low Stock")).toBeInTheDocument();
    expect(screen.getByText("Expiring Soon")).toBeInTheDocument();
  });

  it("displays quick stats with correct metrics", () => {
    render(<ManagerDashboard />);

    // Check for stat cards
    expect(screen.getByText("Daily Revenue vs Target")).toBeInTheDocument();
    expect(screen.getByText("Staff Utilization")).toBeInTheDocument();
    expect(screen.getByText("Client Satisfaction")).toBeInTheDocument();

    // Check for metric values
    expect(screen.getByText("$650")).toBeInTheDocument(); // Daily revenue
    expect(screen.getByText("90%")).toBeInTheDocument(); // Staff utilization
    expect(screen.getByText("95%")).toBeInTheDocument(); // Client satisfaction
  });

  it("handles loading states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<ManagerDashboard />);

    // Check for loading indicators
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(5);
  });

  it("handles error states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch appointments"),
    });

    render(<ManagerDashboard />);

    // Check for error message
    expect(
      screen.getByText("Failed to fetch appointments")
    ).toBeInTheDocument();
  });

  it("allows viewing detailed financial report", async () => {
    render(<ManagerDashboard />);

    // Click view report button
    const viewButtons = screen.getAllByText("View Report");
    await userEvent.click(viewButtons[0]);

    // Check if report modal opens
    expect(screen.getByText("Financial Report")).toBeInTheDocument();
    expect(screen.getByText("Revenue Breakdown")).toBeInTheDocument();
  });

  it("allows managing staff schedule", async () => {
    render(<ManagerDashboard />);

    // Click manage schedule button
    const manageButtons = screen.getAllByText("Manage Schedule");
    await userEvent.click(manageButtons[0]);

    // Check if schedule modal opens
    expect(screen.getByText("Staff Schedule")).toBeInTheDocument();
    expect(screen.getByText("Weekly View")).toBeInTheDocument();
  });
});
