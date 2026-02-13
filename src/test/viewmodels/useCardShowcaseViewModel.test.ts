import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCardShowcaseViewModel } from "@/viewmodels/useCardShowcaseViewModel";

describe("useCardShowcaseViewModel", () => {
  it("returns cards with colorScheme and utilization", () => {
    const { result } = renderHook(() => useCardShowcaseViewModel(true));
    const { cards } = result.current;
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      expect(card.colorScheme).toHaveProperty("textPrimary");
      expect(card.utilization).toBeGreaterThanOrEqual(0);
      expect(card.utilization).toBeLessThanOrEqual(100);
    }
  });

  it("formats balance as visible when showBalance is true", () => {
    const { result } = renderHook(() => useCardShowcaseViewModel(true));
    const formatted = result.current.formatBalance(3250);
    expect(formatted).toBe("$3,250");
  });

  it("masks balance when showBalance is false", () => {
    const { result } = renderHook(() => useCardShowcaseViewModel(false));
    const formatted = result.current.formatBalance(3250);
    expect(formatted).toBe("******");
  });

  it("returns correct card count", () => {
    const { result } = renderHook(() => useCardShowcaseViewModel(true));
    expect(result.current.cardCount).toBe(result.current.cards.length);
  });
});
