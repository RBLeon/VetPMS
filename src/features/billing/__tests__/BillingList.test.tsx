import { render, screen, waitFor } from "@testing-library/react";
import { BillingList } from "../BillingList";
import { useBills } from "@/lib/hooks/useBills";
import { vi } from "vitest";

// Mock the useBills hook
vi.mock("@/lib/hooks/useBills");

describe("BillingList", () => {
  const mockBills = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      date: "2024-03-20",
      clientName: "John Doe",
      amount: 150.0,
      status: "Paid",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      date: "2024-03-21",
      clientName: "Jane Smith",
      amount: 250.0,
      status: "Pending",
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    (useBills as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<BillingList />);
    expect(screen.getByText("Laden...")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    (useBills as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<BillingList />);
    expect(screen.getByText("Geen facturen gevonden")).toBeInTheDocument();
  });

  it("renders bills table with data", async () => {
    (useBills as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockBills,
      isLoading: false,
    });

    render(<BillingList />);

    // Check if table headers are rendered
    expect(screen.getByText("Factuur Nummer")).toBeInTheDocument();
    expect(screen.getByText("Datum")).toBeInTheDocument();
    expect(screen.getByText("Klant")).toBeInTheDocument();
    expect(screen.getByText("Bedrag")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check if bill data is rendered
    await waitFor(() => {
      expect(screen.getByText("INV-001")).toBeInTheDocument();
      expect(screen.getByText("INV-002")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("€150.00")).toBeInTheDocument();
      expect(screen.getByText("€250.00")).toBeInTheDocument();
      expect(screen.getByText("Paid")).toBeInTheDocument();
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });
  });

  it("formats dates correctly", async () => {
    (useBills as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockBills,
      isLoading: false,
    });

    render(<BillingList />);

    await waitFor(() => {
      expect(screen.getByText("20-3-2024")).toBeInTheDocument();
      expect(screen.getByText("21-3-2024")).toBeInTheDocument();
    });
  });

  it("handles error state", () => {
    (useBills as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch bills"),
    });

    render(<BillingList />);
    expect(screen.getByText("Geen facturen gevonden")).toBeInTheDocument();
  });
});
