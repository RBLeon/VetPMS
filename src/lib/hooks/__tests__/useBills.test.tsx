import { renderHook, act } from "@testing-library/react";
import { useBills } from "../useBills";
import { api } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { waitFor } from "@testing-library/react";

// Mock the api
vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useBills", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  const mockBills = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      date: "2024-03-20",
      clientName: "John Doe",
      amount: 150.0,
      status: "BETAALD" as import("@/lib/api/types").BillStatus,
      items: [],
      createdAt: "2024-03-20T10:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      date: "2024-03-21",
      clientName: "Jane Smith",
      amount: 250.0,
      status: "OPEN" as import("@/lib/api/types").BillStatus,
      items: [],
      createdAt: "2024-03-21T10:00:00Z",
      updatedAt: "2024-03-21T10:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("fetches bills successfully", async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockBills);

    const { result } = renderHook(() => useBills(), { wrapper });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Final state
    expect(result.current.data).toEqual(mockBills);
    expect(api.get).toHaveBeenCalledWith("/bills");
  });

  it("handles fetch error", async () => {
    const error = new Error("Failed to fetch bills");
    (api.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useBills(), { wrapper });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Final state
    expect(result.current.error).toBe(error);
    expect(result.current.data).toEqual([]);
  });

  it("creates a new bill", async () => {
    const newBill = {
      invoiceNumber: "INV-003",
      date: "2024-03-22",
      clientName: "Bob Johnson",
      amount: 300.0,
      status: "OPEN" as import("@/lib/api/types").BillStatus,
      items: [],
      createdAt: "2024-03-22T10:00:00Z",
      updatedAt: "2024-03-22T10:00:00Z",
    };

    (api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockBills);

    const { result } = renderHook(() => useBills(), { wrapper });

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Create new bill
    await act(async () => {
      await result.current.createBill(newBill);
    });

    expect(api.post).toHaveBeenCalledWith("/bills", newBill);
    expect(api.get).toHaveBeenCalledTimes(2); // Initial fetch + refetch after create
  });

  it("updates an existing bill", async () => {
    (api.patch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockBills);

    const { result } = renderHook(() => useBills(), { wrapper });

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update bill
    await act(async () => {
      await result.current.updateBill("1", {
        status: "BETAALD" as import("@/lib/api/types").BillStatus,
      });
    });

    expect(api.patch).toHaveBeenCalledWith("/bills/1", {
      status: "BETAALD" as import("@/lib/api/types").BillStatus,
    });
    expect(api.get).toHaveBeenCalledTimes(2); // Initial fetch + refetch after update
  });

  it("deletes a bill", async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockBills);

    const { result } = renderHook(() => useBills(), { wrapper });

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Delete bill
    await act(async () => {
      await result.current.deleteBill("1");
    });

    expect(api.delete).toHaveBeenCalledWith("/bills/1");
    expect(api.get).toHaveBeenCalledTimes(2); // Initial fetch + refetch after delete
  });
});
