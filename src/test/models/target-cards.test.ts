import { describe, it, expect } from "vitest";
import { computeGoalPercent, computeMonthlyTarget, isOnTrack, enrichGoal } from "@/models/target-cards";

describe("target-cards model", () => {
  describe("computeGoalPercent", () => {
    it("calculates percentage", () => {
      expect(computeGoalPercent(7500, 10000)).toBe(75);
    });

    it("returns 0 when target is 0", () => {
      expect(computeGoalPercent(100, 0)).toBe(0);
    });
  });

  describe("computeMonthlyTarget", () => {
    it("calculates monthly needed amount", () => {
      expect(computeMonthlyTarget(7500, 10000, 5)).toBe(500);
    });

    it("returns 0 for non-positive months", () => {
      expect(computeMonthlyTarget(0, 10000, 0)).toBe(0);
    });
  });

  describe("isOnTrack", () => {
    it("returns true when above threshold", () => {
      expect(isOnTrack(7500, 10000)).toBe(true);
    });

    it("returns false when below threshold", () => {
      expect(isOnTrack(2000, 10000)).toBe(false);
    });

    it("returns false when target is 0", () => {
      expect(isOnTrack(100, 0)).toBe(false);
    });
  });

  describe("enrichGoal", () => {
    it("enriches a goal with computed fields", () => {
      const goal = { name: "Trip", target: 5000, saved: 2200, icon: "plane" };
      const result = enrichGoal(goal, 6);
      expect(result.percent).toBe(44);
      expect(result.monthlyTarget).toBe(467);
      expect(result.onTrack).toBe(false);
    });
  });
});
