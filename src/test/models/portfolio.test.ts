import { describe, it, expect } from "vitest";
import { computePortfolioTotal } from "@/models/portfolio";

describe("portfolio model", () => {
  it("sums portfolio item values", () => {
    const items = [
      { name: "Stocks", value: 45000, allocation: 45, change: "+12%", up: true },
      { name: "Bonds", value: 20000, allocation: 20, change: "+3%", up: true },
      { name: "Crypto", value: 10000, allocation: 10, change: "-5%", up: false },
    ];
    expect(computePortfolioTotal(items)).toBe(75000);
  });

  it("returns 0 for empty array", () => {
    expect(computePortfolioTotal([])).toBe(0);
  });
});
