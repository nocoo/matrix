// Pure business logic for the Progress Tracking page.
// No React dependency — fully testable with plain unit tests.

import type { Budget } from "@/models/types";

interface ProgressSummary {
  totalSpent: number;
  totalLimit: number;
  remaining: number;
}

export function computeProgressSummary(items: Budget[]): ProgressSummary {
  const totalSpent = items.reduce((sum, item) => sum + item.spent, 0);
  const totalLimit = items.reduce((sum, item) => sum + item.limit, 0);
  return { totalSpent, totalLimit, remaining: totalLimit - totalSpent };
}

export function computeProgressPercent(current: number, target: number): number {
  if (target === 0) return 0;
  return (current / target) * 100;
}
