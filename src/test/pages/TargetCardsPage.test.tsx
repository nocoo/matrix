import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TargetCardsPage from "@/pages/TargetCardsPage";

vi.mock("@/components/ui", () => ({
  ConnectionStatus: ({ status }: { status: string }) => (
    <span data-testid="connection-status">[{status}]</span>
  ),
}));

vi.mock("@/viewmodels/useTargetCardsViewModel", () => ({
  useTargetCardsViewModel: () => ({
    goals: [
      { name: "Emergency Fund", icon: "shield", saved: 8000, target: 10000, percent: 80, monthlyTarget: 500, onTrack: true, deadline: "Dec 2026", daysRemaining: 320 },
      { name: "Vacation", icon: "plane", saved: 1500, target: 5000, percent: 30, monthlyTarget: 700, onTrack: false, deadline: "Jun 2026", daysRemaining: 120 },
    ],
  }),
}));

describe("TargetCardsPage", () => {
  it("renders goal names as section titles", () => {
    render(<TargetCardsPage />);
    expect(screen.getByText("EMERGENCY FUND")).toBeInTheDocument();
    expect(screen.getByText("VACATION")).toBeInTheDocument();
  });

  it("renders on track / behind status", () => {
    render(<TargetCardsPage />);
    expect(screen.getByText("on track")).toBeInTheDocument();
    expect(screen.getByText("behind")).toBeInTheDocument();
  });

  it("renders monthly target guidance", () => {
    render(<TargetCardsPage />);
    expect(screen.getAllByText(/to reach target/).length).toBeGreaterThanOrEqual(1);
  });
});
