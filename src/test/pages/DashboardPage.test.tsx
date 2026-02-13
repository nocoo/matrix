import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "@/pages/DashboardPage";

vi.mock("@/viewmodels/useAccountsViewModel", () => ({
  useAccountsViewModel: () => ({
    accountList: [
      { name: "Checking", balance: 5000, change: "+2.4%" },
    ],
    activityList: [
      { desc: "Grocery Store", amount: -45.5, date: "Jan 15", direction: "negative" as const, formattedAmount: "$45.50" },
    ],
    activitySummary: { totalIn: 3200, totalOut: 1800, net: 1400 },
  }),
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
});
