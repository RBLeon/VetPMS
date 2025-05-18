import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReceptionistDashboard } from "../ReceptionistDashboard";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppointments, useClients, usePatients } from "@/lib/hooks/useApi";

vi.mock("@/lib/hooks/useApi", () => ({
  useAppointments: vi.fn(),
  useClients: vi.fn(),
  usePatients: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("ReceptionistDashboard", () => {
  const mockAppointment = {
    id: "1",
    patientId: "1",
    patientName: "Max",
    type: "CONTROLE",
    status: "INGEPLAND",
    time: "09:00",
    date: new Date().toISOString(),
    clientId: "1",
  };

  const mockClient = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "0612345678",
  };

  const mockPatient = {
    id: "1",
    name: "Max",
    species: "Hond",
    breed: "Labrador",
    gender: "Mannelijk",
    age: 4,
    weight: 25,
    clientId: "1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppointments as any).mockReturnValue({
      data: [mockAppointment],
      isLoading: false,
    });
    (useClients as any).mockReturnValue({
      data: [mockClient],
      isLoading: false,
    });
    (usePatients as any).mockReturnValue({
      data: [mockPatient],
      isLoading: false,
    });
  });

  it("displays appointments", () => {
    renderWithProviders(<ReceptionistDashboard />);
    expect(screen.getAllByText("Vandaag").length).toBeGreaterThan(0);
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useAppointments as any).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });
    (useClients as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    (usePatients as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    renderWithProviders(<ReceptionistDashboard />);
    expect(screen.getByText("Laden...")).toBeInTheDocument();
  });
});
