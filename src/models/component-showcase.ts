// ============================================
// Component Showcase Model
// Pure functions to generate mock data for all showcase sections.
// Zero React — just data generation.
// ============================================

import type {
  TaskWithSchedule,
  RunSummary,
  RunDetail,
  HeatmapCell,
  TrendPoint,
  UpcomingTask,
  Task,
} from "@/models/types";

// ============================================
// Runner tasks mock data
// ============================================

export function createMockTasks(): TaskWithSchedule[] {
  return [
    {
      id: "morning_briefing",
      executor: "opencode",
      description: "Daily morning briefing with weather, calendar, and tasks",
      timeout: 300,
      prompt: "Generate a morning briefing summary with weather, calendar events, and pending tasks.",
      schedules: [{ task: "morning_briefing", hour: 9, minute: 0, weekday: "*" }],
    },
    {
      id: "heartbeat",
      executor: "shell",
      description: "System heartbeat check every 10 minutes",
      timeout: 60,
      command: "afplay /System/Library/Sounds/Pop.aiff",
      schedules: [
        { task: "heartbeat", hour: "*", minute: 10, weekday: "*" },
        { task: "heartbeat", hour: "*", minute: 20, weekday: "*" },
        { task: "heartbeat", hour: "*", minute: 40, weekday: "*" },
        { task: "heartbeat", hour: "*", minute: 50, weekday: "*" },
      ],
    },
    {
      id: "clock",
      executor: "opencode",
      description: "Hourly chime with time announcement",
      timeout: 60,
      prompt: "Announce the current time using the say command.",
      schedules: [
        { task: "clock", hour: "*", minute: 0, weekday: "*" },
        { task: "clock", hour: "*", minute: 30, weekday: "*" },
      ],
    },
    {
      id: "webhook_ping",
      executor: "http",
      description: "Notify external webhook on schedule",
      timeout: 30,
      url: "https://hooks.example.com/runner/ping",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Runner-Token": "demo-token",
      },
      body: '{"status":"ok"}',
      schedules: [{ task: "webhook_ping", hour: 10, minute: 15, weekday: "*" }],
    },
    {
      id: "twitter_collect",
      executor: "opencode",
      description: "Collect and summarize Twitter feed",
      timeout: 180,
      prompt: "Collect relevant tweets from the timeline and generate a summary.",
      schedules: [{ task: "twitter_collect", hour: 10, minute: 0, weekday: "*" }],
    },
  ];
}

// ============================================
// Run summaries mock data
// ============================================

export function createMockRuns(): RunSummary[] {
  return [
    { id: "run-001", task: "morning_briefing", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T09:05:00+08:00" },
    { id: "run-002", task: "heartbeat", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T09:10:00+08:00" },
    { id: "run-003", task: "heartbeat", exit_code: 1, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T09:20:00+08:00" },
    { id: "run-004", task: "twitter_collect", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T10:00:00+08:00" },
    { id: "run-005", task: "heartbeat", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T10:10:00+08:00" },
    { id: "run-006", task: "heartbeat", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T10:20:00+08:00" },
    { id: "run-007", task: "clock", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T11:00:00+08:00" },
    { id: "run-008", task: "heartbeat", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T11:10:00+08:00" },
    { id: "run-009", task: "heartbeat", exit_code: 1, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T11:20:00+08:00" },
    { id: "run-010", task: "clock", exit_code: 0, started_at: "2026-01-24T09:00:00Z", finished_at: "2026-01-24T12:00:00+08:00" },
  ];
}

// ============================================
// Run detail mock data
// ============================================

export function createMockRunDetail(): RunDetail {
  return {
    id: "run-001",
    task: "morning_briefing",
    trigger: "auto",
    started_at: "2026-01-24T09:04:15+08:00",
    finished_at: "2026-01-24T09:05:00+08:00",
    duration_seconds: 45,
    exit_code: 0,
    output_preview: "Good morning! Here's your briefing for today...\n\nWeather: Sunny, 22C\nCalendar: 3 meetings\nTasks: 5 pending items\n\nHave a productive day!",
  };
}

export const MOCK_RUN_OUTPUT = "$ morning_briefing\n[09:04:15] Starting morning briefing...\n[09:04:16] Fetching weather data...\n[09:04:18] Weather: Sunny, 22C\n[09:04:19] Fetching calendar events...\n[09:04:21] Calendar: 3 meetings today\n[09:04:22] Fetching pending tasks...\n[09:04:24] Tasks: 5 pending items\n[09:04:25] Generating summary...\n[09:04:45] Done.\n\nGood morning! Here's your briefing for today...\n\nWeather: Sunny, 22C\nCalendar: 3 meetings\nTasks: 5 pending items\n\nHave a productive day!";

// ============================================
// Heatmap mock data (deterministic)
// ============================================

/**
 * Generate mock heatmap cells for last 30 days x 8 time slots.
 * Uses a seeded PRNG for deterministic results.
 */
export function createMockHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const now = new Date();
  const slots = [4, 6, 8, 10, 12, 14, 16, 18];
  let seed = 42;
  const random = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let d = 29; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    for (const slot of slots) {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseChance = isWeekend ? 0.3 : 0.7;
      const isActiveHour = slot >= 8 && slot <= 18;
      const chance = isActiveHour ? baseChance : baseChance * 0.3;

      if (random() < chance) {
        const count = Math.floor(random() * 8) + 1;
        const failed = random() < 0.1 ? Math.floor(random() * 2) : 0;
        cells.push({
          date: `${dateStr}T${String(slot).padStart(2, "0")}:00:00`,
          count,
          success: count - failed,
          failed,
        });
      }
    }
  }

  return cells;
}

// ============================================
// Trend mock data (deterministic)
// ============================================

/**
 * Generate mock trend points for last 14 days.
 */
export function createMockTrend(): TrendPoint[] {
  const points: TrendPoint[] = [];
  const now = new Date();
  let seed = 77;
  const random = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let d = 13; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseTotal = isWeekend ? 20 : 50;
    const total = baseTotal + Math.floor(random() * 20) - 10;
    const successRate = 0.85 + random() * 0.15;
    const success = Math.floor(total * successRate);

    points.push({ date: dateStr, total, success, successRate });
  }

  return points;
}

// ============================================
// Upcoming tasks mock data
// ============================================

/**
 * Generate upcoming tasks based on task schedules.
 */
export function createMockUpcomingTasks(tasks: TaskWithSchedule[]): UpcomingTask[] {
  const now = new Date();
  const upcoming: UpcomingTask[] = [];

  for (const task of tasks) {
    for (const schedule of task.schedules) {
      // Generate next run times for today and tomorrow
      for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
        const runDate = new Date(now);
        runDate.setDate(runDate.getDate() + dayOffset);

        const hour = schedule.hour === "*" ? runDate.getHours() + (dayOffset === 0 ? 1 : 0) : Number(schedule.hour);
        const minute = schedule.minute === "*" ? 0 : Number(schedule.minute);

        runDate.setHours(hour, minute, 0, 0);

        if (runDate.getTime() > now.getTime()) {
          const countdown = runDate.getTime() - now.getTime();
          const baseTask: Task = {
            id: task.id,
            executor: task.executor,
            description: task.description,
            timeout: task.timeout,
            command: task.command,
            prompt: task.prompt,
            workdir: task.workdir,
            url: task.url,
            method: task.method,
            headers: task.headers,
            body: task.body,
          };

          upcoming.push({
            task: baseTask,
            schedule,
            nextRun: runDate,
            countdown,
          });
        }
      }
    }
  }

  // Sort by countdown ascending and take first 8
  upcoming.sort((a, b) => a.countdown - b.countdown);
  return upcoming.slice(0, 8);
}

// ============================================
// Vibe components mock data
// ============================================

export interface MockLeaderboardEntry {
  rank: number;
  name: string;
  value: number;
  isTheOne?: boolean;
  isSelf?: boolean;
  isAnon?: boolean;
}

export function createMockLeaderboard(): MockLeaderboardEntry[] {
  return [
    { rank: 1, name: "ARCHITECT", value: 15420, isTheOne: true },
    { rank: 2, name: "ORACLE", value: 12850 },
    { rank: 3, name: "MORPHEUS", value: 11200 },
    { rank: 4, name: "YOU", value: 8750, isSelf: true },
    { rank: 5, name: "ANON_7734", value: 7200, isAnon: true },
  ];
}

export interface MockModelUsage {
  model: string;
  cost: number;
  percent: number;
}

export function createMockModelUsage(): MockModelUsage[] {
  return [
    { model: "claude-4-sonnet", cost: 125.5, percent: 45 },
    { model: "gpt-4o", cost: 89.2, percent: 32 },
    { model: "claude-4-haiku", cost: 45.3, percent: 16 },
    { model: "gpt-4o-mini", cost: 19.8, percent: 7 },
  ];
}

export interface MockFleetEntry {
  label: string;
  usd: number;
  models: { id: string; name: string; share: number; calc: string }[];
}

export function createMockFleetData(): MockFleetEntry[] {
  return [
    {
      label: "Primary Fleet",
      usd: 180.5,
      models: [
        { id: "claude-4-sonnet", name: "Claude 4 Sonnet", share: 0.45, calc: "450 req x $0.40" },
        { id: "gpt-4o", name: "GPT-4o", share: 0.35, calc: "320 req x $0.35" },
      ],
    },
    {
      label: "Secondary Fleet",
      usd: 99.3,
      models: [
        { id: "claude-4-haiku", name: "Claude 4 Haiku", share: 0.6, calc: "160 req x $0.25" },
        { id: "gpt-4o-mini", name: "GPT-4o Mini", share: 0.4, calc: "70 req x $0.15" },
      ],
    },
  ];
}

export interface MockNeuralFleetData {
  label: string;
  totalPercent: number;
  usage: number;
  models: { name: string; share: number }[];
}

export function createMockNeuralFleetData(): MockNeuralFleetData[] {
  return [
    {
      label: "ANTHROPIC",
      totalPercent: 65,
      usage: 812500,
      models: [
        { name: "claude-4-sonnet", share: 45 },
        { name: "claude-4-haiku", share: 20 },
      ],
    },
    {
      label: "OPENAI",
      totalPercent: 35,
      usage: 437500,
      models: [
        { name: "gpt-4o", share: 25 },
        { name: "gpt-4o-mini", share: 10 },
      ],
    },
  ];
}

/**
 * Generate trend monitor data (simple numeric values).
 * Uses seeded PRNG for deterministic results.
 */
export function createMockTrendMonitorData(count: number = 30): number[] {
  let seed = 123;
  const random = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  return Array.from({ length: count }, () => Math.floor(random() * 100) + 20);
}

/**
 * Count total tasks by executor type.
 */
export function countTasksByExecutor(tasks: TaskWithSchedule[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const task of tasks) {
    counts[task.executor] = (counts[task.executor] || 0) + 1;
  }
  return counts;
}

/**
 * Count total schedules across all tasks.
 */
export function countTotalSchedules(tasks: TaskWithSchedule[]): number {
  return tasks.reduce((sum, t) => sum + t.schedules.length, 0);
}

/**
 * Calculate run success rate from run summaries.
 */
export function calculateSuccessRate(runs: RunSummary[]): number {
  if (runs.length === 0) return 0;
  const successful = runs.filter((r) => r.exit_code === 0).length;
  return successful / runs.length;
}

/**
 * Get total pages given item count and page size.
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
