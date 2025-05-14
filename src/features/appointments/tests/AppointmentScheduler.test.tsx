import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppointmentScheduler from "../components/AppointmentScheduler";
import { UiProvider } from "@/lib/context/UiContext";
import { TenantProvider } from "@/lib/context/TenantContext";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <UiProvider>
        <TenantProvider>{ui}</TenantProvider>
      </UiProvider>
    </MemoryRouter>
  );
};

describe("AppointmentScheduler", () => {
  it("renders the scheduler with appointments", () => {
    renderWithProviders(<AppointmentScheduler />);
    const today = format(new Date(), "EEEE d MMMM yyyy", { locale: nl });
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  it("renders empty scheduler", () => {
    renderWithProviders(<AppointmentScheduler />);
    const today = format(new Date(), "EEEE d MMMM yyyy", { locale: nl });
    expect(screen.getByText(today)).toBeInTheDocument();
  });
});
