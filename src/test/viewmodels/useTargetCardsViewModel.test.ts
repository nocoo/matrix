import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTargetCardsViewModel } from "@/viewmodels/useTargetCardsViewModel";

describe("useTargetCardsViewModel", () => {
  it("returns enriched goals with percent and monthlyTarget", () => {
    const { result } = renderHook(() => useTargetCardsViewModel());
    const { goals } = result.current;
    expect(goals.length).toBeGreaterThan(0);
    for (const goal of goals) {
      expect(goal).toHaveProperty("percent");
      expect(goal).toHaveProperty("monthlyTarget");
      expect(goal).toHaveProperty("onTrack");
      expect(goal.percent).toBeGreaterThanOrEqual(0);
      expect(goal.percent).toBeLessThanOrEqual(100);
    }
  });

  it("onTrack is true only for goals with >= 75% progress", () => {
    const { result } = renderHook(() => useTargetCardsViewModel());
    for (const goal of result.current.goals) {
      if (goal.percent >= 75) {
        expect(goal.onTrack).toBe(true);
      } else {
        expect(goal.onTrack).toBe(false);
      }
    }
  });
});
