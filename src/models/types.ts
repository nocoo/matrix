// Shared type definitions for the template.
// Business consumers: adjust these interfaces to match your domain.

export interface Account {
  name: string;
  balance: number;
  currency: string;
  change: string;
}

export interface ActivityItem {
  desc: string;
  amount: number;
  date: string;
}

export interface CreditCard {
  name: string;
  bank: string;
  network: "visa" | "mastercard" | "amex";
  number: string;
  expiry: string;
  balance: number;
  limit: number;
  color: string;
}

export interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending";
}

export interface Budget {
  category: string;
  spent: number;
  limit: number;
}

export interface MonthlyBudget {
  month: string;
  budget: number;
  actual: number;
}

export interface Goal {
  name: string;
  target: number;
  saved: number;
  icon: string;
}

export interface PortfolioItem {
  name: string;
  value: number;
  allocation: number;
  change: string;
  up: boolean;
}

export interface FAQ {
  q: string;
  a: string;
}

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ShowcaseToast {
  id: string;
  title: string;
  description: string;
  variant: ToastVariant;
}

export interface ShowcaseDialog {
  id: string;
  title: string;
  description: string;
  style: "info" | "form" | "confirm";
}

// -- Runner task scheduling types --

export interface Task {
  id: string;
  executor: "shell" | "opencode" | "http";
  description: string;
  timeout: number;
  command?: string | null;
  prompt?: string | null;
  workdir?: string | null;
  url?: string | null;
  method?: string | null;
  headers?: Record<string, string> | null;
  body?: string | null;
}

export interface Schedule {
  task: string;
  hour: number | string;
  minute: number | string;
  weekday: number | string;
}

export type RunStatus = "running" | "success" | "failed" | "interrupted";

export interface RunSummary {
  id: string;
  task: string;
  exit_code: number | null;
  started_at: string;
  finished_at: string | null;
}

export interface RunDetail {
  id: string;
  task: string;
  trigger: "auto" | "manual";
  started_at: string;
  finished_at?: string;
  duration_seconds?: number;
  exit_code: number | null;
  output_preview?: string;
}

export interface HeatmapCell {
  date: string;
  count: number;
  success: number;
  failed: number;
}

export interface TrendPoint {
  date: string;
  total: number;
  success: number;
  successRate: number;
}

export interface TaskWithSchedule extends Task {
  schedules: Schedule[];
}

export interface UpcomingTask {
  task: Task;
  schedule: Schedule;
  nextRun: Date;
  countdown: number;
}

// -- Life.ai demo types --

export interface LifeAiTimelineEvent {
  id: string;
  time: string; // HH:mm
  title: string;
  subtitle?: string;
  color?: string;
}

export interface LifeAiStat {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label?: string };
}

export interface LifeAiHeatmapPoint {
  date: string; // YYYY-MM-DD
  value: number;
}
