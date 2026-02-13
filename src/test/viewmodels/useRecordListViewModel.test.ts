import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRecordListViewModel } from "@/viewmodels/useRecordListViewModel";

describe("useRecordListViewModel", () => {
  it("returns records with all expected fields", () => {
    const { result } = renderHook(() => useRecordListViewModel());
    const { records } = result.current;
    expect(records.length).toBeGreaterThan(0);
    for (const rec of records) {
      expect(rec).toHaveProperty("id");
      expect(rec).toHaveProperty("direction");
      expect(rec).toHaveProperty("formattedAmount");
      expect(rec).toHaveProperty("statusVariant");
    }
  });

  it("totalCount matches records length", () => {
    const { result } = renderHook(() => useRecordListViewModel());
    expect(result.current.totalCount).toBe(result.current.records.length);
  });

  it("status variants are valid", () => {
    const { result } = renderHook(() => useRecordListViewModel());
    for (const rec of result.current.records) {
      expect(["success", "warning"]).toContain(rec.statusVariant);
    }
  });
});
