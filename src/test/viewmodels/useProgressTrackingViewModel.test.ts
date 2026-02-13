import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useProgressTrackingViewModel } from "@/viewmodels/useProgressTrackingViewModel";

describe("useProgressTrackingViewModel", () => {
  it("returns summary with correct shape", () => {
    const { result } = renderHook(() => useProgressTrackingViewModel());
    const { summary } = result.current;
    expect(summary).toHaveProperty("totalSpent");
    expect(summary).toHaveProperty("totalLimit");
    expect(summary).toHaveProperty("remaining");
    expect(summary.remaining).toBe(summary.totalLimit - summary.totalSpent);
  });

  it("returns categories with progress and color", () => {
    const { result } = renderHook(() => useProgressTrackingViewModel());
    const { categories } = result.current;
    expect(categories.length).toBeGreaterThan(0);
    for (const cat of categories) {
      expect(cat).toHaveProperty("category");
      expect(cat).toHaveProperty("progress");
      expect(cat).toHaveProperty("color");
      expect(cat.progress).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns comparisonData as array", () => {
    const { result } = renderHook(() => useProgressTrackingViewModel());
    expect(Array.isArray(result.current.comparisonData)).toBe(true);
  });
});
