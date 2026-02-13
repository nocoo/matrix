import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import {
  MatrixClock,
  TaskSchedule,
  RunHistory,
  RunHeatmap,
  RunnerTrendChart,
  UpcomingTasks,
  AddTaskModal,
  TaskDetailModal,
  RunDetailModal,
} from "@/components/ui/RunnerComponents";
import type {
  TaskWithSchedule,
  RunSummary,
  RunDetail,
  HeatmapCell,
  TrendPoint,
  UpcomingTask,
} from "@/models/types";

// ============================================
// Helper test data factories
// ============================================

function makeTask(overrides: Partial<TaskWithSchedule> = {}): TaskWithSchedule {
  return {
    id: "test-task",
    executor: "shell",
    description: "Test task description",
    timeout: 300,
    command: "echo hello",
    schedules: [],
    ...overrides,
  };
}

function makeRun(overrides: Partial<RunSummary> = {}): RunSummary {
  return {
    id: "run-1",
    task: "test-task",
    exit_code: 0,
    started_at: "2026-01-15T10:00:00Z",
    finished_at: "2026-01-15T10:01:00Z",
    ...overrides,
  };
}

function makeRunDetail(overrides: Partial<RunDetail> = {}): RunDetail {
  return {
    id: "run-1",
    task: "test-task",
    trigger: "auto",
    started_at: "2026-01-15T10:00:00Z",
    finished_at: "2026-01-15T10:01:00Z",
    duration_seconds: 60,
    exit_code: 0,
    ...overrides,
  };
}

// ============================================
// MatrixClock
// ============================================

describe("MatrixClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders time digits", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 14, 30, 45));
    render(<MatrixClock />);
    // The clock renders individual digit spans; check for separators ":"
    const colons = screen.getAllByText(":");
    expect(colons.length).toBe(2);
  });

  it("shows label when provided", () => {
    render(<MatrixClock label="SYSTEM TIME" />);
    expect(screen.getByText("SYSTEM TIME")).toBeInTheDocument();
  });

  it("does not show label when not provided", () => {
    render(<MatrixClock />);
    expect(screen.queryByText("SYSTEM TIME")).not.toBeInTheDocument();
  });

  it("updates clock after 1 second interval", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 14, 30, 45));
    render(<MatrixClock />);

    act(() => {
      vi.setSystemTime(new Date(2026, 0, 15, 14, 30, 46));
      vi.advanceTimersByTime(1000);
    });

    // After advancing, the ClockSeparator blink also fires (500ms).
    // We just verify no crash and the component re-rendered.
    const colons = screen.getAllByText(":");
    expect(colons.length).toBe(2);
  });

  it("ClockDigit fires glitch and flip timers after value change", () => {
    vi.setSystemTime(new Date(2026, 0, 15, 14, 30, 45));
    render(<MatrixClock />);

    // Advance 1s to trigger the interval -> value changes in ClockDigit
    act(() => {
      vi.setSystemTime(new Date(2026, 0, 15, 14, 30, 46));
      vi.advanceTimersByTime(1000);
    });

    // Now advance 50ms more to fire the glitchTimer setTimeout callback
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Advance 100ms more to fire the flipTimer setTimeout callback (150ms total)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // After both timers fire, the digits should show the current value (no glitch)
    const colons = screen.getAllByText(":");
    expect(colons.length).toBe(2);
  });

  it("ClockSeparator blinks on interval", () => {
    render(<MatrixClock />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // The separator should still be in the DOM (just with different opacity)
    const colons = screen.getAllByText(":");
    expect(colons.length).toBe(2);
  });
});

// ============================================
// TaskSchedule
// ============================================

describe("TaskSchedule", () => {
  const defaultProps = {
    tasks: [] as TaskWithSchedule[],
    loading: false,
    onTrigger: vi.fn(),
    triggerLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state when loading with no tasks", () => {
    render(<TaskSchedule {...defaultProps} loading={true} />);
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("renders tasks with id and description", () => {
    const tasks = [makeTask({ id: "my-task", description: "Run tests" })];
    render(<TaskSchedule {...defaultProps} tasks={tasks} />);
    expect(screen.getByText("my-task")).toBeInTheDocument();
    expect(screen.getByText("Run tests")).toBeInTheDocument();
  });

  it("displays manual badge when no schedules", () => {
    const tasks = [makeTask({ schedules: [] })];
    render(<TaskSchedule {...defaultProps} tasks={tasks} />);
    expect(screen.getByText("manual")).toBeInTheDocument();
  });

  it("displays auto badge when schedules exist", () => {
    const tasks = [
      makeTask({
        schedules: [{ task: "test-task", hour: 10, minute: 30, weekday: "*" }],
      }),
    ];
    render(<TaskSchedule {...defaultProps} tasks={tasks} />);
    expect(screen.getByText("auto")).toBeInTheDocument();
  });

  it("shows executor badge for shell", () => {
    const tasks = [makeTask({ executor: "shell" })];
    render(<TaskSchedule {...defaultProps} tasks={tasks} />);
    expect(screen.getByText("shell")).toBeInTheDocument();
  });

  it("shows executor badge for opencode", () => {
    const tasks = [makeTask({ executor: "opencode", prompt: "Analyze code" })];
    render(<TaskSchedule {...defaultProps} tasks={tasks} />);
    expect(screen.getByText("opencode")).toBeInTheDocument();
  });

  it("shows executor badge for http with url display", () => {
    const tasks = [
      makeTask({
        executor: "http",
        url: "https://api.example.com/hook",
        method: "POST",
        command: undefined,
      }),
    ];
    render(<TaskSchedule {...defaultProps} tasks={tasks} />);
    expect(screen.getByText("http")).toBeInTheDocument();
    expect(screen.getByText("POST https://api.example.com/hook")).toBeInTheDocument();
  });

  it("shows schedule badges with formatted time", () => {
    const tasks = [
      makeTask({
        schedules: [{ task: "test-task", hour: 8, minute: 0, weekday: "*" }],
      }),
    ];
    render(<TaskSchedule {...defaultProps} tasks={tasks} />);
    expect(screen.getByText("08:00")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
  });

  it("calls onTrigger when Run button is clicked", () => {
    const onTrigger = vi.fn();
    const tasks = [makeTask({ id: "task-a" })];
    render(
      <TaskSchedule {...defaultProps} tasks={tasks} onTrigger={onTrigger} />,
    );

    fireEvent.click(screen.getByText("Run"));
    expect(onTrigger).toHaveBeenCalledWith("task-a");
  });

  it("disables Run button when triggerLoading is true", () => {
    const tasks = [makeTask()];
    render(<TaskSchedule {...defaultProps} tasks={tasks} triggerLoading={true} />);

    const runButton = screen.getByText("Run").closest("button")!;
    expect(runButton).toBeDisabled();
  });

  it("calls onSelectTask when task row is clicked", () => {
    const onSelectTask = vi.fn();
    const task = makeTask({ id: "clickable" });
    render(
      <TaskSchedule
        {...defaultProps}
        tasks={[task]}
        onSelectTask={onSelectTask}
      />,
    );

    // Click on the task description area (not the Run button)
    fireEvent.click(screen.getByText("clickable"));
    expect(onSelectTask).toHaveBeenCalledWith(task);
  });

  it("shows Add button when onAddTask is provided", () => {
    const onAddTask = vi.fn();
    render(<TaskSchedule {...defaultProps} onAddTask={onAddTask} />);

    fireEvent.click(screen.getByText("Add"));
    expect(onAddTask).toHaveBeenCalledOnce();
  });

  it("does not show Add button when onAddTask is not provided", () => {
    render(<TaskSchedule {...defaultProps} />);
    expect(screen.queryByText("Add")).not.toBeInTheDocument();
  });

  it("Run button click does not trigger onSelectTask", () => {
    const onSelectTask = vi.fn();
    const onTrigger = vi.fn();
    const task = makeTask();
    render(
      <TaskSchedule
        {...defaultProps}
        tasks={[task]}
        onTrigger={onTrigger}
        onSelectTask={onSelectTask}
      />,
    );

    fireEvent.click(screen.getByText("Run"));
    expect(onTrigger).toHaveBeenCalledOnce();
    expect(onSelectTask).not.toHaveBeenCalled();
  });

  it("renders subtitle with task count", () => {
    const tasks = [makeTask({ id: "a" }), makeTask({ id: "b" })];
    render(<TaskSchedule {...defaultProps} tasks={tasks} />);
    expect(screen.getByText(/2 tasks/)).toBeInTheDocument();
  });
});

// ============================================
// RunHistory
// ============================================

describe("RunHistory", () => {
  const defaultProps = {
    runs: [] as RunSummary[],
    loading: false,
    page: 1,
    totalPages: 1,
    onPageChange: vi.fn(),
    onSelectRun: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    render(<RunHistory {...defaultProps} loading={true} />);
    expect(screen.getByText("Loading runs...")).toBeInTheDocument();
  });

  it("renders empty state when not loading", () => {
    render(<RunHistory {...defaultProps} />);
    expect(screen.getByText("No runs recorded yet")).toBeInTheDocument();
  });

  it("renders run rows", () => {
    const runs = [
      makeRun({ id: "r1", task: "deploy" }),
      makeRun({ id: "r2", task: "backup" }),
    ];
    render(<RunHistory {...defaultProps} runs={runs} />);
    expect(screen.getByText("deploy")).toBeInTheDocument();
    expect(screen.getByText("backup")).toBeInTheDocument();
  });

  it("displays OK status for exit_code 0", () => {
    const runs = [makeRun({ exit_code: 0 })];
    render(<RunHistory {...defaultProps} runs={runs} />);
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("displays FAILED status with exit code", () => {
    const runs = [makeRun({ exit_code: 1 })];
    render(<RunHistory {...defaultProps} runs={runs} />);
    expect(screen.getByText("FAILED")).toBeInTheDocument();
    expect(screen.getByText("(1)")).toBeInTheDocument();
  });

  it("displays RUNNING status for null exit_code", () => {
    const runs = [makeRun({ exit_code: null, finished_at: null })];
    render(<RunHistory {...defaultProps} runs={runs} />);
    expect(screen.getByText("RUNNING")).toBeInTheDocument();
  });

  it("displays INTERRUPTED status for exit_code -1", () => {
    const runs = [makeRun({ exit_code: -1 })];
    render(<RunHistory {...defaultProps} runs={runs} />);
    expect(screen.getByText("INTERRUPTED")).toBeInTheDocument();
  });

  it("calls onSelectRun when row is clicked", () => {
    const onSelectRun = vi.fn();
    const runs = [makeRun({ id: "r1", task: "deploy" })];
    render(
      <RunHistory {...defaultProps} runs={runs} onSelectRun={onSelectRun} />,
    );

    fireEvent.click(screen.getByText("deploy"));
    expect(onSelectRun).toHaveBeenCalledWith("r1");
  });

  it("toggles sort direction when clicking same column", () => {
    const runs = [
      makeRun({ id: "r1", task: "alpha" }),
      makeRun({ id: "r2", task: "beta" }),
    ];
    render(<RunHistory {...defaultProps} runs={runs} />);

    // Click "Task" column header to sort by task (desc first)
    const taskButton = screen.getByTitle("Sort by task name");
    fireEvent.click(taskButton);

    // Click again to toggle to asc
    fireEvent.click(taskButton);

    // Verify both runs still render (sorting doesn't remove anything)
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("beta")).toBeInTheDocument();
  });

  it("changes sort key when clicking different column", () => {
    const runs = [makeRun({ id: "r1", task: "test" })];
    render(<RunHistory {...defaultProps} runs={runs} />);

    // Click "Status" column
    const statusButton = screen.getByTitle("Sort by status");
    fireEvent.click(statusButton);

    // Click "Duration" column
    const durationButton = screen.getByTitle("Sort by duration");
    fireEvent.click(durationButton);

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("sorts by status using getStatusPriority with multiple statuses", () => {
    const runs = [
      makeRun({ id: "r1", task: "success-task", exit_code: 0, finished_at: "2026-01-15T10:01:00Z" }),
      makeRun({ id: "r2", task: "running-task", exit_code: null, finished_at: null }),
      makeRun({ id: "r3", task: "failed-task", exit_code: 1, finished_at: "2026-01-15T10:02:00Z" }),
      makeRun({ id: "r4", task: "interrupted-task", exit_code: -1, finished_at: "2026-01-15T10:03:00Z" }),
    ];
    render(<RunHistory {...defaultProps} runs={runs} />);

    // Click "Status" column to sort by status
    const statusButton = screen.getByTitle("Sort by status");
    fireEvent.click(statusButton);

    // All four tasks should be rendered (sorting applied via getStatusPriority)
    expect(screen.getByText("success-task")).toBeInTheDocument();
    expect(screen.getByText("running-task")).toBeInTheDocument();
    expect(screen.getByText("failed-task")).toBeInTheDocument();
    expect(screen.getByText("interrupted-task")).toBeInTheDocument();
  });

  it("shows pagination when totalPages > 1", () => {
    const runs = [makeRun()];
    render(
      <RunHistory {...defaultProps} runs={runs} page={2} totalPages={5} />,
    );
    expect(screen.getByText("Page 2 / 5")).toBeInTheDocument();
  });

  it("does not show pagination when totalPages is 1", () => {
    const runs = [makeRun()];
    render(
      <RunHistory {...defaultProps} runs={runs} page={1} totalPages={1} />,
    );
    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
  });

  it("calls onPageChange for Prev button", () => {
    const onPageChange = vi.fn();
    const runs = [makeRun()];
    render(
      <RunHistory
        {...defaultProps}
        runs={runs}
        page={2}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText(/Prev/));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange for Next button", () => {
    const onPageChange = vi.fn();
    const runs = [makeRun()];
    render(
      <RunHistory
        {...defaultProps}
        runs={runs}
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText(/Next/));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables Prev button on first page", () => {
    const runs = [makeRun()];
    render(
      <RunHistory {...defaultProps} runs={runs} page={1} totalPages={3} />,
    );

    const prevBtn = screen.getByText(/Prev/).closest("button")!;
    expect(prevBtn).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    const runs = [makeRun()];
    render(
      <RunHistory {...defaultProps} runs={runs} page={3} totalPages={3} />,
    );

    const nextBtn = screen.getByText(/Next/).closest("button")!;
    expect(nextBtn).toBeDisabled();
  });

  it("displays duration for completed runs", () => {
    const runs = [
      makeRun({
        started_at: "2026-01-15T10:00:00Z",
        finished_at: "2026-01-15T10:01:00Z",
        exit_code: 0,
      }),
    ];
    render(<RunHistory {...defaultProps} runs={runs} />);
    // 60000ms = 1m 0s
    expect(screen.getByText("1m")).toBeInTheDocument();
  });

  it("displays ... for running tasks duration", () => {
    const runs = [makeRun({ exit_code: null, finished_at: null })];
    render(<RunHistory {...defaultProps} runs={runs} />);
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("renders arrow indicator in each row", () => {
    const runs = [makeRun()];
    render(<RunHistory {...defaultProps} runs={runs} />);
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("renders all column headers", () => {
    render(<RunHistory {...defaultProps} />);
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Task")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
  });

  it("sorts runs by time column correctly", () => {
    const runs = [
      makeRun({ id: "r1", task: "early", started_at: "2026-01-15T08:00:00Z", finished_at: "2026-01-15T08:01:00Z" }),
      makeRun({ id: "r2", task: "late", started_at: "2026-01-15T12:00:00Z", finished_at: "2026-01-15T12:01:00Z" }),
    ];
    render(<RunHistory {...defaultProps} runs={runs} />);

    // Default sort is "finished_at" desc, so "late" should be first
    const rows = screen.getAllByRole("row");
    // rows[0] is the header row
    expect(within(rows[1]).getByText("late")).toBeInTheDocument();
    expect(within(rows[2]).getByText("early")).toBeInTheDocument();

    // Click Time to toggle to asc
    fireEvent.click(screen.getByTitle("Sort by time"));
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("early")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("late")).toBeInTheDocument();
  });
});

// ============================================
// RunHeatmap
// ============================================

describe("RunHeatmap", () => {
  it("renders with data", () => {
    const data: HeatmapCell[] = [
      { date: "2026-01-15T10:00:00", count: 5, success: 4, failed: 1 },
    ];
    render(<RunHeatmap data={data} />);
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText(/last 30 days/)).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<RunHeatmap data={[]} />);
    expect(screen.getByText("Activity")).toBeInTheDocument();
  });

  it("displays legend with Less and More labels", () => {
    render(<RunHeatmap data={[]} />);
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("renders Chinese hour labels", () => {
    render(<RunHeatmap data={[]} />);
    // Check for one of the Chinese hour characters (卯 = slot 4)
    const labels = screen.getAllByText("卯");
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it("renders cells with title attributes for data cells", () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const data: HeatmapCell[] = [
      { date: `${dateStr}T10:00:00`, count: 3, success: 2, failed: 1 },
    ];
    const { container } = render(<RunHeatmap data={data} />);
    // Look for cells with title attributes containing "runs"
    const titledCells = container.querySelectorAll("[title*='runs']");
    expect(titledCells.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================
// RunnerTrendChart
// ============================================

describe("RunnerTrendChart", () => {
  it("renders empty state message when no data", () => {
    render(<RunnerTrendChart data={[]} />);
    expect(screen.getByText("No trend data available")).toBeInTheDocument();
    expect(screen.getByText(/no data/)).toBeInTheDocument();
  });

  it("renders with data showing stats", () => {
    const data: TrendPoint[] = [
      { date: "2026-01-15T08:00:00Z", total: 10, success: 8, successRate: 0.8 },
      { date: "2026-01-15T10:00:00Z", total: 20, success: 18, successRate: 0.9 },
    ];
    render(<RunnerTrendChart data={data} />);
    expect(screen.getByText("TOTAL: 30")).toBeInTheDocument();
    expect(screen.getByText("MAX: 20")).toBeInTheDocument();
    expect(screen.getByText("AVG: 15.0")).toBeInTheDocument();
  });

  it("renders SVG paths when data is provided", () => {
    const data: TrendPoint[] = [
      { date: "2026-01-15T08:00:00Z", total: 10, success: 8, successRate: 0.8 },
      { date: "2026-01-15T10:00:00Z", total: 20, success: 18, successRate: 0.9 },
      { date: "2026-01-15T12:00:00Z", total: 15, success: 12, successRate: 0.8 },
    ];
    const { container } = render(<RunnerTrendChart data={data} />);
    const paths = container.querySelectorAll("path");
    // Should have fill path + line path = 2 paths
    expect(paths.length).toBe(2);
  });

  it("renders subtitle 24h when data exists", () => {
    const data: TrendPoint[] = [
      { date: "2026-01-15T08:00:00Z", total: 5, success: 5, successRate: 1 },
    ];
    render(<RunnerTrendChart data={data} />);
    expect(screen.getByText(/24h/)).toBeInTheDocument();
  });

  it("shows tooltip on mouse move and hides on mouse leave", () => {
    const data: TrendPoint[] = [
      { date: "2026-01-15T08:00:00Z", total: 10, success: 8, successRate: 0.8 },
      { date: "2026-01-15T10:00:00Z", total: 20, success: 18, successRate: 0.9 },
    ];
    const { container } = render(<RunnerTrendChart data={data} />);

    // The hover overlay div is the last absolute positioned child in the chart area
    const hoverOverlay = container.querySelector(".absolute.inset-0.z-20") as HTMLElement;
    expect(hoverOverlay).toBeTruthy();

    // Simulate mouse move - we need to mock getBoundingClientRect
    vi.spyOn(hoverOverlay, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 500,
      bottom: 200,
      width: 500,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseMove(hoverOverlay, { clientX: 250, clientY: 100 });

    // After hover, a tooltip with "runs" should appear
    expect(screen.getByText(/runs/)).toBeInTheDocument();

    // Mouse leave should hide tooltip
    fireEvent.mouseLeave(hoverOverlay);
    expect(screen.queryByText(/\d+ runs/)).not.toBeInTheDocument();
  });

  it("renders with a single data point", () => {
    const data: TrendPoint[] = [
      { date: "2026-01-15T08:00:00Z", total: 5, success: 5, successRate: 1 },
    ];
    const { container } = render(<RunnerTrendChart data={data} />);
    // Single point: line path has M only (no C), no fill path
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });
});

// ============================================
// UpcomingTasks
// ============================================

describe("UpcomingTasks", () => {
  it("renders empty state", () => {
    render(<UpcomingTasks items={[]} />);
    expect(screen.getByText("No scheduled tasks")).toBeInTheDocument();
    expect(screen.getByText(/no data/)).toBeInTheDocument();
  });

  it("renders items with task info", () => {
    const now = new Date();
    const nextRun = new Date(now.getTime() + 60 * 60 * 1000); // 1h from now
    const items: UpcomingTask[] = [
      {
        task: {
          id: "build-check",
          executor: "shell",
          description: "Run build check",
          timeout: 300,
          command: "make build",
        },
        schedule: { task: "build-check", hour: 10, minute: 0, weekday: "*" },
        nextRun,
        countdown: 60 * 60 * 1000,
      },
    ];
    render(<UpcomingTasks items={items} />);
    expect(screen.getByText("build-check")).toBeInTheDocument();
    expect(screen.getByText("Run build check")).toBeInTheDocument();
  });

  it("shows 'Next' badge on first item", () => {
    const now = new Date();
    const items: UpcomingTask[] = [
      {
        task: { id: "t1", executor: "shell", description: "desc1", timeout: 60 },
        schedule: { task: "t1", hour: 10, minute: 0, weekday: "*" },
        nextRun: new Date(now.getTime() + 30 * 60 * 1000),
        countdown: 30 * 60 * 1000,
      },
      {
        task: { id: "t2", executor: "shell", description: "desc2", timeout: 60 },
        schedule: { task: "t2", hour: 11, minute: 0, weekday: "*" },
        nextRun: new Date(now.getTime() + 90 * 60 * 1000),
        countdown: 90 * 60 * 1000,
      },
    ];
    render(<UpcomingTasks items={items} />);
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("formats countdown correctly for hours", () => {
    const now = new Date();
    const items: UpcomingTask[] = [
      {
        task: { id: "t1", executor: "shell", description: "d", timeout: 60 },
        schedule: { task: "t1", hour: 10, minute: 0, weekday: "*" },
        nextRun: new Date(now.getTime() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
        countdown: 2 * 60 * 60 * 1000 + 30 * 60 * 1000, // 2h 30m
      },
    ];
    render(<UpcomingTasks items={items} />);
    expect(screen.getByText("2h 30m")).toBeInTheDocument();
  });

  it("formats countdown correctly for minutes", () => {
    const now = new Date();
    const items: UpcomingTask[] = [
      {
        task: { id: "t1", executor: "shell", description: "d", timeout: 60 },
        schedule: { task: "t1", hour: 10, minute: 0, weekday: "*" },
        nextRun: new Date(now.getTime() + 5 * 60 * 1000 + 30 * 1000),
        countdown: 5 * 60 * 1000 + 30 * 1000, // 5m 30s
      },
    ];
    render(<UpcomingTasks items={items} />);
    expect(screen.getByText("5m 30s")).toBeInTheDocument();
  });

  it("formats countdown correctly for seconds only", () => {
    const now = new Date();
    const items: UpcomingTask[] = [
      {
        task: { id: "t1", executor: "shell", description: "d", timeout: 60 },
        schedule: { task: "t1", hour: 10, minute: 0, weekday: "*" },
        nextRun: new Date(now.getTime() + 45 * 1000),
        countdown: 45 * 1000, // 45s
      },
    ];
    render(<UpcomingTasks items={items} />);
    expect(screen.getByText("45s")).toBeInTheDocument();
  });

  it("formats countdown as 'now' for 0 ms", () => {
    const now = new Date();
    const items: UpcomingTask[] = [
      {
        task: { id: "t1", executor: "shell", description: "d", timeout: 60 },
        schedule: { task: "t1", hour: 10, minute: 0, weekday: "*" },
        nextRun: now,
        countdown: 0,
      },
    ];
    render(<UpcomingTasks items={items} />);
    expect(screen.getByText("now")).toBeInTheDocument();
  });

  it("respects count prop", () => {
    const now = new Date();
    const items: UpcomingTask[] = Array.from({ length: 5 }, (_, i) => ({
      task: { id: `t${i}`, executor: "shell" as const, description: `d${i}`, timeout: 60 },
      schedule: { task: `t${i}`, hour: 10 + i, minute: 0, weekday: "*" as const },
      nextRun: new Date(now.getTime() + (i + 1) * 60 * 60 * 1000),
      countdown: (i + 1) * 60 * 60 * 1000,
    }));
    render(<UpcomingTasks items={items} count={2} />);
    expect(screen.getByText("t0")).toBeInTheDocument();
    expect(screen.getByText("t1")).toBeInTheDocument();
    expect(screen.queryByText("t2")).not.toBeInTheDocument();
  });

  it("shows 'Today' label for tasks scheduled today", () => {
    const now = new Date();
    const nextRun = new Date(now.getTime() + 60 * 60 * 1000); // 1h from now, same day
    const items: UpcomingTask[] = [
      {
        task: { id: "t1", executor: "shell", description: "d", timeout: 60 },
        schedule: { task: "t1", hour: nextRun.getHours(), minute: 0, weekday: "*" },
        nextRun,
        countdown: 60 * 60 * 1000,
      },
    ];
    render(<UpcomingTasks items={items} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });
});

// ============================================
// AddTaskModal
// ============================================

describe("AddTaskModal", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open", () => {
    render(<AddTaskModal {...defaultProps} />);
    expect(screen.getByText("Add Task")).toBeInTheDocument();
    expect(screen.getByText("Create Task")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<AddTaskModal open={false} onClose={vi.fn()} />);
    expect(screen.queryByText("Add Task")).not.toBeInTheDocument();
  });

  it("shows shell command field by default", () => {
    render(<AddTaskModal {...defaultProps} />);
    expect(screen.getByText("Command")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("echo 'Hello World'")).toBeInTheDocument();
  });

  it("switches to opencode showing prompt field", () => {
    render(<AddTaskModal {...defaultProps} />);

    fireEvent.click(screen.getByText("opencode"));
    expect(screen.getByText("Prompt")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Analyze the codebase and...")).toBeInTheDocument();
    expect(screen.queryByText("Command")).not.toBeInTheDocument();
  });

  it("switches to http showing url/method/headers/body fields", () => {
    render(<AddTaskModal {...defaultProps} />);

    fireEvent.click(screen.getByText("http"));
    expect(screen.getByText("Method")).toBeInTheDocument();
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("Headers (JSON)")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("shows working directory for shell and opencode but not http", () => {
    render(<AddTaskModal {...defaultProps} />);

    // Shell: workdir visible
    expect(screen.getByPlaceholderText("/path/to/directory")).toBeInTheDocument();

    // Switch to http: workdir hidden
    fireEvent.click(screen.getByText("http"));
    expect(screen.queryByPlaceholderText("/path/to/directory")).not.toBeInTheDocument();

    // Switch to opencode: workdir visible again
    fireEvent.click(screen.getByText("opencode"));
    expect(screen.getByPlaceholderText("/path/to/directory")).toBeInTheDocument();
  });

  it("validates empty fields on submit", () => {
    render(<AddTaskModal {...defaultProps} />);

    // Submit without filling anything
    fireEvent.click(screen.getByText("Create Task"));

    expect(screen.getByText("Task ID is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByText("Command is required")).toBeInTheDocument();
  });

  it("validates prompt required for opencode executor", () => {
    render(<AddTaskModal {...defaultProps} />);

    // Switch to opencode
    fireEvent.click(screen.getByText("opencode"));

    // Fill id and description but not prompt
    fireEvent.change(screen.getByPlaceholderText("my_task_name"), {
      target: { value: "my-task" },
    });
    fireEvent.change(screen.getByPlaceholderText("What does this task do?"), {
      target: { value: "Test description" },
    });

    fireEvent.click(screen.getByText("Create Task"));
    expect(screen.getByText("Prompt is required")).toBeInTheDocument();
  });

  it("validates url required for http executor", () => {
    render(<AddTaskModal {...defaultProps} />);

    // Switch to http
    fireEvent.click(screen.getByText("http"));

    // Fill id and description but not url
    fireEvent.change(screen.getByPlaceholderText("my_task_name"), {
      target: { value: "my-task" },
    });
    fireEvent.change(screen.getByPlaceholderText("What does this task do?"), {
      target: { value: "Test description" },
    });

    fireEvent.click(screen.getByText("Create Task"));
    expect(screen.getByText("URL is required")).toBeInTheDocument();
  });

  it("calls onClose on valid submit for shell", () => {
    const onClose = vi.fn();
    render(<AddTaskModal open={true} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("my_task_name"), {
      target: { value: "my-task" },
    });
    fireEvent.change(screen.getByPlaceholderText("What does this task do?"), {
      target: { value: "Test description" },
    });
    fireEvent.change(screen.getByPlaceholderText("echo 'Hello World'"), {
      target: { value: "echo test" },
    });

    fireEvent.click(screen.getByText("Create Task"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose on valid submit for http", () => {
    const onClose = vi.fn();
    render(<AddTaskModal open={true} onClose={onClose} />);

    fireEvent.click(screen.getByText("http"));

    fireEvent.change(screen.getByPlaceholderText("my_task_name"), {
      target: { value: "webhook-task" },
    });
    fireEvent.change(screen.getByPlaceholderText("What does this task do?"), {
      target: { value: "Call webhook" },
    });
    fireEvent.change(screen.getByPlaceholderText("https://api.example.com/webhook"), {
      target: { value: "https://hooks.example.com/trigger" },
    });

    fireEvent.click(screen.getByText("Create Task"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    render(<AddTaskModal open={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on backdrop click", () => {
    const onClose = vi.fn();
    const { container } = render(<AddTaskModal open={true} onClose={onClose} />);

    // The backdrop is the outermost fixed div
    const backdrop = container.querySelector(".fixed.inset-0") as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close when clicking inside modal content", () => {
    const onClose = vi.fn();
    render(<AddTaskModal open={true} onClose={onClose} />);

    // Click on the form content area
    fireEvent.click(screen.getByText("Add Task"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", () => {
    const onClose = vi.fn();
    render(<AddTaskModal open={true} onClose={onClose} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("clears errors when field is updated", () => {
    render(<AddTaskModal {...defaultProps} />);

    // Submit to trigger errors
    fireEvent.click(screen.getByText("Create Task"));
    expect(screen.getByText("Task ID is required")).toBeInTheDocument();

    // Type in the ID field to clear the error
    fireEvent.change(screen.getByPlaceholderText("my_task_name"), {
      target: { value: "a" },
    });
    expect(screen.queryByText("Task ID is required")).not.toBeInTheDocument();
  });

  it("resets form when modal is reopened", () => {
    const { rerender } = render(<AddTaskModal open={true} onClose={vi.fn()} />);

    // Fill in some data
    fireEvent.change(screen.getByPlaceholderText("my_task_name"), {
      target: { value: "dirty-data" },
    });

    // Close the modal
    rerender(<AddTaskModal open={false} onClose={vi.fn()} />);

    // Re-open
    rerender(<AddTaskModal open={true} onClose={vi.fn()} />);

    // The field should be reset
    const input = screen.getByPlaceholderText("my_task_name") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("allows changing timeout value", () => {
    render(<AddTaskModal {...defaultProps} />);

    const timeoutInput = screen.getByDisplayValue("300") as HTMLInputElement;
    fireEvent.change(timeoutInput, { target: { value: "600" } });
    expect(timeoutInput.value).toBe("600");
  });

  it("allows changing prompt field for opencode executor", () => {
    render(<AddTaskModal {...defaultProps} />);

    // Switch to opencode
    fireEvent.click(screen.getByText("opencode"));

    const promptTextarea = screen.getByPlaceholderText("Analyze the codebase and...") as HTMLTextAreaElement;
    fireEvent.change(promptTextarea, { target: { value: "Refactor the module" } });
    expect(promptTextarea.value).toBe("Refactor the module");
  });

  it("allows changing method, url, headers, and body for http executor", () => {
    render(<AddTaskModal {...defaultProps} />);

    // Switch to http
    fireEvent.click(screen.getByText("http"));

    // Change method
    const methodSelect = screen.getByDisplayValue("GET") as HTMLSelectElement;
    fireEvent.change(methodSelect, { target: { value: "POST" } });
    expect(methodSelect.value).toBe("POST");

    // Change URL
    const urlInput = screen.getByPlaceholderText("https://api.example.com/webhook") as HTMLInputElement;
    fireEvent.change(urlInput, { target: { value: "https://example.com/hook" } });
    expect(urlInput.value).toBe("https://example.com/hook");

    // Change headers
    const headersTextarea = screen.getByPlaceholderText('{"Content-Type": "application/json"}') as HTMLTextAreaElement;
    fireEvent.change(headersTextarea, { target: { value: '{"Authorization": "Bearer xyz"}' } });
    expect(headersTextarea.value).toBe('{"Authorization": "Bearer xyz"}');

    // Change body
    const bodyTextarea = screen.getByPlaceholderText('{"key": "value"}') as HTMLTextAreaElement;
    fireEvent.change(bodyTextarea, { target: { value: '{"data": 123}' } });
    expect(bodyTextarea.value).toBe('{"data": 123}');
  });

  it("allows changing workdir field for shell executor", () => {
    render(<AddTaskModal {...defaultProps} />);

    const workdirInput = screen.getByPlaceholderText("/path/to/directory") as HTMLInputElement;
    fireEvent.change(workdirInput, { target: { value: "/home/user/projects" } });
    expect(workdirInput.value).toBe("/home/user/projects");
  });
});

// ============================================
// TaskDetailModal
// ============================================

describe("TaskDetailModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders null when task is null", () => {
    const { container } = render(<TaskDetailModal task={null} onClose={onClose} />);
    expect(container.innerHTML).toBe("");
  });

  it("displays shell task details", () => {
    const task = makeTask({
      id: "build",
      executor: "shell",
      command: "make build",
      description: "Run build",
      timeout: 600,
    });
    const { container } = render(<TaskDetailModal task={task} onClose={onClose} />);

    expect(screen.getByText("build")).toBeInTheDocument();
    expect(screen.getByText(/Shell Task/)).toBeInTheDocument();
    expect(screen.getByText("Run build")).toBeInTheDocument();
    expect(screen.getByText("shell")).toBeInTheDocument();
    // Command is rendered as "$ make build" in a <pre>
    const commandPre = container.querySelector("pre.text-cyan-400");
    expect(commandPre?.textContent).toContain("make build");
    expect(screen.getByText(/Timeout:/)).toBeInTheDocument();
  });

  it("displays opencode task details", () => {
    const task = makeTask({
      id: "analyze",
      executor: "opencode",
      prompt: "Analyze the code",
      description: "Code analysis",
      command: undefined,
    });
    render(<TaskDetailModal task={task} onClose={onClose} />);

    expect(screen.getByText(/Opencode Task/)).toBeInTheDocument();
    expect(screen.getByText("Analyze the code")).toBeInTheDocument();
    expect(screen.getByText("opencode")).toBeInTheDocument();
  });

  it("displays http task details", () => {
    const task = makeTask({
      id: "webhook",
      executor: "http",
      url: "https://api.example.com",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"key":"value"}',
      description: "Webhook call",
      command: undefined,
    });
    render(<TaskDetailModal task={task} onClose={onClose} />);

    expect(screen.getByText(/HTTP Task/)).toBeInTheDocument();
    expect(screen.getByText("POST")).toBeInTheDocument();
    expect(screen.getByText("https://api.example.com")).toBeInTheDocument();
    expect(screen.getByText('{"key":"value"}')).toBeInTheDocument();
  });

  it("shows schedules when present", () => {
    const task = makeTask({
      schedules: [
        { task: "test-task", hour: 9, minute: 30, weekday: 1 },
        { task: "test-task", hour: 14, minute: 0, weekday: "*" },
      ],
    });
    render(<TaskDetailModal task={task} onClose={onClose} />);

    expect(screen.getByText("Schedules (2)")).toBeInTheDocument();
    expect(screen.getByText("09:30")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("14:00")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
  });

  it("displays JSON configuration", () => {
    const task = makeTask({ id: "my-task" });
    render(<TaskDetailModal task={task} onClose={onClose} />);
    expect(screen.getByText("JSON Configuration")).toBeInTheDocument();
    // The JSON should contain the task id
    expect(screen.getByText(/"my-task"/)).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const task = makeTask();
    render(<TaskDetailModal task={task} onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on backdrop click", () => {
    const task = makeTask();
    const { container } = render(<TaskDetailModal task={task} onClose={onClose} />);

    const backdrop = container.querySelector(".fixed.inset-0") as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on Close button click", () => {
    const task = makeTask();
    render(<TaskDetailModal task={task} onClose={onClose} />);

    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close when clicking modal content", () => {
    const task = makeTask();
    render(<TaskDetailModal task={task} onClose={onClose} />);

    fireEvent.click(screen.getByText("Description"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows working directory when set", () => {
    const task = makeTask({ workdir: "/home/user/project" });
    render(<TaskDetailModal task={task} onClose={onClose} />);
    expect(screen.getByText("/home/user/project")).toBeInTheDocument();
    expect(screen.getByText("Working Directory")).toBeInTheDocument();
  });

  it("shows manual badge when no schedules", () => {
    const task = makeTask({ schedules: [] });
    render(<TaskDetailModal task={task} onClose={onClose} />);
    expect(screen.getByText("manual")).toBeInTheDocument();
  });

  it("shows auto badge when schedules exist", () => {
    const task = makeTask({
      schedules: [{ task: "test-task", hour: 10, minute: 0, weekday: "*" }],
    });
    render(<TaskDetailModal task={task} onClose={onClose} />);
    expect(screen.getByText("auto")).toBeInTheDocument();
  });

  it("includes http headers in JSON config when present", () => {
    const task = makeTask({
      executor: "http",
      url: "https://api.example.com",
      method: "POST",
      headers: { Authorization: "Bearer token" },
      command: undefined,
    });
    render(<TaskDetailModal task={task} onClose={onClose} />);
    // "Authorization" appears in both the headers display and JSON config
    const matches = screen.getAllByText(/Authorization/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================
// RunDetailModal
// ============================================

describe("RunDetailModal", () => {
  const defaultProps = {
    run: null as RunDetail | null,
    loading: false,
    output: null as string | null,
    outputLoading: false,
    outputError: null as string | null,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders null when no run and not loading", () => {
    const { container } = render(<RunDetailModal {...defaultProps} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows loading state", () => {
    render(<RunDetailModal {...defaultProps} loading={true} />);
    expect(screen.getByText("Loading run details...")).toBeInTheDocument();
  });

  it("displays run details", () => {
    const run = makeRunDetail({
      task: "deploy-prod",
      id: "run-abc",
      trigger: "manual",
      exit_code: 0,
      duration_seconds: 120,
    });
    render(<RunDetailModal {...defaultProps} run={run} />);

    expect(screen.getByText("deploy-prod")).toBeInTheDocument();
    expect(screen.getByText("run-abc")).toBeInTheDocument();
    expect(screen.getByText("manual")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument(); // exit code
    expect(screen.getByText("2m")).toBeInTheDocument(); // duration
  });

  it("shows RUNNING status for null exit code", () => {
    const run = makeRunDetail({ exit_code: null });
    render(<RunDetailModal {...defaultProps} run={run} />);
    expect(screen.getByText("RUNNING")).toBeInTheDocument();
  });

  it("shows FAILED status for non-zero exit code", () => {
    const run = makeRunDetail({ exit_code: 2 });
    render(<RunDetailModal {...defaultProps} run={run} />);
    expect(screen.getByText("FAILED")).toBeInTheDocument();
  });

  it("shows INTERRUPTED status for exit code -1", () => {
    const run = makeRunDetail({ exit_code: -1 });
    render(<RunDetailModal {...defaultProps} run={run} />);
    expect(screen.getByText("INTERRUPTED")).toBeInTheDocument();
  });

  it("shows output loading state", () => {
    const run = makeRunDetail();
    render(
      <RunDetailModal {...defaultProps} run={run} outputLoading={true} />,
    );
    expect(screen.getByText("Loading output...")).toBeInTheDocument();
  });

  it("shows output error", () => {
    const run = makeRunDetail();
    render(
      <RunDetailModal
        {...defaultProps}
        run={run}
        outputError="Failed to fetch output"
      />,
    );
    expect(screen.getByText("Failed to fetch output")).toBeInTheDocument();
  });

  it("shows output content", () => {
    const run = makeRunDetail();
    render(
      <RunDetailModal
        {...defaultProps}
        run={run}
        output="Build successful\nAll tests passed"
      />,
    );
    expect(screen.getByText(/Build successful/)).toBeInTheDocument();
    expect(screen.getByText(/All tests passed/)).toBeInTheDocument();
  });

  it("shows no output message when output is null", () => {
    const run = makeRunDetail();
    render(<RunDetailModal {...defaultProps} run={run} />);
    expect(screen.getByText("No output available")).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    const run = makeRunDetail();
    render(<RunDetailModal {...defaultProps} run={run} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on backdrop click", () => {
    const onClose = vi.fn();
    const run = makeRunDetail();
    const { container } = render(
      <RunDetailModal {...defaultProps} run={run} onClose={onClose} />,
    );

    const backdrop = container.querySelector(".fixed.inset-0") as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on X button click", () => {
    const onClose = vi.fn();
    const run = makeRunDetail();
    render(<RunDetailModal {...defaultProps} run={run} onClose={onClose} />);

    fireEvent.click(screen.getByTitle("Close (Esc)"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close when clicking modal content", () => {
    const onClose = vi.fn();
    const run = makeRunDetail();
    render(<RunDetailModal {...defaultProps} run={run} onClose={onClose} />);

    fireEvent.click(screen.getByText("run-1"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows dash for finished_at when not set", () => {
    const run = makeRunDetail({ finished_at: undefined });
    render(<RunDetailModal {...defaultProps} run={run} />);
    // The "Finished" field should show "-"
    const finishedLabel = screen.getByText("Finished");
    const finishedContainer = finishedLabel.closest("div")!;
    expect(within(finishedContainer).getByText("-")).toBeInTheDocument();
  });

  it("shows dash for exit code when null", () => {
    const run = makeRunDetail({ exit_code: null });
    render(<RunDetailModal {...defaultProps} run={run} />);
    const exitCodeLabel = screen.getByText("Exit Code");
    const exitCodeContainer = exitCodeLabel.closest("div")!;
    expect(within(exitCodeContainer).getByText("-")).toBeInTheDocument();
  });

  it("shows Esc hint text", () => {
    const run = makeRunDetail();
    render(<RunDetailModal {...defaultProps} run={run} />);
    expect(screen.getByText("Esc")).toBeInTheDocument();
    expect(screen.getByText(/to close/)).toBeInTheDocument();
  });

  it("registers escape handler when loading with no run", () => {
    const onClose = vi.fn();
    render(<RunDetailModal {...defaultProps} loading={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
