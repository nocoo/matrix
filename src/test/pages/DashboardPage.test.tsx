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
  statCards: [
    { label: "Avg. Daily Spend", value: "$142", change: "-3.2%", isPositive: false },
    { label: "Savings Rate", value: "24%", change: "+2.1%", isPositive: true },
  ],
  trendData: [5000, 6000, 5500, 7000, 6500],
  flowData: [
    { month: "Jan", inflow: 6800, outflow: 5300, net: 1500 },
    { month: "Feb", inflow: 7900, outflow: 5100, net: 2800 },
  ],
  portfolioRows: [
    { name: "Stocks", value: 45000, allocation: 45, change: "+12.4%", up: true },
    { name: "Crypto", value: 10000, allocation: 10, change: "-5.1%", up: false },
  ],
  totalPortfolioValue: 100000,
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

  it("renders quick stats cards", () => {
    render(<DashboardPage />);
    expect(screen.getByText("AVG. DAILY SPEND")).toBeInTheDocument();
    expect(screen.getByText("SAVINGS RATE")).toBeInTheDocument();
    expect(screen.getByText("$142")).toBeInTheDocument();
    expect(screen.getByText("24%")).toBeInTheDocument();
  });

  it("renders budget tracker", () => {
    render(<DashboardPage />);
    expect(screen.getByText("BUDGET TRACKER")).toBeInTheDocument();
    // Category text is rendered lowercase with CSS uppercase — match original case
    expect(screen.getByText("Food & Dining")).toBeInTheDocument();
    expect(screen.getByText("Utilities")).toBeInTheDocument();
  });

  it("renders 30-day trend monitor", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("trend-monitor")).toBeInTheDocument();
    expect(screen.getByText("30-DAY TREND")).toBeInTheDocument();
  });

  it("renders portfolio section with total value", () => {
    render(<DashboardPage />);
    expect(screen.getByText("PORTFOLIO")).toBeInTheDocument();
    expect(screen.getByText("$100,000")).toBeInTheDocument();
  });

  it("renders portfolio assets with positive and negative changes", () => {
    render(<DashboardPage />);
    expect(screen.getByText("+12.4%")).toBeInTheDocument();
    expect(screen.getByText("-5.1%")).toBeInTheDocument();
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
    // Text contains middot separator, use regex on the single span
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
