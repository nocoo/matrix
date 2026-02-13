import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AccountsPage from "@/pages/AccountsPage";

vi.mock("@/viewmodels/useAccountsViewModel", () => ({
  useAccountsViewModel: () => ({
    accountList: [
      { name: "Checking", balance: 5000, change: "+2.4%" },
      { name: "Savings", balance: 12000, change: "+1.1%" },
    ],
    activityList: [
      { desc: "Grocery Store", amount: -45.5, date: "Jan 15", direction: "negative" as const, formattedAmount: "$45.50" },
      { desc: "Salary Deposit", amount: 3200, date: "Jan 14", direction: "positive" as const, formattedAmount: "+$3,200.00" },
    ],
    activitySummary: { totalIn: 3200, totalOut: 1800, net: 1400 },
  }),
}));

describe("AccountsPage", () => {
  it("renders total balance section", () => {
    render(<AccountsPage />);
    expect(screen.getByText("TOTAL BALANCE")).toBeInTheDocument();
  });

  it("renders recent activity section", () => {
    render(<AccountsPage />);
    expect(screen.getByText("RECENT ACTIVITY")).toBeInTheDocument();
  });

  it("renders account names as box titles", () => {
    render(<AccountsPage />);
    expect(screen.getByText("CHECKING")).toBeInTheDocument();
    expect(screen.getByText("SAVINGS")).toBeInTheDocument();
  });

  it("renders flow summary boxes", () => {
    render(<AccountsPage />);
    expect(screen.getByText("INFLOW")).toBeInTheDocument();
    expect(screen.getByText("OUTFLOW")).toBeInTheDocument();
    expect(screen.getByText("NET")).toBeInTheDocument();
  });
});
