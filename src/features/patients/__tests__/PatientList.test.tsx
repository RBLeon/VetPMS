import { render, screen, fireEvent } from "@testing-library/react";
import { PatientList } from "../PatientList";
import { usePatients } from "@/lib/hooks/useApi";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the usePatients hook
vi.mock("@/lib/hooks/useApi", () => ({
  usePatients: vi.fn(),
}));

describe("PatientList", () => {
  const mockPatients = [
    {
      id: "1",
      name: "Buddy",
      species: "HOND",
      breed: "Golden Retriever",
      dateOfBirth: "2021-01-01",
    },
  ];

  beforeEach(() => {
    (usePatients as jest.Mock).mockReturnValue({
      data: mockPatients,
      isLoading: false,
      error: null,
    });
  });

  it("displays list of patients", () => {
    render(
      <BrowserRouter>
        <PatientList />
      </BrowserRouter>
    );

    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("Golden Retriever")).toBeInTheDocument();
  });

  it("handles search functionality", () => {
    render(
      <BrowserRouter>
        <PatientList />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText("Zoek patiënten...");
    fireEvent.change(searchInput, { target: { value: "Buddy" } });

    expect(screen.getByText("Buddy")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (usePatients as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <PatientList />
      </BrowserRouter>
    );

    expect(screen.getByText("Laden...")).toBeInTheDocument();
  });
});
