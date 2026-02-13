import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ComponentShowcasePage from "@/pages/ComponentShowcasePage";

vi.mock("@/viewmodels/useComponentShowcaseViewModel", () => ({
  useComponentShowcaseViewModel: () => ({
    tasks: [
      {
        id: "heartbeat",
        executor: "shell",
        description: "System heartbeat",
        timeout: 60,
        command: "echo ok",
        schedules: [{ task: "heartbeat", hour: "*", minute: 10, weekday: "*" }],
      },
    ],
    runs: [
      { id: "r1", task: "heartbeat", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T09:10:00Z" },
    ],
    allRuns: [
      { id: "r1", task: "heartbeat", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T09:10:00Z" },
    ],
    runDetail: { id: "r1", task: "heartbeat", trigger: "auto", started_at: "2026-01-24T09:00:00Z", exit_code: 0 },
    heatmap: [{ date: "2026-01-24T10:00:00", count: 3, success: 3, failed: 0 }],
    trend: [{ date: "2026-01-24", total: 50, success: 45, successRate: 0.9 }],
    upcomingTasks: [],
    leaderboard: [{ rank: 1, name: "NEO", value: 9999, isTheOne: true }],
    modelUsage: [{ model: "test-model", cost: 10, percent: 100 }],
    fleetData: [{ label: "Fleet", usd: 100, models: [{ id: "m1", name: "M1", share: 1, calc: "1x$100" }] }],
    neuralFleetData: [{ label: "TEST", totalPercent: 100, usage: 100000, models: [{ name: "m1", share: 100 }] }],
    trendMonitorData: [50, 60, 70, 80],
    simpleTrendData: [10, 20, 30],
    activityHeatmap: {
      weeks: [[{ day: "2026-01-01", value: 5, level: 1 }]],
      to: "2026-01-01",
      week_starts_on: "mon",
    },
    topModelRows: [{ name: "test-model", percent: "100" }],
    executorCounts: { shell: 1 },
    totalSchedules: 1,
    successRate: 1,
    runPage: 1,
    totalRunPages: 1,
    setRunPage: vi.fn(),
    selectedRun: null,
    selectedTask: null,
    showAddTask: false,
    showCostModal: false,
    runOutput: "mock output",
    handleSelectRun: vi.fn(),
    handleSelectTask: vi.fn(),
    handleCloseRunDetail: vi.fn(),
    handleCloseTaskDetail: vi.fn(),
    handleOpenAddTask: vi.fn(),
    handleCloseAddTask: vi.fn(),
    handleOpenCostModal: vi.fn(),
    handleCloseCostModal: vi.fn(),
  }),
}));

describe("ComponentShowcasePage", () => {
  it("renders Foundation Components section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Foundation Components")).toBeInTheDocument();
  });

  it("renders Matrix Clock section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Matrix Clock")).toBeInTheDocument();
  });

  it("renders Data Visualization section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Data Visualization")).toBeInTheDocument();
  });

  it("renders Tables & Lists section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Tables & Lists")).toBeInTheDocument();
  });

  it("renders Colors & Typography section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Colors & Typography")).toBeInTheDocument();
  });

  it("renders Status Indicators section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Status Indicators")).toBeInTheDocument();
  });

  it("renders Matrix Avatars section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Matrix Avatars")).toBeInTheDocument();
  });

  it("renders Text Animations section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Text Animations")).toBeInTheDocument();
  });

  it("renders Containers & Inputs section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Containers & Inputs")).toBeInTheDocument();
  });

  it("renders Connection Status section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Connection Status")).toBeInTheDocument();
  });

  it("renders Neural Fleet Visualization section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Neural Fleet Visualization")).toBeInTheDocument();
  });

  it("renders Summary Statistics section", () => {
    render(<ComponentShowcasePage />);
    expect(screen.getByText("Summary Statistics")).toBeInTheDocument();
  });
});
