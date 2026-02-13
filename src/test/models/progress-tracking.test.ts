import { describe, it, expect } from "vitest";
import { computeProgressSummary, computeProgressPercent } from "@/models/progress-tracking";

describe("progress-tracking model", () => {
  describe("computeProgressSummary", () => {
    it("totals spent and limits", () => {
      const budgets = [
        { category: "Food", spent: 420, limit: 600 },
        { category: "Transport", spent: 180, limit: 300 },
      ];
      const result = computeProgressSummary(budgets);
      expect(result.totalSpent).toBe(600);
      expect(result.totalLimit).toBe(900);
      expect(result.remaining).toBe(300);
    });
  });

  describe("computeProgressPercent", () => {
    it("calculates percentage", () => {
      expect(computeProgressPercent(420, 600)).toBeCloseTo(70);
    });

    it("returns 0 when target is 0", () => {
      expect(computeProgressPercent(100, 0)).toBe(0);
    });
  });
});
