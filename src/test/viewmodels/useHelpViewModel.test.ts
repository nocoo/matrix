import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useHelpViewModel } from "@/viewmodels/useHelpViewModel";

describe("useHelpViewModel", () => {
  it("returns resources with icon, title, and desc", () => {
    const { result } = renderHook(() => useHelpViewModel());
    expect(result.current.resources.length).toBeGreaterThan(0);
    result.current.resources.forEach((r) => {
      expect(r).toHaveProperty("icon");
      expect(r).toHaveProperty("title");
      expect(r).toHaveProperty("desc");
    });
  });

  it("returns all FAQs when no search query", () => {
    const { result } = renderHook(() => useHelpViewModel());
    expect(result.current.filteredFAQs).toEqual(result.current.allFAQs);
    expect(result.current.totalFAQs).toBe(result.current.allFAQs.length);
  });

  it("filters FAQs by search query", () => {
    const { result } = renderHook(() => useHelpViewModel("bank account"));
    expect(result.current.filteredFAQs.length).toBeLessThan(result.current.totalFAQs);
    result.current.filteredFAQs.forEach((faq) => {
      const combined = (faq.q + faq.a).toLowerCase();
      expect(combined).toContain("bank account");
    });
  });
});
