import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMedicalRecords } from "@/lib/hooks/useMedicalRecords";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

vi.mock("@/lib/api/mockApi", () => ({
  mockApi: {
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
  },
}));

describe("useMedicalRecords (React Query version)", () => {
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
    queryClient.clear();
    vi.clearAllMocks();
  });

  it("returns initial state: isLoading true, data undefined, error undefined", () => {
    const { result } = renderHook(() => useMedicalRecords(), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});
