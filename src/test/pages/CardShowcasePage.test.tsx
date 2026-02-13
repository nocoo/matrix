import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CardShowcasePage from "@/pages/CardShowcasePage";

vi.mock("@/viewmodels/useCardShowcaseViewModel", () => ({
  useCardShowcaseViewModel: (showBalance: boolean) => ({
    cards: [
      {
        name: "Platinum",
        bank: "Chase",
        number: "**** **** **** 4242",
        expiry: "12/28",
        balance: 3500,
        limit: 10000,
        network: "visa" as const,
        color: "from-gray-800 to-gray-900",
        colorScheme: {
          textPrimary: "text-white",
          textSecondary: "text-gray-300",
          textMuted: "text-gray-400",
          chipHighContrast: true,
          overlayOpacity: { large: "bg-white/5", small: "bg-white/5" },
        },
        utilization: 35,
      },
    ],
    cardCount: 1,
    formatBalance: showBalance
      ? (balance: number) => `$${balance.toLocaleString()}`
      : () => "******",
  }),
}));

describe("CardShowcasePage", () => {
  it("renders card count", () => {
    render(<CardShowcasePage />);
    expect(screen.getByText(/1 cards in vault/)).toBeInTheDocument();
  });

  it("renders card bank", () => {
    render(<CardShowcasePage />);
    expect(screen.getByText("Chase")).toBeInTheDocument();
  });

  it("renders hide/show toggle", () => {
    render(<CardShowcasePage />);
    expect(screen.getByText("[HIDE]")).toBeInTheDocument();
  });

  it("toggles balance visibility", () => {
    render(<CardShowcasePage />);
    const toggle = screen.getByText("[HIDE]");
    fireEvent.click(toggle);
    expect(screen.getByText("[SHOW]")).toBeInTheDocument();
  });
});
