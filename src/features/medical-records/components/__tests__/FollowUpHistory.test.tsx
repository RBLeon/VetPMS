import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FollowUpHistory } from "../FollowUpHistory";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

describe("FollowUpHistory", () => {
  const mockRecordId = "123";

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <FollowUpHistory recordId={mockRecordId} />
      </QueryClientProvider>
    );
  };

  it("renders the follow-up history with record information", () => {
    renderComponent();
    expect(screen.getByText("Controle Afspraken")).toBeInTheDocument();
    expect(screen.getByText("Record ID: 123")).toBeInTheDocument();
  });

  it("displays empty state when no follow-ups exist", () => {
    renderComponent();
    expect(
      screen.getByText("Geen controle afspraken gevonden")
    ).toBeInTheDocument();
  });

  // TODO: Add more tests when follow-up functionality is implemented
});
