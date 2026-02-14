// ViewModel for the enriched Dashboard page.
// Composes multiple data domains into a single hook for the view layer.

import { useMemo } from "react";
import {
  accounts,
  walletActivity,
  budgets,
  analyticsStats,
  analyticsTrend,
  monthlyFlow,
  portfolio,
  goals,
} from "@/data/mock";
import {
  classifyDirection,
  formatSignedAmount,
  computeActivitySummary,
} from "@/models/accounts";
import { enrichGoal } from "@/models/target-cards";
import {
  generatePixelHeatmap,
  HEATMAP_ROWS,
  HEATMAP_COLS,
  HEATMAP_MAX,
} from "@/models/pixel-heatmap";
import type { HeatmapCell } from "@/models/pixel-heatmap";
import type { GoalViewModel } from "@/models/target-cards";
import type { AccountItem, ActivityRow } from "@/viewmodels/useAccountsViewModel";

export interface BudgetRow {
  category: string;
  spent: number;
  limit: number;
  percent: number;
  overBudget: boolean;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface FlowPoint {
  month: string;
  inflow: number;
  outflow: number;
  net: number;
}

export interface PortfolioRow {
  name: string;
  value: number;
  allocation: number;
  change: string;
  up: boolean;
}

export function useDashboardViewModel() {
  const accountList: AccountItem[] = useMemo(
    () => accounts.map((a) => ({ name: a.name, balance: a.balance, change: a.change })),
    [],
  );

  const activityList: ActivityRow[] = useMemo(
    () =>
      walletActivity.map((item) => ({
        ...item,
        direction: classifyDirection(item.amount),
        formattedAmount: formatSignedAmount(item.amount),
      })),
    [],
  );

  const activitySummary = useMemo(() => computeActivitySummary(walletActivity), []);

  const enrichedGoals: GoalViewModel[] = useMemo(
    () => goals.map((g) => enrichGoal(g)),
    [],
  );

  const budgetRows: BudgetRow[] = useMemo(
    () =>
      budgets.map((b) => ({
        category: b.category,
        spent: b.spent,
        limit: b.limit,
        percent: Math.round((b.spent / b.limit) * 100),
        overBudget: b.spent > b.limit,
      })),
    [],
  );

  const statCards: StatCard[] = useMemo(
    () =>
      analyticsStats.map((s) => ({
        label: s.label,
        value: s.value,
        change: s.change,
        isPositive: s.change.startsWith("+"),
      })),
    [],
  );

  const trendData: number[] = useMemo(
    () => analyticsTrend.map((d) => Math.round(d.value)),
    [],
  );

  const flowData: FlowPoint[] = useMemo(
    () =>
      monthlyFlow.map((f) => ({
        month: f.month,
        inflow: f.inflow,
        outflow: f.outflow,
        net: f.inflow - f.outflow,
      })),
    [],
  );

  const portfolioRows: PortfolioRow[] = useMemo(
    () =>
      portfolio.map((p) => ({
        name: p.name,
        value: p.value,
        allocation: p.allocation,
        change: p.change,
        up: p.up,
      })),
    [],
  );

  const totalPortfolioValue = useMemo(
    () => portfolio.reduce((sum, p) => sum + p.value, 0),
    [],
  );

  const pixelHeatmap: HeatmapCell[] = useMemo(() => generatePixelHeatmap(), []);

  return {
    accountList,
    activityList,
    activitySummary,
    goals: enrichedGoals,
    budgetRows,
    statCards,
    trendData,
    flowData,
    portfolioRows,
    totalPortfolioValue,
    pixelHeatmap,
    pixelHeatmapRows: HEATMAP_ROWS,
    pixelHeatmapCols: HEATMAP_COLS,
    pixelHeatmapMax: HEATMAP_MAX,
  };
}
