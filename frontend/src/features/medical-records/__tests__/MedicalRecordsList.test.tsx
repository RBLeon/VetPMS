import { render, screen, fireEvent } from "@testing-library/react";
import { MedicalRecordsList } from "../MedicalRecordsList";
import * as apiHooks from "@/lib/hooks/useApi";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

vi.mock("@/lib/hooks/useApi", () => ({
  useMedicalRecords: vi.fn(),
  usePatients: vi.fn(),
}));

const mockRecords = [
  {
    id: "1",
    type: "CONSULTATIE",
    date: "2024-03-19",
    chiefComplaint: "Test diagnose",
    treatment: "Test behandeling",
    patientId: "1",
    veterinarianId: "1",
  },
];

const mockPatients = [
  {
    id: "1",
    name: "Test Patient",
    species: "Hond",
    breed: "Labrador",
    gender: "MALE",
    age: 5,
    weight: 25,
  },
];

describe("MedicalRecordsList", () => {
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
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    (
      apiHooks.useMedicalRecords as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: mockRecords,
      isLoading: false,
    });
    (
      apiHooks.usePatients as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: mockPatients,
    });
  });

  it("displays medical records", () => {
    renderWithProviders(<MedicalRecordsList patientId="1" />);
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it.skip("handles search functionality", async () => {
    renderWithProviders(<MedicalRecordsList patientId="1" />);
    const searchInput = screen.getByPlaceholderText("Zoeken...");
    fireEvent.change(searchInput, { target: { value: "Test diagnose" } });
    expect(await screen.findByText("Test diagnose")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (
      apiHooks.useMedicalRecords as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      data: [],
      isLoading: true,
    });
    renderWithProviders(<MedicalRecordsList patientId="1" />);
    expect(screen.getByText("Laden...")).toBeInTheDocument();
  });
});
