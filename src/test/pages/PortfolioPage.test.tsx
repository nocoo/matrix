import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PortfolioPage from "@/pages/PortfolioPage";

vi.mock("@/viewmodels/usePortfolioViewModel", () => ({
  usePortfolioViewModel: () => ({
    totalValue: 85000,
    holdings: [
      { name: "Bitcoin", value: 45000, allocation: 53, change: "+5.2%", up: true },
      { name: "Ethereum", value: 25000, allocation: 29, change: "-1.8%", up: false },
    ],
    performanceData: Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, value: 70000 + i * 1500 })),
  }),
}));

describe("PortfolioPage", () => {
  it("renders portfolio value section", () => {
    render(<PortfolioPage />);
    expect(screen.getByText("PORTFOLIO VALUE")).toBeInTheDocument();
  });

  it("renders performance section", () => {
    render(<PortfolioPage />);
    expect(screen.getByText("12-MONTH PERFORMANCE")).toBeInTheDocument();
  });

  it("renders holdings section", () => {
    render(<PortfolioPage />);
    expect(screen.getByText("HOLDINGS")).toBeInTheDocument();
  });

  it("renders holding names", () => {
    render(<PortfolioPage />);
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });
});
