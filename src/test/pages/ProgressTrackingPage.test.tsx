import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgressTrackingPage from "@/pages/ProgressTrackingPage";

vi.mock("@/viewmodels/useProgressTrackingViewModel", () => ({
  useProgressTrackingViewModel: () => ({
    summary: { totalSpent: 2400, totalLimit: 5000, remaining: 2600 },
    categories: [
      { category: "Food", spent: 800, limit: 1200, progress: 67, color: "#00FF41" },
      { category: "Transport", spent: 300, limit: 500, progress: 60, color: "#33FF66" },
    ],
    comparisonData: [{ month: "Jan", budget: 5000, actual: 4200 }],
  }),
}));

describe("ProgressTrackingPage", () => {
  it("renders summary sections", () => {
    render(<ProgressTrackingPage />);
    expect(screen.getByText("TOTAL SPENT")).toBeInTheDocument();
    expect(screen.getByText("TOTAL LIMIT")).toBeInTheDocument();
    expect(screen.getByText("REMAINING")).toBeInTheDocument();
  });

  it("renders budget categories section", () => {
    render(<ProgressTrackingPage />);
    expect(screen.getByText("BUDGET CATEGORIES")).toBeInTheDocument();
  });

  it("renders category names", () => {
    render(<ProgressTrackingPage />);
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
  });

  it("renders budget vs actual section", () => {
    render(<ProgressTrackingPage />);
    expect(screen.getByText("BUDGET VS ACTUAL")).toBeInTheDocument();
  });
});
