import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { PatientList } from "../PatientList";
import { PatientForm } from "../PatientForm";
import { PatientDetails } from "../PatientDetails";
import { usePatients, usePatient } from "@/lib/hooks/useApi";
import { vi } from "vitest";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  usePatients: vi.fn(),
  usePatient: vi.fn(),
}));

describe("Patient Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PatientList", () => {
    it("should handle search errors gracefully", async () => {
      (usePatients as any).mockReturnValue({
        data: undefined,
        error: new Error("Search failed"),
        isLoading: false,
      });

      render(
        <BrowserRouter>
          <PatientList />
        </BrowserRouter>
      );

      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    it("should show loading state", () => {
      (usePatients as any).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      });

      render(
        <BrowserRouter>
          <PatientList />
        </BrowserRouter>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe("PatientForm", () => {
    it("should have a back button", () => {
      render(
        <BrowserRouter>
          <PatientForm />
        </BrowserRouter>
      );

      expect(
        screen.getByRole("button", { name: /back to patients/i })
      ).toBeInTheDocument();
    });

    it("should handle form submission errors", async () => {
      render(
        <BrowserRouter>
          <PatientForm />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole("button", {
        name: /create patient/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe("PatientDetails", () => {
    it("should handle loading state", () => {
      (usePatient as any).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      });

      render(
        <BrowserRouter>
          <PatientDetails />
        </BrowserRouter>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should handle error state", () => {
      (usePatient as any).mockReturnValue({
        data: undefined,
        error: new Error("Failed to load patient"),
        isLoading: false,
      });

      render(
        <BrowserRouter>
          <PatientDetails />
        </BrowserRouter>
      );

      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
