import { render, screen } from "@testing-library/react";
import { MedicalRecordsList } from "../MedicalRecordsList";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

vi.mock("@/hooks/useMedicalRecords", () => ({
  useMedicalRecords: vi.fn(),
}));

describe("MedicalRecordsList", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders medical records list", () => {
    (useMedicalRecords as unknown).mockReturnValue({
      medicalRecords: [
        {
          id: "1",
          patientId: "1",
          date: "2024-03-20",
          type: "CONSULTATION",
          diagnosis: "Test diagnose",
          treatment: "Test behandeling",
          notes: "Test notities",
          status: "VOLTOOID",
          followUpDate: "2024-03-27",
          createdAt: "2024-03-20T10:00:00Z",
          updatedAt: "2024-03-20T10:00:00Z",
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<MedicalRecordsList patientId="1" />, { wrapper });
    expect(screen.getByText("Test diagnose")).toBeInTheDocument();
    expect(screen.getByText("Test behandeling")).toBeInTheDocument();
  });
});
