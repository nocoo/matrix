import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePortfolioViewModel } from "@/viewmodels/usePortfolioViewModel";

describe("usePortfolioViewModel", () => {
  it("returns totalValue as sum of holdings", () => {
    const { result } = renderHook(() => usePortfolioViewModel());
    const sum = result.current.holdings.reduce((s, h) => s + h.value, 0);
    expect(result.current.totalValue).toBe(sum);
  });

  it("returns non-empty holdings and performanceData", () => {
    const { result } = renderHook(() => usePortfolioViewModel());
    expect(result.current.holdings.length).toBeGreaterThan(0);
    expect(result.current.performanceData.length).toBe(12);
  });

  it("holdings have all required fields", () => {
    const { result } = renderHook(() => usePortfolioViewModel());
    for (const h of result.current.holdings) {
      expect(h).toHaveProperty("name");
      expect(h).toHaveProperty("value");
      expect(h).toHaveProperty("allocation");
      expect(h).toHaveProperty("change");
      expect(h).toHaveProperty("up");
    }
  });
});
