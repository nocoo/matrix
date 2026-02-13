import { describe, it, expect } from "vitest";
import { computeFlowSummary, deriveNetFlow } from "@/models/flow-comparison";

describe("flow-comparison model", () => {
  const data = [
    { month: "Jan", inflow: 6800, outflow: 5300 },
    { month: "Feb", inflow: 7900, outflow: 5100 },
  ];

  describe("computeFlowSummary", () => {
    it("totals inflows and outflows", () => {
      const result = computeFlowSummary(data);
      expect(result.totalInflow).toBe(14700);
      expect(result.totalOutflow).toBe(10400);
      expect(result.netFlow).toBe(4300);
    });
  });

  describe("deriveNetFlow", () => {
    it("adds net field to each entry", () => {
      const result = deriveNetFlow(data);
      expect(result[0].net).toBe(1500);
      expect(result[1].net).toBe(2800);
    });
  });
});
