// Pure business logic for the Target Cards page.
// No React dependency — fully testable with plain unit tests.

import type { Goal } from "@/models/types";

export function computeGoalPercent(saved: number, target: number): number {
  if (target === 0) return 0;
  return Math.round((saved / target) * 100);
}

export function computeMonthlyTarget(saved: number, target: number, months: number): number {
  if (months <= 0) return 0;
  return Math.round((target - saved) / months);
}

export function isOnTrack(saved: number, target: number, threshold = 0.75): boolean {
  if (target === 0) return false;
  return saved / target >= threshold;
}

export interface GoalViewModel {
  name: string;
  saved: number;
  target: number;
  icon: string;
  percent: number;
  monthlyTarget: number;
  onTrack: boolean;
}

export function enrichGoal(goal: Goal, remainingMonths = 6): GoalViewModel {
  return {
    ...goal,
    percent: computeGoalPercent(goal.saved, goal.target),
    monthlyTarget: computeMonthlyTarget(goal.saved, goal.target, remainingMonths),
    onTrack: isOnTrack(goal.saved, goal.target),
  };
}
