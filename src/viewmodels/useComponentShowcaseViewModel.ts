// ViewModel for the Component Showcase page.
// Composes model logic with local UI state — View consumes this hook only.

import { useMemo, useCallback, useState } from "react";
import {
  createMockTasks,
  createMockRuns,
  createMockRunDetail,
  createMockHeatmap,
  createMockTrend,
  createMockUpcomingTasks,
  createMockLeaderboard,
  createMockModelUsage,
  createMockFleetData,
  createMockNeuralFleetData,
  createMockTrendMonitorData,
  MOCK_RUN_OUTPUT,
  countTasksByExecutor,
  countTotalSchedules,
  calculateSuccessRate,
  getTotalPages,
} from "@/models/component-showcase";
import type { RunDetail, TaskWithSchedule } from "@/models/types";

const PAGE_SIZE = 5;

export function useComponentShowcaseViewModel() {
  // ── UI state ──────────────────────────────────────
  const [runPage, setRunPage] = useState(1);
  const [selectedRun, setSelectedRun] = useState<RunDetail | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskWithSchedule | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);

  // ── Data (all deterministic mocks, computed once) ─
  const tasks = useMemo(() => createMockTasks(), []);
  const runs = useMemo(() => createMockRuns(), []);
  const runDetail = useMemo(() => createMockRunDetail(), []);
  const heatmap = useMemo(() => createMockHeatmap(), []);
  const trend = useMemo(() => createMockTrend(), []);
  const upcomingTasks = useMemo(() => createMockUpcomingTasks(tasks), [tasks]);
  const leaderboard = useMemo(() => createMockLeaderboard(), []);
  const modelUsage = useMemo(() => createMockModelUsage(), []);
  const fleetData = useMemo(() => createMockFleetData(), []);
  const neuralFleetData = useMemo(() => createMockNeuralFleetData(), []);
  const trendMonitorData = useMemo(() => createMockTrendMonitorData(30), []);

  // ── Derived data ──────────────────────────────────
  const executorCounts = useMemo(() => countTasksByExecutor(tasks), [tasks]);
  const totalSchedules = useMemo(() => countTotalSchedules(tasks), [tasks]);
  const successRate = useMemo(() => calculateSuccessRate(runs), [runs]);
  const totalRunPages = useMemo(() => getTotalPages(runs.length, PAGE_SIZE), [runs]);

  const pagedRuns = useMemo(
    () => runs.slice((runPage - 1) * PAGE_SIZE, runPage * PAGE_SIZE),
    [runs, runPage],
  );

  const topModelRows = useMemo(
    () => modelUsage.map((m) => ({ name: m.model, percent: String(m.percent) })),
    [modelUsage],
  );

  // ── Simple bar chart data ─────────────────────────
  const simpleTrendData = useMemo(
    () => [20, 45, 32, 67, 89, 54, 42, 78, 65, 91, 38, 55],
    [],
  );

  // ── Activity heatmap (GitHub-style) ───────────────
  const activityHeatmap = useMemo(
    () => ({
      weeks: Array.from({ length: 12 }, (_, weekIdx) =>
        Array.from({ length: 7 }, (_, dayIdx) => {
          // Deterministic pseudo-random based on indices
          const seed = (weekIdx * 7 + dayIdx + 1) * 2654435761;
          const value = ((seed >>> 0) % 100);
          const level = Math.min(4, Math.floor(value / 20));
          return {
            day: `2026-01-${String(weekIdx * 7 + dayIdx + 1).padStart(2, "0")}`,
            value,
            level,
          };
        }),
      ),
      to: "2026-01-24",
      week_starts_on: "mon" as const,
    }),
    [],
  );

  // ── Actions ───────────────────────────────────────
  const handleSelectRun = useCallback(
    (id: string | null) => {
      if (id) {
        setSelectedRun(runDetail);
      } else {
        setSelectedRun(null);
      }
    },
    [runDetail],
  );

  const handleSelectTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) setSelectedTask(task);
    },
    [tasks],
  );

  const handleCloseRunDetail = useCallback(() => setSelectedRun(null), []);
  const handleCloseTaskDetail = useCallback(() => setSelectedTask(null), []);
  const handleOpenAddTask = useCallback(() => setShowAddTask(true), []);
  const handleCloseAddTask = useCallback(() => setShowAddTask(false), []);
  const handleOpenCostModal = useCallback(() => setShowCostModal(true), []);
  const handleCloseCostModal = useCallback(() => setShowCostModal(false), []);

  return {
    // Data
    tasks,
    runs: pagedRuns,
    allRuns: runs,
    runDetail,
    heatmap,
    trend,
    upcomingTasks,
    leaderboard,
    modelUsage,
    fleetData,
    neuralFleetData,
    trendMonitorData,
    simpleTrendData,
    activityHeatmap,
    topModelRows,

    // Derived
    executorCounts,
    totalSchedules,
    successRate,

    // Pagination
    runPage,
    totalRunPages,
    setRunPage,

    // UI state
    selectedRun,
    selectedTask,
    showAddTask,
    showCostModal,

    // Run output (static mock for detail modal)
    runOutput: MOCK_RUN_OUTPUT,

    // Actions
    handleSelectRun,
    handleSelectTask,
    handleCloseRunDetail,
    handleCloseTaskDetail,
    handleOpenAddTask,
    handleCloseAddTask,
    handleOpenCostModal,
    handleCloseCostModal,
  };
}
