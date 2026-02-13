import { describe, it, expect } from "vitest";
import { classifyDirection, formatSignedAmount } from "@/models/amount";

describe("amount", () => {
  describe("classifyDirection", () => {
    it("returns positive for amounts > 0", () => {
      expect(classifyDirection(100)).toBe("positive");
    });

    it("returns negative for amounts <= 0", () => {
      expect(classifyDirection(-50)).toBe("negative");
      expect(classifyDirection(0)).toBe("negative");
    });
  });

  describe("formatSignedAmount", () => {
    it("formats positive amounts with + prefix", () => {
      expect(formatSignedAmount(250)).toBe("+$250.00");
    });

    it("formats negative amounts with bare $ prefix (abs value)", () => {
      // formatSignedAmount uses Math.abs — no minus sign, just "$"
      expect(formatSignedAmount(-42.5)).toBe("$42.50");
    });

    it("formats zero", () => {
      expect(formatSignedAmount(0)).toBe("$0.00");
    });
  });
});
