import { describe, it, expect } from "vitest";
import { toastVariantLabel, ALL_TOAST_VARIANTS } from "@/models/interaction-showcase";

describe("interaction-showcase model", () => {
  it("returns correct label for each variant", () => {
    expect(toastVariantLabel("success")).toBe("Success");
    expect(toastVariantLabel("error")).toBe("Error");
    expect(toastVariantLabel("default")).toBe("Default");
  });

  it("exports all 5 toast variants", () => {
    expect(ALL_TOAST_VARIANTS).toHaveLength(5);
  });
});
