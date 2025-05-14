import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FollowUpHistory } from "../FollowUpHistory";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

describe("FollowUpHistory", () => {
  const mockFollowUps = [
    {
      id: "1",
      date: "2024-03-20",
      time: "10:00",
      notes: "Controle na operatie",
      status: "ACTIEF" as const,
    },
    {
      id: "2",
      date: "2024-03-25",
      time: "14:30",
      notes: "Vaccinatie controle",
      status: "OPGELOST" as const,
    },
  ];

  const mockPatient = {
    id: "1",
    name: "Max",
    species: "HOND",
    breed: "Labrador",
  };

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <FollowUpHistory patient={mockPatient} followUps={mockFollowUps} />
      </QueryClientProvider>
    );
  };

  it("renders the follow-up history with patient information", () => {
    renderComponent();

    expect(
      screen.getByText((_, element) => {
        return element?.textContent === "Max - Labrador (HOND)";
      })
    ).toBeInTheDocument();
  });

  it("displays all follow-up appointments", () => {
    renderComponent();

    // Use a more flexible text matcher for dates and times
    const dateElements = screen.getAllByText((_, element) => {
      return Boolean(
        element?.textContent?.includes("20 maart 2024") &&
          element?.textContent?.includes("10:00")
      );
    });
    expect(dateElements.length).toBeGreaterThan(0);

    expect(
      screen.getAllByText((_, element) => {
        return Boolean(
          element?.textContent?.includes("25 maart 2024") &&
            element?.textContent?.includes("14:30")
        );
      }).length
    ).toBeGreaterThan(0);

    expect(screen.getByText("Controle na operatie")).toBeInTheDocument();
    expect(screen.getByText("Vaccinatie controle")).toBeInTheDocument();
  });

  it("shows correct status badges", () => {
    renderComponent();

    expect(screen.getByText("Actief")).toBeInTheDocument();
    expect(screen.getByText("Opgelost")).toBeInTheDocument();
  });

  it("displays empty state when no follow-ups exist", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FollowUpHistory patient={mockPatient} followUps={[]} />
      </QueryClientProvider>
    );

    expect(
      screen.getByText("Geen controle afspraken gevonden")
    ).toBeInTheDocument();
  });

  it("formats dates in Dutch format", () => {
    renderComponent();

    const dateElements = screen.getAllByText(/\d{1,2} [a-z]+ \d{4}/i);
    expect(dateElements).toHaveLength(2);
  });
});
