import { render, screen } from "@testing-library/react";
import { AnalyticsPage } from "../AnalyticsPage";
import { vi } from "vitest";

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

describe("AnalyticsPage", () => {
  it("renders the page title and description", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(
      screen.getByText("Inzicht in de prestaties van uw praktijk")
    ).toBeInTheDocument();
  });

  it("renders the action buttons", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Periode")).toBeInTheDocument();
    expect(screen.getByText("Exporteer")).toBeInTheDocument();
  });

  it("renders the statistics cards", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Totaal patiënten")).toBeInTheDocument();
    expect(screen.getByText("Afspraken deze maand")).toBeInTheDocument();
    expect(screen.getByText("Gemiddelde opkomst")).toBeInTheDocument();
    expect(screen.getByText("Omzet deze maand")).toBeInTheDocument();
  });

  it("renders period dropdown options", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Vandaag")).toBeInTheDocument();
    expect(screen.getByText("Deze week")).toBeInTheDocument();
    expect(screen.getByText("Deze maand")).toBeInTheDocument();
    expect(screen.getByText("Dit jaar")).toBeInTheDocument();
    expect(screen.getByText("Aangepast")).toBeInTheDocument();
  });

  it("displays correct statistics values", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("256")).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("€12,345")).toBeInTheDocument();
  });

  it("displays correct statistics trends", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("+12% van vorige maand")).toBeInTheDocument();
    expect(screen.getByText("+8% van vorige maand")).toBeInTheDocument();
    expect(screen.getByText("+2% van vorige maand")).toBeInTheDocument();
    expect(screen.getByText("+15% van vorige maand")).toBeInTheDocument();
  });

  it("renders the charts section", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Afspraken per dag")).toBeInTheDocument();
    expect(screen.getByText("Behandelingen per type")).toBeInTheDocument();
    const developmentMessages = screen.getAllByText(
      "Grafiek in ontwikkeling..."
    );
    expect(developmentMessages).toHaveLength(2);
  });

  it("renders the top treatments section", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Top behandelingen")).toBeInTheDocument();
    expect(screen.getByText("Vaccinatie")).toBeInTheDocument();
    expect(screen.getByText("Gebitsreiniging")).toBeInTheDocument();
    expect(screen.getByText("Controle")).toBeInTheDocument();
  });

  it("displays correct treatment counts", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("45 behandelingen")).toBeInTheDocument();
    expect(screen.getByText("32 behandelingen")).toBeInTheDocument();
    expect(screen.getByText("28 behandelingen")).toBeInTheDocument();
  });

  it("displays correct treatment categories", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Preventieve zorg")).toBeInTheDocument();
    expect(screen.getByText("Tandheelkunde")).toBeInTheDocument();
    expect(screen.getByText("Algemeen")).toBeInTheDocument();
  });
});
