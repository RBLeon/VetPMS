import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event"; // Removed unused import
import { NurseDashboard } from "../NurseDashboard";
import { useAppointments, usePatients, useInventory } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  useAppointments: vi.fn(),
  usePatients: vi.fn(),
  useInventory: vi.fn(),
}));

vi.mock("@/lib/hooks/useMedicalRecords", () => ({
  useMedicalRecords: vi.fn(),
}));

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
    (useAppointments as any).mockReturnValue({
      data: [mockAppointment],
      isLoading: false,
    });
    (usePatients as any).mockReturnValue({
      data: [mockPatient],
      isLoading: false,
    });
    (useInventory as any).mockReturnValue({
      data: mockInventory,
      isLoading: false,
    });
    (useMedicalRecords as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it("displays patient treatments", () => {
    render(<NurseDashboard />);
    expect(screen.getAllByText("Vandaag").length).toBeGreaterThan(0);
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("CONTROLE")).toBeInTheDocument();
  });

  it("allows starting treatment", async () => {
    render(<NurseDashboard />);

    const startButton = screen.getByRole("button", {
      name: /Nieuwe Behandeling/i,
    });
    expect(startButton).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useAppointments as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    (usePatients as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    (useInventory as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    const { container } = render(<NurseDashboard />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
