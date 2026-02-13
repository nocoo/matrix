import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsOverviewPage from "@/pages/StatsOverviewPage";

vi.mock("@/viewmodels/useStatsOverviewViewModel", () => ({
  useStatsOverviewViewModel: () => ({
    stats: [
      { label: "Total Income", value: "$12,500", change: "+8.2%", changeColorClass: "text-matrix-primary" },
      { label: "Total Expenses", value: "$8,300", change: "-2.1%", changeColorClass: "text-red-500" },
    ],
    weeklyData: [{ day: "Mon", income: 1800, expense: 1200 }],
    categoryData: [{ name: "Food", percentage: 35, amount: 2800 }],
    trendData: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, value: 1000 + i * 100 })),
  }),
}));

describe("StatsOverviewPage", () => {
  it("renders chart sections", () => {
    render(<StatsOverviewPage />);
    expect(screen.getByText("30-DAY TREND")).toBeInTheDocument();
    expect(screen.getByText("WEEKLY INCOME VS EXPENSE")).toBeInTheDocument();
    expect(screen.getByText("SPENDING BY CATEGORY")).toBeInTheDocument();
  });

  it("renders stat labels", () => {
    render(<StatsOverviewPage />);
    expect(screen.getByText("TOTAL INCOME")).toBeInTheDocument();
    expect(screen.getByText("TOTAL EXPENSES")).toBeInTheDocument();
  });

  it("renders stat values", () => {
    render(<StatsOverviewPage />);
    expect(screen.getByText("$12,500")).toBeInTheDocument();
    expect(screen.getByText("$8,300")).toBeInTheDocument();
  });
});
