import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NurseDashboard } from "../NurseDashboard";
import { useAppointments } from "@/lib/hooks/useApi";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { usePatients } from "@/lib/hooks/useApi";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  useAppointments: vi.fn(),
  usePatients: vi.fn(),
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
    vitalSigns: {
      temperature: 38.5,
      heartRate: 80,
      respiratoryRate: 20,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppointments as any).mockReturnValue({
      data: [mockAppointment],
      isLoading: false,
    });
    (usePatients as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
    (useMedicalRecords as any).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it("displays patient treatments", () => {
    render(<NurseDashboard />);
    expect(
      screen.getByText("Huidige Behandelingen Overzicht")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Patiënten onder Toezicht Overzicht")
    ).toBeInTheDocument();
    expect(screen.getByText("Klinische Taken Overzicht")).toBeInTheDocument();
    expect(screen.getByText("Patiëntenwachtrij Overzicht")).toBeInTheDocument();
  });

  it("allows updating vital signs", async () => {
    const user = userEvent.setup();
    render(<NurseDashboard />);

    const updateButton = screen.getByRole("button", {
      name: /Vitalen Bijwerken/i,
    });
    await user.click(updateButton);

    expect(screen.getByLabelText("Temperatuur")).toBeInTheDocument();
    expect(screen.getByLabelText("Hartslag")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useAppointments as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    render(<NurseDashboard />);
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(10);
  });
});
