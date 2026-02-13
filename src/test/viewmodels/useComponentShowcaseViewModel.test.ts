import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useComponentShowcaseViewModel } from "@/viewmodels/useComponentShowcaseViewModel";

describe("useComponentShowcaseViewModel", () => {
  it("returns mock tasks", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.tasks).toHaveLength(5);
  });

  it("returns paged runs (page 1)", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    // 10 total runs, page size 5 => first page has 5
    expect(result.current.runs).toHaveLength(5);
    expect(result.current.allRuns).toHaveLength(10);
  });

  it("paginates runs correctly", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.totalRunPages).toBe(2);

    act(() => result.current.setRunPage(2));
    expect(result.current.runPage).toBe(2);
    expect(result.current.runs).toHaveLength(5);
  });

  it("provides derived statistics", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.successRate).toBe(0.8);
    expect(result.current.totalSchedules).toBe(9);
    expect(result.current.executorCounts).toEqual({
      opencode: 3,
      shell: 1,
      http: 1,
    });
  });

  it("manages selectedRun state", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.selectedRun).toBeNull();

    act(() => result.current.handleSelectRun("run-001"));
    expect(result.current.selectedRun).toBeTruthy();
    expect(result.current.selectedRun?.id).toBe("run-001");

    act(() => result.current.handleCloseRunDetail());
    expect(result.current.selectedRun).toBeNull();
  });

  it("manages selectedTask state", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.selectedTask).toBeNull();

    act(() => result.current.handleSelectTask("heartbeat"));
    expect(result.current.selectedTask).toBeTruthy();
    expect(result.current.selectedTask?.id).toBe("heartbeat");

    act(() => result.current.handleCloseTaskDetail());
    expect(result.current.selectedTask).toBeNull();
  });

  it("manages addTask modal state", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.showAddTask).toBe(false);

    act(() => result.current.handleOpenAddTask());
    expect(result.current.showAddTask).toBe(true);

    act(() => result.current.handleCloseAddTask());
    expect(result.current.showAddTask).toBe(false);
  });

  it("manages cost modal state", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.showCostModal).toBe(false);

    act(() => result.current.handleOpenCostModal());
    expect(result.current.showCostModal).toBe(true);

    act(() => result.current.handleCloseCostModal());
    expect(result.current.showCostModal).toBe(false);
  });

  it("returns heatmap and trend data", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.heatmap.length).toBeGreaterThan(0);
    expect(result.current.trend).toHaveLength(14);
  });

  it("returns vibe mock data", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.leaderboard).toHaveLength(5);
    expect(result.current.modelUsage).toHaveLength(4);
    expect(result.current.fleetData).toHaveLength(2);
    expect(result.current.neuralFleetData).toHaveLength(2);
    expect(result.current.trendMonitorData).toHaveLength(30);
  });

  it("returns topModelRows transformed for TopModelsPanel", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.topModelRows).toHaveLength(4);
    result.current.topModelRows.forEach((r) => {
      expect(r).toHaveProperty("name");
      expect(r).toHaveProperty("percent");
      expect(typeof r.percent).toBe("string");
    });
  });

  it("returns activity heatmap for ActivityHeatmap component", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    const hm = result.current.activityHeatmap;
    expect(hm.weeks).toHaveLength(12);
    expect(hm.to).toBe("2026-01-24");
    expect(hm.week_starts_on).toBe("mon");
  });

  it("returns static run output", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    expect(result.current.runOutput.length).toBeGreaterThan(50);
  });

  it("handleSelectRun with null clears selection", () => {
    const { result } = renderHook(() => useComponentShowcaseViewModel());
    act(() => result.current.handleSelectRun("run-001"));
    expect(result.current.selectedRun).toBeTruthy();

    act(() => result.current.handleSelectRun(null));
    expect(result.current.selectedRun).toBeNull();
  });
});
