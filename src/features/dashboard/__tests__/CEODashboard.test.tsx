import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CEODashboard } from "../CEODashboard";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useStaff } from "@/lib/hooks/useStaff";
import { useInventory } from "@/lib/hooks/useInventory";
import { useClients } from "@/lib/hooks/useClients";

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

const mockClients = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "123-456-7890",
    lastVisit: "2024-03-01",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    phone: "098-765-4321",
    lastVisit: "2024-03-15",
  },
];

describe("CEODashboard", () => {
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

    (useClients as any).mockReturnValue({
      data: mockClients,
      isLoading: false,
      error: null,
    });
  });

  it("renders the dashboard with all sections", () => {
    render(<CEODashboard />);

    // Check for main sections
    expect(screen.getByText("Business Performance")).toBeInTheDocument();
    expect(screen.getByText("Financial Overview")).toBeInTheDocument();
    expect(screen.getByText("Practice Health")).toBeInTheDocument();
    expect(screen.getByText("Strategic Metrics")).toBeInTheDocument();
    expect(screen.getByText("Quick Stats")).toBeInTheDocument();
  });

  it("displays business performance metrics correctly", () => {
    render(<CEODashboard />);

    // Check for performance items
    expect(screen.getByText("Monthly Revenue")).toBeInTheDocument();
    expect(screen.getByText("Client Growth")).toBeInTheDocument();
    expect(screen.getByText("Service Utilization")).toBeInTheDocument();

    // Check for values
    expect(screen.getByText("$15,000")).toBeInTheDocument(); // Monthly revenue
    expect(screen.getByText("+12%")).toBeInTheDocument(); // Client growth
    expect(screen.getByText("85%")).toBeInTheDocument(); // Service utilization
  });

  it("shows financial overview with correct data", () => {
    render(<CEODashboard />);

    // Check for financial items
    expect(screen.getByText("Revenue Trends")).toBeInTheDocument();
    expect(screen.getByText("Profit Margins")).toBeInTheDocument();
    expect(screen.getByText("Cash Flow")).toBeInTheDocument();

    // Check for values
    expect(screen.getByText("$45,000")).toBeInTheDocument(); // Quarterly revenue
    expect(screen.getByText("35%")).toBeInTheDocument(); // Profit margin
    expect(screen.getByText("$12,000")).toBeInTheDocument(); // Cash flow
  });

  it("displays practice health metrics", () => {
    render(<CEODashboard />);

    // Check for health items
    expect(screen.getByText("Staff Retention")).toBeInTheDocument();
    expect(screen.getByText("Client Satisfaction")).toBeInTheDocument();
    expect(screen.getByText("Operational Efficiency")).toBeInTheDocument();

    // Check for values
    expect(screen.getByText("95%")).toBeInTheDocument(); // Staff retention
    expect(screen.getByText("92%")).toBeInTheDocument(); // Client satisfaction
    expect(screen.getByText("88%")).toBeInTheDocument(); // Operational efficiency
  });

  it("shows strategic metrics with KPIs", () => {
    render(<CEODashboard />);

    // Check for strategic items
    expect(screen.getByText("Market Share")).toBeInTheDocument();
    expect(screen.getByText("Client Lifetime Value")).toBeInTheDocument();
    expect(screen.getByText("Growth Rate")).toBeInTheDocument();

    // Check for values
    expect(screen.getByText("25%")).toBeInTheDocument(); // Market share
    expect(screen.getByText("$2,500")).toBeInTheDocument(); // Client lifetime value
    expect(screen.getByText("15%")).toBeInTheDocument(); // Growth rate
  });

  it("displays quick stats with correct metrics", () => {
    render(<CEODashboard />);

    // Check for stat cards
    expect(screen.getByText("Year-over-Year Growth")).toBeInTheDocument();
    expect(screen.getByText("Client Acquisition Cost")).toBeInTheDocument();
    expect(screen.getByText("Return on Investment")).toBeInTheDocument();

    // Check for metric values
    expect(screen.getByText("+18%")).toBeInTheDocument(); // YoY growth
    expect(screen.getByText("$150")).toBeInTheDocument(); // CAC
    expect(screen.getByText("320%")).toBeInTheDocument(); // ROI
  });

  it("handles loading states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<CEODashboard />);

    // Check for loading indicators
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(5);
  });

  it("handles error states correctly", () => {
    (useAppointments as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch appointments"),
    });

    render(<CEODashboard />);

    // Check for error message
    expect(
      screen.getByText("Failed to fetch appointments")
    ).toBeInTheDocument();
  });

  it("allows viewing detailed business report", async () => {
    render(<CEODashboard />);

    // Click view report button
    const viewButtons = screen.getAllByText("View Report");
    await userEvent.click(viewButtons[0]);

    // Check if report modal opens
    expect(screen.getByText("Business Report")).toBeInTheDocument();
    expect(screen.getByText("Performance Analysis")).toBeInTheDocument();
  });

  it("allows viewing financial projections", async () => {
    render(<CEODashboard />);

    // Click view projections button
    const viewButtons = screen.getAllByText("View Projections");
    await userEvent.click(viewButtons[0]);

    // Check if projections modal opens
    expect(screen.getByText("Financial Projections")).toBeInTheDocument();
    expect(screen.getByText("Revenue Forecast")).toBeInTheDocument();
  });
});
