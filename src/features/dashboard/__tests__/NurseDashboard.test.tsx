import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
// import userEvent from "@testing-library/user-event"; // Removed unused import
import { NurseDashboard } from "../NurseDashboard";
import { useAppointments, usePatients, useInventory } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/lib/context/AuthContext";
import { RoleProvider } from "@/lib/context/RoleContext";
import type { Appointment, Patient } from "@/lib/api/types";

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
  const mockAppointment: Appointment = {
    id: "1",
    patientId: "1",
    patientName: "Max",
    clientId: "1",
    clientName: "John Doe",
    providerId: "1",
    date: new Date().toISOString(),
    time: "09:00",
    type: "CONTROLE",
    status: "IN_BEHANDELING",
    notes: "Test notities",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPatient: Patient = {
    id: "1",
    name: "Max",
    species: "HOND",
    breed: "Labrador",
    gender: "mannelijk",
    age: 4,
    weight: 25,
    clientId: "1",
    dateOfBirth: "2020-01-01",
    lastVisit: new Date().toISOString(),
    status: "ACTIVE",
    needsVitalsCheck: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    registrationDate: new Date().toISOString(),
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
    renderWithProviders(
      <NurseDashboard
        appointments={[mockAppointment]}
        patients={[mockPatient]}
      />
    );
    // Activate the 'Behandelingen' tab if present
    const behandelingenTab = screen.queryByRole("tab", {
      name: /behandelingen/i,
    });
    if (behandelingenTab) fireEvent.click(behandelingenTab);

    expect(screen.getAllByText("Vandaag").length).toBeGreaterThan(0);
    expect(screen.getByText("Max")).toBeInTheDocument();
  });

  it("allows starting treatment", async () => {
    renderWithProviders(<NurseDashboard />);

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
    const { container } = renderWithProviders(<NurseDashboard />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RoleProvider>{ui}</RoleProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
