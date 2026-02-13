// ============================================
// Runner-specific Components
// Ported from runner dashboard with Tailwind v4 adaptations
// ============================================

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import type {
  TaskWithSchedule,
  RunSummary,
  RunStatus,
  RunDetail,
  HeatmapCell,
  TrendPoint,
  UpcomingTask,
} from "@/models/types";
import { AsciiBox, MatrixButton, MatrixInput } from "@/components/ui";
import { formatScheduleTime, getWeekday, getDateKey } from "@/lib/date";
import { formatTimeUTC8, formatDurationMs, formatDuration, formatDate, formatExitCode } from "@/lib/format";

// ============================================
// MatrixClock - Animated digital clock
// ============================================

function randomMatrixChar(): string {
  const chars = "01アイウエオカキクケコサシスセソタチツテト";
  return chars[Math.floor(Math.random() * chars.length)];
}

function ClockDigit({ value, prevValue }: { value: string; prevValue: string }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [glitchChar, setGlitchChar] = useState<string | null>(null);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      setGlitchChar(randomMatrixChar());
      const glitchTimer = setTimeout(() => setGlitchChar(null), 50);
      const flipTimer = setTimeout(() => setIsFlipping(false), 150);
      return () => {
        clearTimeout(glitchTimer);
        clearTimeout(flipTimer);
      };
    }
  }, [value, prevValue]);

  return (
    <span
      className={`
        inline-block w-[0.65em] text-center
        transition-all duration-150
        ${isFlipping ? "scale-y-0 text-matrix-bright" : "scale-y-100"}
      `}
      style={{ transformOrigin: "center" }}
    >
      {glitchChar ?? value}
    </span>
  );
}

function ClockSeparator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`
        inline-block w-[0.6em] text-center mx-0.5
        transition-opacity duration-100
        ${visible ? "opacity-100" : "opacity-30"}
      `}
    >
      :
    </span>
  );
}

interface MatrixClockProps {
  label?: string;
}

export function MatrixClock({ label }: MatrixClockProps) {
  const [time, setTime] = useState(() => new Date());
  const [prevTime, setPrevTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevTime(time);
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  const format = (date: Date) => ({
    h1: String(date.getHours()).padStart(2, "0")[0],
    h2: String(date.getHours()).padStart(2, "0")[1],
    m1: String(date.getMinutes()).padStart(2, "0")[0],
    m2: String(date.getMinutes()).padStart(2, "0")[1],
    s1: String(date.getSeconds()).padStart(2, "0")[0],
    s2: String(date.getSeconds()).padStart(2, "0")[1],
  });

  const curr = format(time);
  const prev = format(prevTime);

  return (
    <div className="flex flex-col items-center gap-1">
      {label && (
        <span className="text-caption uppercase tracking-[0.3em] text-matrix-muted font-bold">
          {label}
        </span>
      )}
      <div className="font-mono text-3xl md:text-4xl font-black text-white tracking-[-0.06em] tabular-nums leading-none glow-text-white select-none">
        <span className="inline-flex items-center">
          <ClockDigit value={curr.h1} prevValue={prev.h1} />
          <ClockDigit value={curr.h2} prevValue={prev.h2} />
          <ClockSeparator />
          <ClockDigit value={curr.m1} prevValue={prev.m1} />
          <ClockDigit value={curr.m2} prevValue={prev.m2} />
          <ClockSeparator />
          <ClockDigit value={curr.s1} prevValue={prev.s1} />
          <ClockDigit value={curr.s2} prevValue={prev.s2} />
        </span>
      </div>
    </div>
  );
}

// ============================================
// TaskSchedule - Task list with executor badges
// ============================================

interface TaskScheduleProps {
  tasks: TaskWithSchedule[];
  loading: boolean;
  onTrigger: (taskId: string) => void;
  triggerLoading: boolean;
  onSelectTask?: (task: TaskWithSchedule) => void;
  onAddTask?: () => void;
}

export function TaskSchedule({
  tasks,
  loading,
  onTrigger,
  triggerLoading,
  onSelectTask,
  onAddTask,
}: TaskScheduleProps) {
  return (
    <AsciiBox title="Tasks" subtitle={`${tasks.length} tasks`}>
      <div className="space-y-4">
        {onAddTask && (
          <div className="flex justify-end">
            <MatrixButton size="small" primary onClick={onAddTask}>
              <Plus size={12} className="mr-1" /> Add
            </MatrixButton>
          </div>
        )}

        {loading && tasks.length === 0 && (
          <div className="py-8 text-center text-matrix-dim animate-pulse">
            Loading tasks...
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border border-matrix-ghost p-3 transition-colors ${
              onSelectTask
                ? "hover:border-matrix-dim cursor-pointer"
                : "hover:border-matrix-dim"
            }`}
            onClick={() => onSelectTask?.(task)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-matrix-primary">{task.id}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      task.schedules.length === 0
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {task.schedules.length === 0 ? "manual" : "auto"}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                      task.executor === "shell"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : task.executor === "opencode"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                    }`}
                  >
                    {task.executor}
                  </span>
                </div>
                <p className="text-caption text-matrix-dim mt-1">
                  {task.description}
                </p>
                {task.executor === "http" && task.url && (
                  <p className="text-caption text-matrix-ghost mt-1 font-mono truncate">
                    {task.method ?? "GET"} {task.url}
                  </p>
                )}
              </div>
              <MatrixButton
                size="small"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onTrigger(task.id);
                }}
                disabled={triggerLoading}
                loading={triggerLoading}
              >
                Run
              </MatrixButton>
            </div>

            {task.schedules.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {task.schedules.map((schedule, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-matrix-ghost/30 border border-matrix-ghost text-caption"
                  >
                    <span className="text-matrix-primary font-bold">
                      {formatScheduleTime(schedule.hour, schedule.minute)}
                    </span>
                    <span className="text-matrix-dim">
                      {getWeekday(schedule.weekday)}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </AsciiBox>
  );
}

// ============================================
// RunHistory - Sortable table with pagination
// ============================================

interface RunHistoryProps {
  runs: RunSummary[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectRun: (id: string) => void;
}

type SortKey = "finished_at" | "task" | "status" | "duration";
type SortDir = "asc" | "desc";

interface Column {
  key: SortKey;
  label: string;
  title: string;
}

const COLUMNS: Column[] = [
  { key: "finished_at", label: "Time", title: "Sort by time" },
  { key: "task", label: "Task", title: "Sort by task name" },
  { key: "status", label: "Status", title: "Sort by status" },
  { key: "duration", label: "Duration", title: "Sort by duration" },
];

function getSortIcon(key: SortKey, sortKey: SortKey, sortDir: SortDir): string {
  if (key !== sortKey) return "↕";
  return sortDir === "asc" ? "↑" : "↓";
}

function getAriaSortValue(key: SortKey, sortKey: SortKey, sortDir: SortDir): "ascending" | "descending" | "none" {
  if (key !== sortKey) return "none";
  return sortDir === "asc" ? "ascending" : "descending";
}

function getRunStatus(run: RunSummary): RunStatus {
  if (run.exit_code == null) return "running";
  if (run.exit_code === 0) return "success";
  if (run.exit_code === -1) return "interrupted";
  return "failed";
}

function getDurationMs(run: RunSummary): number | null {
  if (!run.started_at || !run.finished_at) return null;
  return new Date(run.finished_at).getTime() - new Date(run.started_at).getTime();
}

function getStatusConfig(status: RunStatus): { label: string; className: string; dot: string } {
  switch (status) {
    case "running":
      return { label: "RUNNING", className: "text-cyan-400", dot: "animate-pulse" };
    case "success":
      return { label: "OK", className: "text-success", dot: "" };
    case "failed":
      return { label: "FAILED", className: "text-error", dot: "" };
    case "interrupted":
      return { label: "INTERRUPTED", className: "text-amber-400", dot: "" };
  }
}

function getStatusPriority(status: RunStatus): number {
  switch (status) {
    case "running": return 0;
    case "interrupted": return 1;
    case "failed": return 2;
    case "success": return 3;
  }
}

export function RunHistory({
  runs,
  loading,
  page,
  totalPages,
  onPageChange,
  onSelectRun,
}: RunHistoryProps) {
  const [sortKey, setSortKey] = useState<SortKey>("finished_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedRuns = useMemo(() => {
    const sorted = [...runs];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "task":
          cmp = a.task.localeCompare(b.task);
          break;
        case "status":
          cmp = getStatusPriority(getRunStatus(a)) - getStatusPriority(getRunStatus(b));
          break;
        case "duration":
          cmp = (getDurationMs(a) ?? 0) - (getDurationMs(b) ?? 0);
          break;
        case "finished_at": {
          const timeA = a.finished_at || a.started_at;
          const timeB = b.finished_at || b.started_at;
          cmp = new Date(timeA).getTime() - new Date(timeB).getTime();
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [runs, sortKey, sortDir]);

  return (
    <AsciiBox title="Run History" subtitle={`${runs.length} runs`}>
      <div
        className="border border-[#00FF41]/10 outline-none"
        role="region"
        aria-label="Run history table"
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-black/90">
            <tr className="border-b border-[#00FF41]/10">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  aria-sort={getAriaSortValue(c.key, sortKey, sortDir)}
                  className="text-left p-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(c.key)}
                    title={c.title}
                    className="w-full px-3 py-2 text-left text-[9px] uppercase tracking-widest font-black opacity-70 hover:opacity-100 hover:bg-[#00FF41]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF41]/30 flex items-center justify-start"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span>{c.label}</span>
                      <span className="opacity-40">
                        {getSortIcon(c.key, sortKey, sortDir)}
                      </span>
                    </span>
                  </button>
                </th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {loading && runs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-matrix-dim animate-pulse">
                  Loading runs...
                </td>
              </tr>
            )}

            {!loading && runs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-matrix-dim">
                  No runs recorded yet
                </td>
              </tr>
            )}

            {sortedRuns.map((run) => {
              const status = getRunStatus(run);
              const statusConfig = getStatusConfig(status);
              const displayTime = run.finished_at || run.started_at;
              const durationMs = getDurationMs(run);

              return (
                <tr
                  key={run.id}
                  className="border-b border-[#00FF41]/5 hover:bg-[#00FF41]/5 cursor-pointer transition-colors"
                  onClick={() => onSelectRun(run.id)}
                >
                  <td className="px-3 py-2 text-[12px] font-mono opacity-80">
                    {displayTime ? formatTimeUTC8(displayTime) : "\u2014"}
                  </td>
                  <td className="px-3 py-2 text-[12px] font-mono font-bold">
                    {run.task}
                  </td>
                  <td className="px-3 py-2 text-[12px] font-mono">
                    <span
                      className={`inline-flex items-center gap-1.5 ${statusConfig.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${statusConfig.dot}`}></span>
                      {statusConfig.label}
                      {status === "failed" && run.exit_code !== null && (
                        <span className="opacity-60 text-[10px]">({run.exit_code})</span>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[12px] font-mono opacity-80">
                    {status === "running" ? (
                      <span className="text-cyan-400 animate-pulse">...</span>
                    ) : durationMs ? (
                      formatDurationMs(durationMs)
                    ) : (
                      "\u2014"
                    )}
                  </td>
                  <td className="px-3 py-2 text-[12px] font-mono opacity-40 text-right">
                    {"\u2192"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-[9px] uppercase tracking-widest font-black">
          <MatrixButton
            size="small"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {"\u2190"} Prev
          </MatrixButton>
          <span className="opacity-50">
            Page {page} / {totalPages}
          </span>
          <MatrixButton
            size="small"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next {"\u2192"}
          </MatrixButton>
        </div>
      )}
    </AsciiBox>
  );
}

// ============================================
// RunHeatmap - 30 days x 8 time slots grid
// ============================================

const OPACITY_BY_LEVEL = [0.08, 0.32, 0.5, 0.7, 1];
const CELL_SIZE = 14;
const CELL_GAP = 3;
const DAYS_TO_SHOW = 30;

const TIME_SLOTS = [4, 6, 8, 10, 12, 14, 16, 18];
const CHINESE_HOURS: Record<number, string> = {
  4: "\u536F", // 卯
  6: "\u8FB0", // 辰
  8: "\u5DF3", // 巳
  10: "\u5348", // 午
  12: "\u672A", // 未
  14: "\u7533", // 申
  16: "\u9149", // 酉
  18: "\u620C", // 戌
};

interface RunHeatmapProps {
  data: HeatmapCell[];
}

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function formatSlotRange(slot: number): string {
  const end = slot + 2;
  return `${slot.toString().padStart(2, "0")}:00-${end.toString().padStart(2, "0")}:00`;
}

function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return date.getDate().toString();
}

export function RunHeatmap({ data }: RunHeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = el.scrollWidth;
    }
  }, []);

  const { grid, dayLabels } = useMemo(() => {
    const now = new Date();

    const dates: string[] = [];
    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(getDateKey(date));
    }

    const dataMap = new Map<string, HeatmapCell>();
    for (const cell of data) {
      const datePart = cell.date.split("T")[0];
      const hourPart = cell.date.split("T")[1]?.substring(0, 2) || "00";
      const key = `${datePart}:${hourPart}`;
      dataMap.set(key, cell);
    }

    const rows: (HeatmapCell | null)[][] = [];

    for (const slot of TIME_SLOTS) {
      const row: (HeatmapCell | null)[] = [];
      const slotStr = slot.toString().padStart(2, "0");

      for (const dateStr of dates) {
        const key = `${dateStr}:${slotStr}`;
        const cell = dataMap.get(key);

        if (cell) {
          row.push(cell);
        } else {
          row.push({
            date: `${dateStr}T${slotStr}:00:00`,
            count: 0,
            success: 0,
            failed: 0,
          });
        }
      }
      rows.push(row);
    }

    const labels = dates.map(formatDayLabel);
    return { grid: rows, dayLabels: labels };
  }, [data]);

  const gridWidth = 20 + DAYS_TO_SHOW * CELL_SIZE + (DAYS_TO_SHOW - 1) * CELL_GAP + CELL_GAP + 20;

  return (
    <AsciiBox title="Activity" subtitle="last 30 days">
      <div className="flex flex-col gap-2">
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          <div style={{ minWidth: gridWidth }}>
            <div
              className="grid text-caption text-matrix-muted mb-2"
              style={{
                gridTemplateColumns: `20px repeat(${DAYS_TO_SHOW}, ${CELL_SIZE}px) 20px`,
                gap: `${CELL_GAP}px`,
              }}
            >
              <span></span>
              {dayLabels.map((label, idx) => (
                <span key={idx} className="text-center">
                  {label}
                </span>
              ))}
              <span></span>
            </div>

            <div className="flex flex-col" style={{ gap: `${CELL_GAP}px` }}>
              {grid.map((row, rowIdx) => {
                const slot = TIME_SLOTS[rowIdx];
                return (
                  <div
                    key={rowIdx}
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: `20px repeat(${DAYS_TO_SHOW}, ${CELL_SIZE}px) 20px`,
                      gap: `${CELL_GAP}px`,
                    }}
                  >
                    <span className="text-caption text-matrix-muted text-right pr-1">
                      {CHINESE_HOURS[slot]}
                    </span>

                    {row.map((cell, colIdx) => {
                      const key = cell?.date || `empty-${rowIdx}-${colIdx}`;

                      if (!cell) {
                        return (
                          <span
                            key={key}
                            className="rounded-[2px] border border-transparent"
                            style={{ width: CELL_SIZE, height: CELL_SIZE }}
                          />
                        );
                      }

                      const level = getLevel(cell.count);
                      const opacity = OPACITY_BY_LEVEL[level] ?? 0.08;
                      const color = `rgba(0,255,65,${opacity})`;

                      return (
                        <span
                          key={key}
                          title={`${dayLabels[colIdx]}${"\u65E5"} ${CHINESE_HOURS[slot]}${"\u65F6"} (${formatSlotRange(slot)}): ${cell.count} runs (${cell.success} OK, ${cell.failed} ERR)`}
                          className="rounded-[2px] border border-matrix-ghost cursor-default"
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            background: color,
                          }}
                        />
                      );
                    })}

                    <span className="text-caption text-matrix-muted text-left pl-1">
                      {CHINESE_HOURS[slot]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-caption border-t border-matrix-ghost pt-2 text-matrix-muted font-bold uppercase">
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className="rounded-[2px] border border-matrix-ghost"
                  style={{
                    width: 10,
                    height: 10,
                    background: `rgba(0,255,65,${OPACITY_BY_LEVEL[level]})`,
                  }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </AsciiBox>
  );
}

// ============================================
// RunnerTrendChart - Smooth Bezier curve chart
// (Named RunnerTrendChart to avoid collision with DataVizComponents.TrendChart)
// ============================================

const TREND_COLOR = "#00FF41";

const SHICHEN: Record<number, string> = {
  23: "\u5B50", 0: "\u5B50",   // 子
  1: "\u4E11", 2: "\u4E11",   // 丑
  3: "\u5BC5", 4: "\u5BC5",   // 寅
  5: "\u536F", 6: "\u536F",   // 卯
  7: "\u8FB0", 8: "\u8FB0",   // 辰
  9: "\u5DF3", 10: "\u5DF3",  // 巳
  11: "\u5348", 12: "\u5348", // 午
  13: "\u672A", 14: "\u672A", // 未
  15: "\u7533", 16: "\u7533", // 申
  17: "\u9149", 18: "\u9149", // 酉
  19: "\u620C", 20: "\u620C", // 戌
  21: "\u4EA5", 22: "\u4EA5", // 亥
};

function getShichen(hour: number): string {
  return SHICHEN[hour] || "";
}

function formatTrendTime(dateStr: string): string {
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (match) {
    return `${match[4]}:${match[5]}`;
  }
  return dateStr;
}

function getHourFromDate(dateStr: string): number {
  const match = dateStr.match(/T(\d{2}):/);
  return match ? parseInt(match[1], 10) : 0;
}

interface RunnerTrendChartProps {
  data: TrendPoint[];
}

export function RunnerTrendChart({ data }: RunnerTrendChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  const [hover, setHover] = useState<{
    index: number;
    value: number;
    successRate: number;
    label: string;
    x: number;
    y: number;
  } | null>(null);

  const width = 100;
  const height = 100;
  const plotTop = 8;
  const plotBottom = 8;
  const plotHeight = height - plotTop - plotBottom;
  const pointCount = Math.max(data.length, 1);
  const xPadding = pointCount > 1 ? width * 0.02 : width / 2;
  const plotSpan = Math.max(width - xPadding * 2, 0);
  const step = pointCount > 1 ? plotSpan / (pointCount - 1) : 0;

  const values = data.map((d) => d.total);
  const max = Math.max(...values, 1);
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const total = values.reduce((a, b) => a + b, 0);

  const points = useMemo(() => {
    return data.map((point, i) => {
      const x = pointCount > 1 ? xPadding + i * step : width / 2;
      const normalizedVal = max > 0 ? point.total / max : 0;
      const y = plotTop + (1 - normalizedVal) * plotHeight;
      return { x, y, index: i, value: point.total };
    });
  }, [data, max, plotHeight, plotTop, pointCount, step, xPadding, width]);

  function solveSmoothPath(pts: Array<{ x: number; y: number }>): string {
    if (!pts.length) return "";
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    if (pts.length === 2) return `M ${pts[0].x},${pts[0].y} L ${pts[1].x},${pts[1].y}`;

    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) * 0.16;
      const cp1y = p1.y + (p2.y - p0.y) * 0.16;
      const cp2x = p2.x - (p3.x - p1.x) * 0.16;
      const cp2y = p2.y - (p3.y - p1.y) * 0.16;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  const linePath = useMemo(() => solveSmoothPath(points), [points]);
  const fillPath = useMemo(() => {
    if (points.length < 2) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${linePath} L ${last.x},${height - plotBottom} L ${first.x},${height - plotBottom} Z`;
  }, [linePath, points, height, plotBottom]);

  const xLabels = useMemo(() => {
    if (data.length === 0) return [];
    const labels: string[] = [];
    const seenShichen = new Set<string>();

    for (let i = 0; i < data.length; i += 12) {
      const hour = getHourFromDate(data[i].date);
      const shichen = getShichen(hour);
      if (shichen && !seenShichen.has(shichen)) {
        labels.push(shichen);
        seenShichen.add(shichen);
      }
    }
    return labels;
  }, [data]);

  function handleMove(e: React.MouseEvent) {
    const el = plotRef.current;
    if (!el || data.length === 0) return;
    const rect = el.getBoundingClientRect();
    const rawX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const xPaddingPx = (xPadding / width) * rect.width;
    const plotSpanPx = rect.width - xPaddingPx * 2;
    const denom = Math.max(data.length - 1, 1);
    const clamped = Math.min(Math.max(rawX - xPaddingPx, 0), plotSpanPx);
    const ratio = plotSpanPx > 0 ? clamped / plotSpanPx : 0;
    const index = Math.round(ratio * denom);

    const point = data[index];
    if (!point) return;

    const snappedX = denom > 0 ? xPaddingPx + (index / denom) * plotSpanPx : rect.width / 2;
    const yRatio = max > 0 ? 1 - point.total / max : 1;
    const yPx = (plotTop / height) * rect.height + yRatio * (plotHeight / height) * rect.height;

    setHover({
      index,
      value: point.total,
      successRate: point.successRate,
      label: formatTrendTime(point.date),
      x: snappedX,
      y: yPx,
    });
  }

  if (data.length === 0) {
    return (
      <AsciiBox title="Trend" subtitle="no data">
        <div className="h-32 flex items-center justify-center text-matrix-dim">
          No trend data available
        </div>
      </AsciiBox>
    );
  }

  return (
    <AsciiBox title="Trend" subtitle="24h">
      <div className="flex items-center justify-between text-caption text-matrix-muted px-1 mb-3">
        <div className="flex gap-3">
          <span>TOTAL: {total}</span>
          <span>MAX: {Math.round(max)}</span>
          <span>AVG: {avg.toFixed(1)}</span>
        </div>
      </div>

      <div className="relative overflow-hidden border border-matrix-ghost bg-matrix-panel h-40">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${TREND_COLOR} 1px, transparent 1px),
              linear-gradient(to bottom, ${TREND_COLOR} 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background: `linear-gradient(to right, transparent, rgba(0,255,65,0.1), transparent)`,
            animation: "scan-x 3s linear infinite",
          }}
        />

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full absolute inset-0 z-10"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="runner-trend-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TREND_COLOR} stopOpacity="0.5" />
              <stop offset="100%" stopColor={TREND_COLOR} stopOpacity="0" />
            </linearGradient>
          </defs>

          {fillPath && <path d={fillPath} fill="url(#runner-trend-grad)" />}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={TREND_COLOR}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]"
            />
          )}
        </svg>

        <div
          ref={plotRef}
          className="absolute inset-0 z-20"
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        />

        {hover && (
          <>
            <div className="absolute inset-y-0 left-0 pointer-events-none z-25">
              <div
                className="absolute top-0 bottom-0 w-px bg-[#00FF41]/40 shadow-[0_0_6px_rgba(0,255,65,0.35)]"
                style={{ left: hover.x }}
              />
              <div
                className="absolute w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_6px_rgba(0,255,65,0.8)]"
                style={{ left: hover.x - 4, top: hover.y - 4 }}
              />
            </div>

            <div
              className="absolute z-30 px-3 py-2 text-caption bg-matrix-panel-strong border border-matrix-ghost text-matrix-bright pointer-events-none"
              style={{
                left: Math.min(hover.x + 10, plotRef.current?.clientWidth ? plotRef.current.clientWidth - 100 : hover.x),
                top: Math.max(hover.y - 24, 6),
              }}
            >
              <div className="text-matrix-muted">{hover.label}</div>
              <div className="font-bold">{hover.value} runs</div>
              <div className="text-matrix-dim">{Math.round(hover.successRate * 100)}% success</div>
            </div>
          </>
        )}
      </div>

      <div className="h-5 flex justify-between items-center px-1 text-caption text-matrix-muted border-t border-matrix-ghost pt-2 mt-2">
        {xLabels.map((label, idx) => (
          <span key={`${label}-${idx}`}>{label}</span>
        ))}
      </div>

      <style>{`
        @keyframes scan-x {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </AsciiBox>
  );
}

// ============================================
// UpcomingTasks - Next scheduled tasks with countdown
// ============================================

interface UpcomingTasksProps {
  items: UpcomingTask[];
  count?: number;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "now";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${seconds}s`;
}

function formatUpcomingTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatUpcomingDayLabel(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((targetDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[date.getDay()];
}

function getCountdownColor(ms: number): string {
  const minutes = ms / 1000 / 60;
  if (minutes <= 5) return "text-warning animate-pulse";
  if (minutes <= 15) return "text-matrix-bright";
  return "text-matrix-muted";
}

export function UpcomingTasks({ items, count = 8 }: UpcomingTasksProps) {
  const upcomingWithCountdown = items.slice(0, count);

  if (upcomingWithCountdown.length === 0) {
    return (
      <AsciiBox title="Upcoming" subtitle="no data">
        <div className="h-32 flex items-center justify-center text-matrix-dim">
          No scheduled tasks
        </div>
      </AsciiBox>
    );
  }

  return (
    <AsciiBox title="Upcoming" subtitle={`next ${upcomingWithCountdown.length}`}>
      <div className="space-y-1">
        {upcomingWithCountdown.map((item, index) => (
          <UpcomingTaskRow
            key={`${item.task.id}-${item.nextRun.getTime()}-${index}`}
            item={item}
            isFirst={index === 0}
          />
        ))}
      </div>
    </AsciiBox>
  );
}

interface UpcomingTaskRowProps {
  item: UpcomingTask;
  isFirst: boolean;
}

function UpcomingTaskRow({ item, isFirst }: UpcomingTaskRowProps) {
  const { task, nextRun, countdown } = item;

  return (
    <div
      className={`flex items-center gap-3 py-2 px-2 rounded ${
        isFirst
          ? "bg-matrix-panel-strong border border-matrix-ghost"
          : "hover:bg-matrix-panel/50"
      }`}
    >
      <div className="w-14 shrink-0 text-right">
        <div className="text-body font-mono text-matrix-bright">
          {formatUpcomingTime(nextRun)}
        </div>
        <div className="text-caption text-matrix-dim">
          {formatUpcomingDayLabel(nextRun)}
        </div>
      </div>

      <div className={`w-px h-8 ${isFirst ? "bg-success" : "bg-matrix-ghost"}`} />

      <div className="flex-1 min-w-0">
        <div className="text-body text-matrix-primary truncate font-mono">
          {task.id}
        </div>
        <div className="text-caption text-matrix-dim truncate">
          {task.description}
        </div>
      </div>

      <div className={`shrink-0 text-right font-mono ${getCountdownColor(countdown)}`}>
        <div className="text-body tabular-nums">
          {formatCountdown(countdown)}
        </div>
        {isFirst && (
          <div className="text-caption text-success uppercase tracking-wider">
            Next
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// AddTaskModal - Form dialog (adapted: no API, local form state)
// ============================================

interface AddTaskFormData {
  id: string;
  executor: "shell" | "opencode" | "http";
  description: string;
  timeout: number;
  command: string;
  prompt: string;
  workdir: string;
  url: string;
  method: string;
  headers: string;
  body: string;
}

const INITIAL_FORM_DATA: AddTaskFormData = {
  id: "",
  executor: "shell",
  description: "",
  timeout: 300,
  command: "",
  prompt: "",
  workdir: "",
  url: "",
  method: "GET",
  headers: "",
  body: "",
};

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddTaskModal({ open, onClose }: AddTaskModalProps) {
  const [formData, setFormData] = useState<AddTaskFormData>({ ...INITIAL_FORM_DATA });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof AddTaskFormData>(key: K, value: AddTaskFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setFormData({ ...INITIAL_FORM_DATA });
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Showcase mode: just validate and close
    const newErrors: Record<string, string> = {};
    if (!formData.id.trim()) newErrors.id = "Task ID is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.executor === "shell" && !formData.command.trim()) newErrors.command = "Command is required";
    if (formData.executor === "opencode" && !formData.prompt.trim()) newErrors.prompt = "Prompt is required";
    if (formData.executor === "http" && !formData.url.trim()) newErrors.url = "URL is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AsciiBox title="Add Task" subtitle="Create new task">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <MatrixInput
                label="Task ID"
                value={formData.id}
                onChange={(e) => updateField("id", e.target.value)}
                placeholder="my_task_name"
                autoFocus
              />
              {errors.id && (
                <p className="text-caption text-red-400 mt-1">{errors.id}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-caption text-matrix-muted uppercase font-bold">
                Executor
              </span>
              <div className="flex gap-2">
                {(["shell", "opencode", "http"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField("executor", type)}
                    className={`px-3 py-2 text-caption font-bold uppercase border transition-colors ${
                      formData.executor === type
                        ? "bg-matrix-primary/20 text-matrix-primary border-matrix-primary"
                        : "bg-matrix-panel text-matrix-dim border-matrix-ghost hover:border-matrix-dim"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <MatrixInput
                label="Description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="What does this task do?"
              />
              {errors.description && (
                <p className="text-caption text-red-400 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <MatrixInput
                label="Timeout (seconds)"
                type="number"
                value={formData.timeout}
                onChange={(e) =>
                  updateField("timeout", parseInt(e.target.value) || 300)
                }
                min={1}
                max={86400}
              />
            </div>

            {formData.executor === "shell" && (
              <div>
                <label className="flex flex-col gap-2">
                  <span className="text-caption text-matrix-muted uppercase font-bold">
                    Command
                  </span>
                  <textarea
                    className="h-24 bg-matrix-panel border border-matrix-ghost px-3 py-2 text-body text-matrix-bright font-mono outline-none focus:border-matrix-primary focus:ring-2 focus:ring-matrix-primary/20 resize-none"
                    value={formData.command}
                    onChange={(e) => updateField("command", e.target.value)}
                    placeholder="echo 'Hello World'"
                  />
                </label>
                {errors.command && (
                  <p className="text-caption text-red-400 mt-1">
                    {errors.command}
                  </p>
                )}
              </div>
            )}

            {formData.executor === "opencode" && (
              <div>
                <label className="flex flex-col gap-2">
                  <span className="text-caption text-matrix-muted uppercase font-bold">
                    Prompt
                  </span>
                  <textarea
                    className="h-24 bg-matrix-panel border border-matrix-ghost px-3 py-2 text-body text-matrix-bright font-mono outline-none focus:border-matrix-primary focus:ring-2 focus:ring-matrix-primary/20 resize-none"
                    value={formData.prompt}
                    onChange={(e) => updateField("prompt", e.target.value)}
                    placeholder="Analyze the codebase and..."
                  />
                </label>
                {errors.prompt && (
                  <p className="text-caption text-red-400 mt-1">
                    {errors.prompt}
                  </p>
                )}
              </div>
            )}

            {formData.executor === "http" && (
              <>
                <div className="flex gap-4">
                  <div className="w-28">
                    <label className="flex flex-col gap-2">
                      <span className="text-caption text-matrix-muted uppercase font-bold">
                        Method
                      </span>
                      <select
                        className="h-10 bg-matrix-panel border border-matrix-ghost px-3 text-body text-matrix-bright outline-none focus:border-matrix-primary"
                        value={formData.method}
                        onChange={(e) => updateField("method", e.target.value)}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </label>
                  </div>
                  <div className="flex-1">
                    <MatrixInput
                      label="URL"
                      value={formData.url}
                      onChange={(e) => updateField("url", e.target.value)}
                      placeholder="https://api.example.com/webhook"
                    />
                    {errors.url && (
                      <p className="text-caption text-red-400 mt-1">
                        {errors.url}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex flex-col gap-2">
                    <span className="text-caption text-matrix-muted uppercase font-bold">
                      Headers (JSON)
                    </span>
                    <textarea
                      className="h-20 bg-matrix-panel border border-matrix-ghost px-3 py-2 text-body text-matrix-bright font-mono outline-none focus:border-matrix-primary focus:ring-2 focus:ring-matrix-primary/20 resize-none"
                      value={formData.headers}
                      onChange={(e) => updateField("headers", e.target.value)}
                      placeholder='{"Content-Type": "application/json"}'
                    />
                  </label>
                </div>

                <div>
                  <label className="flex flex-col gap-2">
                    <span className="text-caption text-matrix-muted uppercase font-bold">
                      Body
                    </span>
                    <textarea
                      className="h-20 bg-matrix-panel border border-matrix-ghost px-3 py-2 text-body text-matrix-bright font-mono outline-none focus:border-matrix-primary focus:ring-2 focus:ring-matrix-primary/20 resize-none"
                      value={formData.body}
                      onChange={(e) => updateField("body", e.target.value)}
                      placeholder='{"key": "value"}'
                    />
                  </label>
                </div>
              </>
            )}

            {(formData.executor === "shell" || formData.executor === "opencode") && (
              <div>
                <MatrixInput
                  label="Working Directory (optional)"
                  value={formData.workdir}
                  onChange={(e) => updateField("workdir", e.target.value)}
                  placeholder="/path/to/directory"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <MatrixButton type="button" onClick={onClose}>
                Cancel
              </MatrixButton>
              <MatrixButton type="submit" primary>
                Create Task
              </MatrixButton>
            </div>
          </form>
        </AsciiBox>
      </div>
    </div>
  );
}

// ============================================
// TaskDetailModal - Read-only task detail display
// ============================================

interface TaskDetailModalProps {
  task: TaskWithSchedule | null;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!task) return null;

  const generateJsonConfig = () => {
    const config: Record<string, unknown> = {
      id: task.id,
      executor: task.executor,
      description: task.description,
      timeout: task.timeout,
    };

    if (task.workdir) config.workdir = task.workdir;
    if (task.executor === "shell" && task.command) config.command = task.command;
    if (task.executor === "opencode" && task.prompt) config.prompt = task.prompt;

    if (task.executor === "http") {
      if (task.url) config.url = task.url;
      if (task.method) config.method = task.method;
      if (task.headers && Object.keys(task.headers).length > 0) config.headers = task.headers;
      if (task.body) config.body = task.body;
    }

    return JSON.stringify(config, null, 2);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AsciiBox
          title={task.id}
          subtitle={
            task.executor === "shell"
              ? "Shell Task"
              : task.executor === "opencode"
                ? "Opencode Task"
                : "HTTP Task"
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-caption font-bold uppercase ${
                  task.schedules.length === 0
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {task.schedules.length === 0 ? "manual" : "auto"}
              </span>
              <span
                className={`px-2 py-1 text-caption font-bold uppercase ${
                  task.executor === "shell"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : task.executor === "opencode"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                }`}
              >
                {task.executor}
              </span>
              <span className="text-matrix-dim text-caption">
                Timeout: {task.timeout}s
              </span>
            </div>

            <div>
              <h4 className="text-caption text-matrix-ghost uppercase mb-1">
                Description
              </h4>
              <p className="text-matrix-primary">{task.description}</p>
            </div>

            {task.schedules.length > 0 && (
              <div>
                <h4 className="text-caption text-matrix-ghost uppercase mb-2">
                  Schedules ({task.schedules.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {task.schedules.map((schedule, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-matrix-ghost/30 border border-matrix-ghost text-caption"
                    >
                      <span className="text-matrix-primary font-bold">
                        {formatScheduleTime(schedule.hour, schedule.minute)}
                      </span>
                      <span className="text-matrix-dim">
                        {getWeekday(schedule.weekday)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {task.executor === "shell" && task.command && (
              <div>
                <h4 className="text-caption text-matrix-ghost uppercase mb-1">
                  Command
                </h4>
                <pre className="bg-black/50 border border-matrix-ghost p-3 text-body font-mono text-cyan-400 overflow-x-auto">
                  $ {task.command}
                </pre>
              </div>
            )}

            {task.executor === "opencode" && task.prompt && (
              <div>
                <h4 className="text-caption text-matrix-ghost uppercase mb-1">
                  Prompt
                </h4>
                <pre className="bg-black/50 border border-matrix-ghost p-3 text-body font-mono text-purple-300 overflow-x-auto whitespace-pre-wrap">
                  {task.prompt}
                </pre>
              </div>
            )}

            {task.executor === "http" && (
              <div>
                <h4 className="text-caption text-matrix-ghost uppercase mb-1">
                  HTTP
                </h4>
                <div className="space-y-2 text-body">
                  {task.method && (
                    <div>
                      <span className="text-matrix-dim">Method:</span>{" "}
                      <span className="text-matrix-primary font-bold">
                        {task.method}
                      </span>
                    </div>
                  )}
                  {task.url && (
                    <div>
                      <span className="text-matrix-dim">URL:</span>{" "}
                      <code className="text-matrix-primary">{task.url}</code>
                    </div>
                  )}
                  {task.headers && Object.keys(task.headers).length > 0 && (
                    <div>
                      <span className="text-matrix-dim">Headers:</span>
                      <pre className="bg-black/50 border border-matrix-ghost p-3 text-body font-mono text-sky-300 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(task.headers, null, 2)}
                      </pre>
                    </div>
                  )}
                  {task.body && (
                    <div>
                      <span className="text-matrix-dim">Body:</span>
                      <pre className="bg-black/50 border border-matrix-ghost p-3 text-body font-mono text-sky-300 overflow-x-auto whitespace-pre-wrap">
                        {task.body}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {task.workdir && (
              <div>
                <h4 className="text-caption text-matrix-ghost uppercase mb-1">
                  Working Directory
                </h4>
                <code className="text-matrix-primary">{task.workdir}</code>
              </div>
            )}

            <div>
              <h4 className="text-caption text-matrix-ghost uppercase mb-1">
                JSON Configuration
              </h4>
              <pre className="bg-black/50 border border-matrix-ghost p-3 text-body font-mono text-matrix-dim overflow-x-auto">
                {generateJsonConfig()}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <MatrixButton onClick={onClose}>Close</MatrixButton>
            </div>
          </div>
        </AsciiBox>
      </div>
    </div>
  );
}

// ============================================
// RunDetailModal - Run detail display
// ============================================

interface RunDetailModalProps {
  run: RunDetail | null;
  loading: boolean;
  output: string | null;
  outputLoading: boolean;
  outputError: string | null;
  onClose: () => void;
}

export function RunDetailModal({ run, loading, output, outputLoading, outputError, onClose }: RunDetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (run || loading) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [run, loading, handleKeyDown]);

  if (!run && !loading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="matrix-panel p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="py-8 text-center text-matrix-dim animate-pulse">
            Loading run details...
          </div>
        ) : run ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-matrix-primary glow-text">
                  {run.task}
                </h2>
                <p className="text-caption text-matrix-dim mt-1">
                  {run.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-matrix-dim hover:text-matrix-primary text-2xl leading-none"
                title="Close (Esc)"
              >
                {"\u00D7"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <span className="text-caption text-matrix-dim uppercase">Status</span>
                <p className={`font-bold ${run.exit_code == null ? "text-cyan-400" : run.exit_code === 0 ? "text-success" : run.exit_code === -1 ? "text-amber-400" : "text-error"}`}>
                  {formatExitCode(run.exit_code)}
                </p>
              </div>
              <div>
                <span className="text-caption text-matrix-dim uppercase">Trigger</span>
                <p className="text-matrix-primary">{run.trigger}</p>
              </div>
              <div>
                <span className="text-caption text-matrix-dim uppercase">Exit Code</span>
                <p className={run.exit_code == null ? "text-cyan-400" : run.exit_code === 0 ? "text-success" : run.exit_code === -1 ? "text-amber-400" : "text-error"}>
                  {run.exit_code ?? "-"}
                </p>
              </div>
              <div>
                <span className="text-caption text-matrix-dim uppercase">Started</span>
                <p className="text-matrix-primary text-sm">{formatDate(run.started_at)}</p>
              </div>
              <div>
                <span className="text-caption text-matrix-dim uppercase">Finished</span>
                <p className="text-matrix-primary text-sm">
                  {run.finished_at ? formatDate(run.finished_at) : "-"}
                </p>
              </div>
              <div>
                <span className="text-caption text-matrix-dim uppercase">Duration</span>
                <p className="text-matrix-primary">
                  {formatDuration(run.duration_seconds ?? 0)}
                </p>
              </div>
            </div>

            <div>
              <span className="text-caption text-matrix-dim uppercase">Output</span>
              {outputLoading ? (
                <div className="mt-2 p-4 bg-black/50 border border-matrix-ghost text-matrix-dim animate-pulse">
                  Loading output...
                </div>
              ) : outputError ? (
                <div className="mt-2 p-4 bg-black/50 border border-error/30 text-error text-sm">
                  {outputError}
                </div>
              ) : output ? (
                <pre className="mt-2 p-4 bg-black/50 border border-matrix-ghost overflow-x-auto text-xs text-matrix-muted whitespace-pre-wrap font-mono max-h-[50vh] overflow-y-auto">
                  {output}
                </pre>
              ) : (
                <div className="mt-2 p-4 bg-black/50 border border-matrix-ghost text-matrix-dim text-sm">
                  No output available
                </div>
              )}
            </div>

            <div className="mt-4 text-right text-caption text-matrix-dim">
              Press <kbd className="px-1.5 py-0.5 bg-matrix-ghost/20 rounded text-xs">Esc</kbd> to close
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
