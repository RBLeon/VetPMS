import { render, screen } from "@testing-library/react";
import { BillingPage } from "../BillingPage";
import { vi } from "vitest";

// Mock the BillingList component
vi.mock("@/features/billing/BillingList", () => ({
  BillingList: () => <div data-testid="billing-list">Billing List</div>,
}));

// Mock the Radix UI dropdown menu
vi.mock("@radix-ui/react-dropdown-menu", () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  Content: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Item: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Sub: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SubTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SubContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CheckboxItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RadioGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  RadioItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Label: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Separator: () => <hr />,
}));

describe("BillingPage", () => {
  it("renders the page title and description", () => {
    render(<BillingPage />);
    expect(screen.getByText("Facturatie")).toBeInTheDocument();
    expect(
      screen.getByText("Beheer alle facturen en betalingen")
    ).toBeInTheDocument();
  });

  it("renders the action buttons", () => {
    render(<BillingPage />);
    expect(screen.getByText("Filter")).toBeInTheDocument();
    expect(screen.getByText("Exporteer")).toBeInTheDocument();
    expect(screen.getByText("Nieuwe factuur")).toBeInTheDocument();
  });

  it("renders the statistics cards", () => {
    render(<BillingPage />);
    expect(screen.getByText("Totaal openstaand")).toBeInTheDocument();
    expect(screen.getByText("Deze maand betaald")).toBeInTheDocument();
    expect(screen.getByText("Openstaande facturen")).toBeInTheDocument();
    expect(screen.getByText("Gemiddelde betalingstijd")).toBeInTheDocument();
  });

  it("renders the billing list", () => {
    render(<BillingPage />);
    expect(screen.getByTestId("billing-list")).toBeInTheDocument();
  });

  it("renders filter dropdown options", () => {
    render(<BillingPage />);
    expect(screen.getByText("Alle facturen")).toBeInTheDocument();
    expect(screen.getByText("Openstaand")).toBeInTheDocument();
    expect(screen.getByText("Betaald")).toBeInTheDocument();
    expect(screen.getByText("Vervallen")).toBeInTheDocument();
  });

  it("displays correct statistics values", () => {
    render(<BillingPage />);
    expect(screen.getByText("€2,500.00")).toBeInTheDocument();
    expect(screen.getByText("€4,200.00")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("14 dagen")).toBeInTheDocument();
  });

  it("displays correct statistics trends", () => {
    render(<BillingPage />);
    expect(screen.getByText("+20.1% van vorige maand")).toBeInTheDocument();
    expect(screen.getByText("+10.5% van vorige maand")).toBeInTheDocument();
    expect(screen.getByText("-2 van vorige maand")).toBeInTheDocument();
    expect(screen.getByText("-2 dagen van vorige maand")).toBeInTheDocument();
  });
});
