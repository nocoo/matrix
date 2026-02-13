import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "@/pages/DashboardPage";

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
}));

vi.mock("@/viewmodels/useAccountsViewModel", () => ({
  useAccountsViewModel: () => mockState,
}));

describe("DashboardPage", () => {
  it("renders system status section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("SYSTEM STATUS")).toBeInTheDocument();
  });

  it("renders welcome message", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/welcome back, operator/)).toBeInTheDocument();
  });

  it("renders activity log section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("ACTIVITY LOG")).toBeInTheDocument();
  });

  it("renders flow summary section", () => {
    render(<DashboardPage />);
    expect(screen.getByText("FLOW SUMMARY")).toBeInTheDocument();
  });

  it("renders accounts with positive and negative changes", () => {
    render(<DashboardPage />);
    expect(screen.getByText("+2.4%")).toBeInTheDocument();
    expect(screen.getByText("-1.2%")).toBeInTheDocument();
  });

  it("renders positive and negative activity items", () => {
    render(<DashboardPage />);
    expect(screen.getByText("+$3,200")).toBeInTheDocument();
    expect(screen.getByText("$45.50")).toBeInTheDocument();
  });

  it("renders positive net in flow summary", () => {
    render(<DashboardPage />);
    // net >= 0 should use matrix-primary color
    expect(screen.getByText("$1400")).toBeInTheDocument();
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
