import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFlowComparisonViewModel } from "@/viewmodels/useFlowComparisonViewModel";

describe("useFlowComparisonViewModel", () => {
  it("returns consistent flow summary", () => {
    const { result } = renderHook(() => useFlowComparisonViewModel());
    const { summary } = result.current;
    expect(summary.netFlow).toBe(summary.totalInflow - summary.totalOutflow);
    expect(summary.totalInflow).toBeGreaterThan(0);
  });

  it("returns netFlowData with net field", () => {
    const { result } = renderHook(() => useFlowComparisonViewModel());
    const { netFlowData } = result.current;
    expect(netFlowData.length).toBeGreaterThan(0);
    for (const entry of netFlowData) {
      expect(entry.net).toBe(entry.inflow - entry.outflow);
    }
  });

  it("flowData length matches netFlowData length", () => {
    const { result } = renderHook(() => useFlowComparisonViewModel());
    expect(result.current.flowData.length).toBe(result.current.netFlowData.length);
  });
});
