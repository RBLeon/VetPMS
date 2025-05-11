import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { PatientList } from "../PatientList";
import { PatientForm } from "../PatientForm";
import { PatientDetails } from "../PatientDetails";
import { usePatient } from "@/lib/hooks/useApi";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Patient } from "@/lib/api/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockNavigate = vi.fn();

vi.mock("@/lib/hooks/useApi", () => ({
  usePatients: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: undefined,
  })),
  usePatient: vi.fn(),
  useCreatePatient: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isLoading: false,
  })),
  useUpdatePatient: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isLoading: false,
  })),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "test-patient-id" }),
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Patient Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPatient: Patient = {
    id: "1",
    name: "Buddy",
    species: "HOND",
    breed: "Labrador",
    gender: "mannelijk",
    age: 4,
    weight: 25.5,
    microchipNumber: "123456789",
    color: "Zwart",
    clientId: "1",
    dateOfBirth: "2020-01-01",
    lastVisit: "2024-03-20",
    status: "ACTIVE",
    needsVitalsCheck: false,
    registrationDate: "2020-01-01",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  };

  describe("PatientList", () => {
    it("displays list of patients", () => {
      const patients = [mockPatient];
      renderWithProviders(<PatientList patients={patients} />);
      expect(screen.getByText("Buddy")).toBeInTheDocument();
      expect(screen.getByText("Labrador")).toBeInTheDocument();
    });

    it("handles search functionality", async () => {
      const user = userEvent.setup();
      const patients = [mockPatient];
      renderWithProviders(<PatientList patients={patients} />);

      const searchInput = screen.getByPlaceholderText(/Zoek patiënten/i);
      await user.type(searchInput, "Buddy");

      expect(screen.getByText("Buddy")).toBeInTheDocument();
    });
  });

  describe("PatientForm", () => {
    it("renders form with required fields", () => {
      render(<PatientForm />);

      expect(screen.getByLabelText("Naam")).toBeInTheDocument();
      expect(screen.getByText("Soort")).toBeInTheDocument();
      expect(screen.getByLabelText("Ras")).toBeInTheDocument();
      expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument();
      expect(screen.getByLabelText("Leeftijd (jaren)")).toBeInTheDocument();
      expect(screen.getByLabelText("Gewicht (kg)")).toBeInTheDocument();
    });
  });

  describe("PatientDetails", () => {
    it("displays patient information", () => {
      (usePatient as any).mockReturnValue({
        data: mockPatient,
        isLoading: false,
      });
      renderWithProviders(<PatientDetails />);
      expect(screen.getByText("Buddy")).toBeInTheDocument();
      expect(screen.getByText("Labrador")).toBeInTheDocument();
    });
  });
});
