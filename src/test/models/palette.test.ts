import { describe, it, expect } from "vitest";
import { CHART_COLORS, withAlpha, chartPositive, chartNegative } from "@/lib/palette";

describe("palette", () => {
  it("exports 24 chart colors", () => {
    expect(CHART_COLORS).toHaveLength(24);
  });

  it("all colors are valid hex", () => {
    for (const c of CHART_COLORS) {
      expect(c).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it("withAlpha returns rgba string", () => {
    const result = withAlpha("#00FF41", 0.5);
    expect(result).toBe("rgba(0, 255, 65, 0.5)");
  });

  it("exports semantic color aliases", () => {
    expect(chartPositive).toBe("#00FF41");
    expect(chartNegative).toBe("#FF3366");
  });
});
