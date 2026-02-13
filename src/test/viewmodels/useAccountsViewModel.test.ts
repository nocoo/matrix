import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAccountsViewModel } from "@/viewmodels/useAccountsViewModel";

describe("useAccountsViewModel", () => {
  it("returns non-empty account list", () => {
    const { result } = renderHook(() => useAccountsViewModel());
    expect(result.current.accountList.length).toBeGreaterThan(0);
    for (const acc of result.current.accountList) {
      expect(acc).toHaveProperty("name");
      expect(acc).toHaveProperty("balance");
      expect(acc).toHaveProperty("change");
    }
  });

  it("returns activity list with direction and formattedAmount", () => {
    const { result } = renderHook(() => useAccountsViewModel());
    const { activityList } = result.current;
    expect(activityList.length).toBeGreaterThan(0);
    for (const item of activityList) {
      expect(["positive", "negative"]).toContain(item.direction);
      expect(item.formattedAmount).toMatch(/^\+?\$[\d,.]+$/);
    }
  });

  it("returns activity summary", () => {
    const { result } = renderHook(() => useAccountsViewModel());
    const { activitySummary } = result.current;
    expect(activitySummary.net).toBe(activitySummary.totalIn - activitySummary.totalOut);
  });
});
