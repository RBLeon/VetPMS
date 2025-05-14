import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import AppointmentScheduler from "./AppointmentScheduler";
import { vi } from "vitest";
import { UiProvider } from "@/lib/context/UiContext";
import { TenantProvider } from "@/lib/context/TenantContext";
import { AppointmentStatus } from "@/types/appointment";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the toast
vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
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

describe("AppointmentScheduler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opent details-popup bij klikken op een afspraak", async () => {
    renderWithProviders(<AppointmentScheduler />);

    // Wacht tot de mock data geladen is
    expect(await screen.findByText("Afspraak Planner")).toBeInTheDocument();

    // Zoek een mock afspraak (bijv. Max)
    const appointment = await screen.findByText("Max");
    fireEvent.click(appointment);

    // Modal met details moet verschijnen
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("Afspraak details")).toBeInTheDocument();
    expect(within(dialog).getByText("Max")).toBeInTheDocument();
    expect(within(dialog).getByText("Bewerken")).toBeInTheDocument();
  });

  it("opent bewerk modal bij klikken op bewerken knop", async () => {
    renderWithProviders(<AppointmentScheduler />);

    // Klik op een afspraak
    const appointment = await screen.findByText("Max");
    fireEvent.click(appointment);

    // Klik op bewerken
    const editButton = await screen.findByText("Bewerken");
    fireEvent.click(editButton);

    // Controleer of bewerk modal verschijnt
    const editDialog = await screen.findByRole("dialog");
    expect(
      within(editDialog).getByText("Afspraak bewerken")
    ).toBeInTheDocument();
  });

  it("opent nieuwe afspraak modal bij klikken op lege plek in planner", async () => {
    renderWithProviders(<AppointmentScheduler />);

    // Dynamically find an empty cell (no appointment at that time/provider)
    // We'll look for a cell for provider 1 at 8:00, which is likely empty in the mock data
    const emptyCell = await screen.findByTestId("scheduler-cell-1-8");
    fireEvent.click(emptyCell);

    // Controleer of nieuwe afspraak modal verschijnt
    const newAppointmentDialog = await screen.findByRole("dialog");
    expect(
      within(newAppointmentDialog).getByText("Nieuwe Afspraak")
    ).toBeInTheDocument();
  });

  it("kan een afspraak annuleren", async () => {
    renderWithProviders(<AppointmentScheduler />);

    // Klik op een afspraak
    const appointment = await screen.findByText("Max");
    fireEvent.click(appointment);

    // Klik op annuleren
    const cancelButton = await screen.findByText("Annuleren");
    fireEvent.click(cancelButton);

    // Bevestig annulering
    const confirmButton = await screen.findByText("Bevestig annulering");
    fireEvent.click(confirmButton);

    // Controleer of afspraak status is bijgewerkt (look for Max with data-status="CANCELLED")
    const cancelledAppointment = await screen.findByText("Max");
    expect(
      cancelledAppointment.closest('[data-status="CANCELLED"]')
    ).toBeInTheDocument();
  });
});
