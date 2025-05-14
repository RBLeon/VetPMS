import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
// import userEvent from "@testing-library/user-event"; // Removed unused import
import { NurseDashboard } from "../NurseDashboard";
import { useAppointments, usePatients, useInventory } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { UiProvider } from "@/lib/context/UiContext";
import { TenantProvider } from "@/lib/context/TenantContext";

// Mock the hooks with vi.fn() so we can use .mockReturnValue
const useAppointments = vi.fn();
const usePatients = vi.fn();
const useInventory = vi.fn();
vi.mock("@/lib/hooks/useApi", () => ({
  useAppointments,
  usePatients,
  useInventory,
}));

vi.mock("@/lib/hooks/useMedicalRecords", () => ({
  useMedicalRecords: vi.fn(),
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      <UiProvider>
        <TenantProvider>{component}</TenantProvider>
      </UiProvider>
    </MemoryRouter>
  );
};

describe("NurseDashboard", () => {
  const mockAppointment = {
    id: "1",
    patientId: "1",
    patientName: "Max",
    type: "CONTROLE",
    status: "IN_BEHANDELING",
    date: new Date().toISOString(),
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

  const mockInventory = [
    {
      id: "1",
      name: "Bandages",
      category: "MATERIAAL",
      quantity: 10,
      reorderLevel: 5,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useAppointments.mockReturnValue({
      data: [mockAppointment],
      isLoading: false,
    });
    usePatients.mockReturnValue({
      data: [mockPatient],
      isLoading: false,
    });
    useInventory.mockReturnValue({
      data: mockInventory,
      isLoading: false,
    });
    (useMedicalRecords as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it("displays patient treatments", () => {
    renderWithProviders(<NurseDashboard />);
    expect(screen.getAllByText("Vandaag").length).toBeGreaterThan(0);
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("CONTROLE")).toBeInTheDocument();
  });

  it("allows starting treatment", () => {
    renderWithProviders(<NurseDashboard />);
    const startButton = screen.getByText("Start Behandeling");
    expect(startButton).toBeInTheDocument();
  });

  it("shows loading state", () => {
    vi.mocked(usePatients).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    renderWithProviders(<NurseDashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
