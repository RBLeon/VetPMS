import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ReceptionistDashboard } from "../ReceptionistDashboard";
import { NurseDashboard } from "../NurseDashboard";
import { useAppointments, useClients, usePatients } from "@/lib/hooks/useApi";
import type { Appointment, Patient, Client } from "@/lib/api/types";

vi.mock("@/lib/hooks/useApi", () => {
  return {
    useAppointments: vi.fn(),
    usePatients: vi.fn(),
    useClients: vi.fn(),
    useInventory: () => ({
      data: [],
      isLoading: false,
    }),
  };
});

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

  const mockAppointment: Appointment = {
    id: "1",
    patientId: "1",
    patientName: "Max",
    type: "CONTROLE",
    status: "INGEPLAND",
    time: "09:00",
    date: new Date().toISOString(),
    clientId: "1",
    clientName: "John Doe",
    providerId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockClient: Client = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "0612345678",
    preferredCommunication: "email",
    lastVisit: new Date().toISOString(),
    address: {
      street: "Straat 1",
      city: "Stad",
      state: "Noord-Holland",
      postalCode: "1234AB",
      country: "Nederland",
    },
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
      renderWithProviders(
        <ReceptionistDashboard
          appointments={[mockAppointment]}
          clients={[mockClient]}
          patients={[mockPatient]}
        />
      );
      const newAppointmentButton = screen.getByText("Nieuwe Afspraak");
      fireEvent.click(newAppointmentButton);
      expect(mockNavigate).toHaveBeenCalledWith("/appointments/new");
    });
  });

  describe("Nurse Dashboard Actions", () => {
    it("navigates to new treatment form when clicking new treatment button", () => {
      renderWithProviders(
        <NurseDashboard
          appointments={[mockAppointment]}
          patients={[mockPatient]}
        />
      );
      const newTreatmentButton = screen.getByText("Nieuwe Behandeling");
      fireEvent.click(newTreatmentButton);
      expect(mockNavigate).toHaveBeenCalledWith("/treatments/new");
    });
  });
});
