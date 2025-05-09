import { render, screen, fireEvent } from "@testing-library/react";
import { PatientList } from "../PatientList";
import { usePatients } from "@/lib/hooks/useApi";
import { BrowserRouter } from "react-router-dom";

// Mock the usePatients hook
jest.mock("@/lib/hooks/useApi", () => ({
  usePatients: jest.fn(),
}));

describe("PatientList", () => {
  const mockPatients = [
    {
      id: "1",
      clientId: "1",
      name: "Buddy",
      species: "DOG",
      breed: "Golden Retriever",
      age: 3,
      weight: 30,
      dateOfBirth: "2021-01-01",
      lastVisit: "2024-01-15",
      gender: "male",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      microchipNumber: "123456789",
      color: "Golden",
      allergies: ["Penicillin"],
      medicalConditions: ["None"],
      vaccinations: [
        {
          name: "Rabies",
          date: "2023-01-01",
          nextDueDate: "2024-01-01",
        },
      ],
      notes: "Friendly and well-behaved",
      alerts: [],
    },
  ];

  beforeEach(() => {
    (usePatients as jest.Mock).mockReturnValue({
      data: mockPatients,
      isLoading: false,
      error: null,
    });
  });

  it("renders loading state", () => {
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

    expect(screen.getByText("Loading patients...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (usePatients as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to load patients"),
    });

    render(
      <BrowserRouter>
        <PatientList />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Error loading patients: Failed to load patients")
    ).toBeInTheDocument();
  });

  it("renders patients list", () => {
    render(
      <BrowserRouter>
        <PatientList />
      </BrowserRouter>
    );

    expect(screen.getByText("Patients")).toBeInTheDocument();
    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.getByText("Golden Retriever")).toBeInTheDocument();
  });

  it("filters patients based on search query", () => {
    render(
      <BrowserRouter>
        <PatientList />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search patients...");
    fireEvent.change(searchInput, { target: { value: "Buddy" } });

    expect(screen.getByText("Buddy")).toBeInTheDocument();
  });
});
