import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "@/pages/DashboardPage";

// Mock animated components
vi.mock("@/components/ui/MatrixExtras", async () => {
  const actual = await vi.importActual("@/components/ui/MatrixExtras");
  return {
    ...actual,
    TypewriterText: ({ text, className }: { text: string; className?: string }) => (
      <span className={className}>{text}</span>
    ),
    ConnectionStatus: ({ status, className }: { status?: string; className?: string }) => (
      <span className={className} data-testid="connection-status">{status ?? "STABLE"}</span>
    ),
  };
});

// Mock TrendMonitor (renders SVG with timers)
vi.mock("@/components/ui/DataVizComponents", () => ({
  TrendMonitor: ({ label }: { label?: string }) => (
    <div data-testid="trend-monitor">{label ?? "TREND"}</div>
  ),
}));

// Mock MatrixClock (uses intervals)
vi.mock("@/components/ui/RunnerComponents", () => ({
  MatrixClock: ({ label }: { label?: string }) => (
    <div data-testid="matrix-clock">{label ?? "CLOCK"}</div>
  ),
}));

// Mock IdentityCard (uses ScrambleText animation)
vi.mock("@/components/ui/VibeComponents", () => ({
  IdentityCard: ({ name, title }: { name?: string; title?: string }) => (
    <div data-testid="identity-card">
      <span>{title ?? "IDENTITY"}</span>
      <span>{name ?? "UNKNOWN"}</span>
    </div>
  ),
}));

const mockState = vi.hoisted(() => ({
  accountList: [
    { name: "Checking", balance: 5000, change: "+2.4%" },
    { name: "Savings", balance: 10000, change: "-1.2%" },
  ],
  activityList: [
    { desc: "Salary", amount: 3200, date: "Jan 15", direction: "positive" as const, formattedAmount: "+$3,200" },
    { desc: "Grocery Store", amount: -45.5, date: "Jan 15", direction: "negative" as const, formattedAmount: "$45.50" },
  ],
  activitySummary: { totalIn: 3200, totalOut: 1800, net: 1400 },
  goals: [
    { name: "Emergency Fund", icon: "shield", saved: 7500, target: 10000, percent: 75, monthlyTarget: 417, onTrack: true },
    { name: "Vacation Trip", icon: "plane", saved: 2200, target: 5000, percent: 44, monthlyTarget: 467, onTrack: false },
  ],
  budgetRows: [
    { category: "Food & Dining", spent: 420, limit: 600, percent: 70, overBudget: false },
    { category: "Utilities", spent: 245, limit: 250, percent: 98, overBudget: false },
  ],
  trendData: [5000, 6000, 5500, 7000, 6500],
  flowData: [
    { month: "Jan", inflow: 6800, outflow: 5300, net: 1500 },
    { month: "Feb", inflow: 7900, outflow: 5100, net: 2800 },
  ],
  pixelHeatmap: [
    { row: 0, col: 0, value: 2 },
    { row: 0, col: 1, value: 10 },
    { row: 0, col: 2, value: 0 },
    { row: 1, col: 0, value: 10 },
  ],
  pixelHeatmapRows: 9,
  pixelHeatmapCols: 26,
  pixelHeatmapMax: 10,
  signalRows: [
    { label: "CPU LOAD", value: "23%", trend: [12, 18, 15, 22, 19, 23], status: "nominal" },
    { label: "NET I/O", value: "1.2 GB/s", trend: [800, 950, 1100, 900], status: "nominal" },
    { label: "MEM USAGE", value: "67%", trend: [55, 58, 60, 63, 61, 67], status: "warning" },
  ],
}));

vi.mock("@/viewmodels/useDashboardViewModel", () => ({
  useDashboardViewModel: () => mockState,
}));

describe("DashboardPage", () => {
  it("renders system status section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("SYSTEM STATUS")).toBeInTheDocument();
  });

  it("renders welcome message via TypewriterText", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/welcome back, operator/)).toBeInTheDocument();
  });

  it("renders ConnectionStatus components", () => {
    render(<DashboardPage />);
    const statuses = screen.getAllByTestId("connection-status");
    expect(statuses.length).toBeGreaterThanOrEqual(1);
  });

  it("renders MatrixClock section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("CHRONOMETER")).toBeInTheDocument();
    expect(screen.getByTestId("matrix-clock")).toBeInTheDocument();
    expect(screen.getByText("SYSTEM TIME")).toBeInTheDocument();
  });

  it("renders IdentityCard section", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("identity-card")).toBeInTheDocument();
    expect(screen.getByText("OPERATOR")).toBeInTheDocument();
  });

  it("renders pixel heatmap with data-testid", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("pixel-heatmap")).toBeInTheDocument();
    expect(screen.getByText("DATA VISUALIZATION")).toBeInTheDocument();
  });

  it("renders heatmap legend", () => {
    render(<DashboardPage />);
    expect(screen.getByText("less")).toBeInTheDocument();
    expect(screen.getByText("more")).toBeInTheDocument();
  });

  it("renders heatmap cells based on pixelHeatmap data", () => {
    render(<DashboardPage />);
    const grid = screen.getByTestId("pixel-heatmap");
    // Mock has 4 cells
    expect(grid.children.length).toBe(4);
  });

  it("renders target goals section with goal names", () => {
    render(<DashboardPage />);
    expect(screen.getByText("EMERGENCY FUND")).toBeInTheDocument();
    expect(screen.getByText("VACATION TRIP")).toBeInTheDocument();
  });

  it("renders on track / behind status for goals", () => {
    render(<DashboardPage />);
    expect(screen.getByText("on track")).toBeInTheDocument();
    expect(screen.getByText("behind")).toBeInTheDocument();
  });

  it("renders goal progress percentages", () => {
    render(<DashboardPage />);
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("44%")).toBeInTheDocument();
  });

  it("renders account cards with balances", () => {
    render(<DashboardPage />);
    expect(screen.getByText("CHECKING")).toBeInTheDocument();
    expect(screen.getByText("SAVINGS")).toBeInTheDocument();
  });

  it("renders accounts with positive and negative changes", () => {
    render(<DashboardPage />);
    expect(screen.getByText("+2.4%")).toBeInTheDocument();
    expect(screen.getByText("-1.2%")).toBeInTheDocument();
  });

  it("renders signal monitor card with signal rows", () => {
    render(<DashboardPage />);
    expect(screen.getByText("SIGNAL MONITOR")).toBeInTheDocument();
    expect(screen.getByText("CPU LOAD")).toBeInTheDocument();
    expect(screen.getByText("NET I/O")).toBeInTheDocument();
    expect(screen.getByText("MEM USAGE")).toBeInTheDocument();
    expect(screen.getByText("23%")).toBeInTheDocument();
    expect(screen.getByText("1.2 GB/s")).toBeInTheDocument();
  });

  it("renders budget tracker", () => {
    render(<DashboardPage />);
    expect(screen.getByText("BUDGET TRACKER")).toBeInTheDocument();
    expect(screen.getByText("Food & Dining")).toBeInTheDocument();
    expect(screen.getByText("Utilities")).toBeInTheDocument();
  });

  it("renders 30-day trend monitor", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("trend-monitor")).toBeInTheDocument();
    expect(screen.getByText("30-DAY TREND")).toBeInTheDocument();
  });

  it("renders cash flow section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("CASH FLOW")).toBeInTheDocument();
  });

  it("renders activity log section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("ACTIVITY LOG")).toBeInTheDocument();
  });

  it("renders flow summary section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("FLOW SUMMARY")).toBeInTheDocument();
  });

  it("renders positive and negative activity items", () => {
    render(<DashboardPage />);
    expect(screen.getByText("+$3,200")).toBeInTheDocument();
    expect(screen.getByText("$45.50")).toBeInTheDocument();
  });

  it("renders positive net in flow summary", () => {
    render(<DashboardPage />);
    expect(screen.getByText("$1400")).toBeInTheDocument();
  });

  it("renders status summary with account and target counts", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/2 accounts active/)).toBeInTheDocument();
  });
});

describe("DashboardPage with negative net", () => {
  beforeEach(() => {
    mockState.accountList = [{ name: "Checking", balance: 500, change: "-5.0%" }];
    mockState.activityList = [
      { desc: "Rent", amount: -2000, date: "Jan 1", direction: "negative" as const, formattedAmount: "$2,000" },
    ];
    mockState.activitySummary = { totalIn: 500, totalOut: 2000, net: -1500 };
  });

  it("renders negative net in flow summary", () => {
    render(<DashboardPage />);
    expect(screen.getByText("$1500")).toBeInTheDocument();
  });

  it("applies red color class for negative net", () => {
    render(<DashboardPage />);
    const netEl = screen.getByText("$1500");
    expect(netEl.className).toContain("text-red-400");
  });
});
