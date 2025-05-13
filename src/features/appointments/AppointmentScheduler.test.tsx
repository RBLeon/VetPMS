import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import AppointmentScheduler from "./AppointmentScheduler";
import { vi } from "vitest";
import { UiProvider } from "@/lib/context/UiContext";
import { TenantProvider } from "@/lib/context/TenantContext";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("AppointmentScheduler", () => {
  it("opent details-popup bij klikken op een afspraak", async () => {
    render(
      <UiProvider>
        <TenantProvider>
          <AppointmentScheduler />
        </TenantProvider>
      </UiProvider>
    );

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
    render(
      <UiProvider>
        <TenantProvider>
          <AppointmentScheduler />
        </TenantProvider>
      </UiProvider>
    );

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
    render(
      <UiProvider>
        <TenantProvider>
          <AppointmentScheduler />
        </TenantProvider>
      </UiProvider>
    );

    // Vind een lege cel in de planner (bijv. eerste provider, 8:00)
    const emptyCell = await screen.findByTestId("scheduler-cell-1-8");
    fireEvent.click(emptyCell);

    // Controleer of nieuwe afspraak modal verschijnt
    const newAppointmentDialog = await screen.findByRole("dialog");
    expect(
      within(newAppointmentDialog).getByText("Nieuwe Afspraak")
    ).toBeInTheDocument();
  });

  it("kan een afspraak annuleren", async () => {
    render(
      <UiProvider>
        <TenantProvider>
          <AppointmentScheduler />
        </TenantProvider>
      </UiProvider>
    );

    // Klik op een afspraak
    const appointment = await screen.findByText("Max");
    fireEvent.click(appointment);

    // Klik op annuleren
    const cancelButton = await screen.findByText("Annuleren");
    fireEvent.click(cancelButton);

    // Bevestig annulering
    const confirmButton = await screen.findByText("Bevestig annulering");
    fireEvent.click(confirmButton);

    // Controleer of afspraak status is bijgewerkt
    const updatedAppointment = await screen.findByText("Max");
    expect(
      updatedAppointment.closest('[data-status="GEANNULEERD"]')
    ).toBeInTheDocument();
  });
});
