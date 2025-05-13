import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ReceptionistDashboard } from "../ReceptionistDashboard";
import { NurseDashboard } from "../NurseDashboard";
import { VeterinarianDashboard } from "../VeterinarianDashboard";
import { useAppointments, useClients, usePatients } from "@/lib/hooks/useApi";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  useAppointments: vi.fn(),
  useClients: vi.fn(),
  usePatients: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

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

describe("Dashboard Actions", () => {
  const mockNavigate = vi.fn();
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
    (useNavigate as any).mockReturnValue(mockNavigate);
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

  describe("Receptionist Dashboard Actions", () => {
    it("navigates to scheduler when clicking new appointment button", () => {
      renderWithProviders(<ReceptionistDashboard />);
      const newAppointmentButton = screen.getByText("Nieuwe Afspraak");
      fireEvent.click(newAppointmentButton);
      expect(mockNavigate).toHaveBeenCalledWith("/appointments/new");
    });

    it("navigates to patient details when clicking view patient", () => {
      renderWithProviders(<ReceptionistDashboard />);
      const viewPatientButton = screen.getByText("Bekijk Patiënt");
      fireEvent.click(viewPatientButton);
      expect(mockNavigate).toHaveBeenCalledWith(`/patients/${mockPatient.id}`);
    });

    it("navigates to client details when clicking client name", () => {
      renderWithProviders(<ReceptionistDashboard />);
      const clientName = screen.getByText(mockClient.name);
      fireEvent.click(clientName);
      expect(mockNavigate).toHaveBeenCalledWith(`/clients/${mockClient.id}`);
    });
  });

  describe("Nurse Dashboard Actions", () => {
    it("navigates to new treatment form when clicking new treatment button", () => {
      renderWithProviders(<NurseDashboard />);
      const newTreatmentButton = screen.getByText("Nieuwe Behandeling");
      fireEvent.click(newTreatmentButton);
      expect(mockNavigate).toHaveBeenCalledWith("/treatments/new");
    });

    it("navigates to vaccination form when clicking vaccination button", () => {
      renderWithProviders(<NurseDashboard />);
      const vaccinationButton = screen.getByText("Vaccinatie");
      fireEvent.click(vaccinationButton);
      expect(mockNavigate).toHaveBeenCalledWith("/treatments/vaccination");
    });
  });

  describe("Veterinarian Dashboard Actions", () => {
    it("navigates to new consultation form when clicking new consultation button", () => {
      renderWithProviders(<VeterinarianDashboard />);
      const newConsultationButton = screen.getByText("Nieuwe Controle");
      fireEvent.click(newConsultationButton);
      expect(mockNavigate).toHaveBeenCalledWith("/consultations/new");
    });

    it("navigates to medical records when clicking medical records button", () => {
      renderWithProviders(<VeterinarianDashboard />);
      const medicalRecordsButton = screen.getByText("Dossier");
      fireEvent.click(medicalRecordsButton);
      expect(mockNavigate).toHaveBeenCalledWith("/medical-records");
    });
  });
});
