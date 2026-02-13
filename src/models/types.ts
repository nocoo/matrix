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
