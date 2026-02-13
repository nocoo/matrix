import { describe, it, expect } from "vitest";
import { computeActivitySummary } from "@/models/accounts";

describe("accounts model", () => {
  describe("computeActivitySummary", () => {
    it("computes totals for mixed activity items", () => {
      const items = [
        { desc: "Deposit", amount: 500, date: "Today" },
        { desc: "Withdrawal", amount: -200, date: "Today" },
        { desc: "Refund", amount: 45.99, date: "Yesterday" },
      ];
      const result = computeActivitySummary(items);
      expect(result.totalIn).toBeCloseTo(545.99);
      expect(result.totalOut).toBe(200);
      expect(result.net).toBeCloseTo(345.99);
    });

    it("handles empty array", () => {
      const result = computeActivitySummary([]);
      expect(result.totalIn).toBe(0);
      expect(result.totalOut).toBe(0);
      expect(result.net).toBe(0);
    });
  });
});
