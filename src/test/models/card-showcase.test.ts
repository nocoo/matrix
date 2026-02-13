import { describe, it, expect } from "vitest";
import { computeUtilization, deriveColorScheme, formatBalance } from "@/models/card-showcase";

describe("card-showcase model", () => {
  describe("computeUtilization", () => {
    it("computes percentage correctly", () => {
      expect(computeUtilization(3250, 10000)).toBe(33);
    });

    it("returns 0 when limit is 0", () => {
      expect(computeUtilization(100, 0)).toBe(0);
    });
  });

  describe("deriveColorScheme", () => {
    it("returns amber tones for amex", () => {
      const scheme = deriveColorScheme("amex");
      expect(scheme.chipHighContrast).toBe(true);
      expect(scheme.textPrimary).toContain("amber");
    });

    it("returns white tones for visa", () => {
      const scheme = deriveColorScheme("visa");
      expect(scheme.chipHighContrast).toBe(false);
      expect(scheme.textPrimary).toContain("white");
    });
  });

  describe("formatBalance", () => {
    it("shows dollar amount when visible", () => {
      expect(formatBalance(3250, true)).toBe("$3,250");
    });

    it("masks balance when not visible", () => {
      expect(formatBalance(3250, false)).toBe("******");
    });
  });
});
