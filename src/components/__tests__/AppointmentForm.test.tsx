import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppointmentForm from "../AppointmentForm";
import { useAuth } from "../../contexts/AuthContext";
import { useAppointments } from "../../contexts/AppointmentContext";

// Define types for our mocks
type MockAuthContext = {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: "VET" | "RECEPTIONIST" | "ADMIN";
    createdAt: string;
    updatedAt: string;
  };
};

type MockAppointmentContext = {
  createAppointment: (data: any) => Promise<any>;
  updateAppointment: (data: any) => Promise<any>;
};

// Mock the hooks
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../contexts/AppointmentContext", () => ({
  useAppointments: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
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

describe("AppointmentForm", () => {
  const mockCurrentUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    role: "VET" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockCreateAppointment = vi.fn();
  const mockUpdateAppointment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: mockCurrentUser,
    } as MockAuthContext);
    (useAppointments as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      createAppointment: mockCreateAppointment,
      updateAppointment: mockUpdateAppointment,
    } as MockAppointmentContext);

    // Mock fetch for pets and vets
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === "/api/pets") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: "1",
                name: "Max",
                species: "Dog",
                breed: "Labrador",
                ownerId: "1",
              },
            ]),
        });
      }
      if (url === "/api/vets") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: "1",
                name: "Dr. Smith",
                email: "smith@example.com",
                role: "VET",
              },
            ]),
        });
      }
      return Promise.reject(new Error("Not found"));
    });
  });

  it("renders the form with all fields", async () => {
    renderWithProviders(<AppointmentForm />);

    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/pet/i)).toBeInTheDocument();
    });

    // Check if all form fields are present
    expect(screen.getByLabelText(/veterinarian/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/appointment type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("submits the form with correct data", async () => {
    renderWithProviders(<AppointmentForm />);

    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/pet/i)).toBeInTheDocument();
    });

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/pet/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/veterinarian/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-03-20" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "14:30" },
    });
    fireEvent.change(screen.getByLabelText(/appointment type/i), {
      target: { value: "Checkup" },
    });
    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: "Test notes" },
    });
    fireEvent.change(screen.getByLabelText(/status/i), {
      target: { value: "SCHEDULED" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Create Appointment"));

    // Check if createAppointment was called with correct data
    await waitFor(() => {
      expect(mockCreateAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          petId: "1",
          vetId: "1",
          date: "2024-03-20",
          time: "14:30",
          type: "Checkup",
          notes: "Test notes",
          status: "SCHEDULED",
          userId: "1",
        })
      );
    });
  });

  it("shows error message when form submission fails", async () => {
    mockCreateAppointment.mockRejectedValueOnce(
      new Error("Failed to create appointment")
    );

    renderWithProviders(<AppointmentForm />);

    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/pet/i)).toBeInTheDocument();
    });

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/pet/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/veterinarian/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2024-03-20" },
    });
    fireEvent.change(screen.getByLabelText(/time/i), {
      target: { value: "14:30" },
    });
    fireEvent.change(screen.getByLabelText(/appointment type/i), {
      target: { value: "Checkup" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Create Appointment"));

    // Check if error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("Failed to create appointment")
      ).toBeInTheDocument();
    });
  });
});
