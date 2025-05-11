import { render, screen } from "@testing-library/react";
import { MedicalRecordForm } from "../MedicalRecordForm";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import React from "react";

describe("MedicalRecordForm", () => {
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

  it("renders form with required fields", () => {
    renderWithProviders(<MedicalRecordForm patientId="1" />);
    expect(screen.getByLabelText(/Datum/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hoofdklacht/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Diagnose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Behandeling/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
  });
});
