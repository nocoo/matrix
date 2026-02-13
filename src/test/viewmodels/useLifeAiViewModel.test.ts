import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLifeAiViewModel } from "@/viewmodels/useLifeAiViewModel";

describe("useLifeAiViewModel", () => {
  it("returns non-empty stats array", () => {
    const { result } = renderHook(() => useLifeAiViewModel());
    expect(result.current.stats.length).toBeGreaterThan(0);
    result.current.stats.forEach((s) => {
      expect(s).toHaveProperty("title");
      expect(s).toHaveProperty("value");
    });
  });

  it("returns non-empty timeline with required fields", () => {
    const { result } = renderHook(() => useLifeAiViewModel());
    expect(result.current.timeline.length).toBeGreaterThan(0);
    result.current.timeline.forEach((e) => {
      expect(e).toHaveProperty("id");
      expect(e).toHaveProperty("time");
      expect(e).toHaveProperty("title");
    });
  });

  it("computes activeEventCount and totalCalories from timeline", () => {
    const { result } = renderHook(() => useLifeAiViewModel());
    expect(result.current.activeEventCount).toBeGreaterThan(0);
    expect(result.current.totalCalories).toBeGreaterThan(0);
  });

  it("returns heatmap data for a full year", () => {
    const { result } = renderHook(() => useLifeAiViewModel());
    // 2026 has 365 days
    expect(result.current.heatmapData.length).toBe(365);
  });

  it("navigates to previous day", () => {
    const { result } = renderHook(() => useLifeAiViewModel());
    const initialDate = result.current.selectedDate.getDate();
    act(() => {
      result.current.goToPrevDay();
    });
    expect(result.current.selectedDate.getDate()).toBe(initialDate - 1);
  });

  it("navigates to next day", () => {
    const { result } = renderHook(() => useLifeAiViewModel());
    const initialDate = result.current.selectedDate.getDate();
    act(() => {
      result.current.goToNextDay();
    });
    expect(result.current.selectedDate.getDate()).toBe(initialDate + 1);
  });

  it("returns chart data arrays", () => {
    const { result } = renderHook(() => useLifeAiViewModel());
    expect(result.current.weeklySteps.length).toBe(7);
    expect(result.current.monthlySleep.length).toBe(12);
    expect(result.current.activityBreakdown.length).toBeGreaterThan(0);
  });
});
