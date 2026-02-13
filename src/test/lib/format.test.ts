import { describe, it, expect, vi, afterEach } from "vitest";
import {
  formatDuration,
  formatDurationMs,
  formatRelativeTime,
  formatDate,
  formatTimeUTC8,
  formatExitCode,
  formatNumber,
  formatPercent,
} from "@/lib/format";

describe("format utilities", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("formatDuration", () => {
    it("returns '-' for null/undefined/NaN", () => {
      expect(formatDuration(null as unknown as number)).toBe("-");
      expect(formatDuration(undefined as unknown as number)).toBe("-");
      expect(formatDuration(NaN)).toBe("-");
    });

    it("returns '0s' for 0", () => {
      expect(formatDuration(0)).toBe("0s");
    });

    it("formats seconds only", () => {
      expect(formatDuration(45)).toBe("45s");
    });

    it("formats minutes and seconds", () => {
      expect(formatDuration(125)).toBe("2m 5s");
    });

    it("formats hours, minutes, and seconds", () => {
      expect(formatDuration(3661)).toBe("1h 1m 1s");
    });

    it("formats hours and minutes without seconds", () => {
      expect(formatDuration(3600)).toBe("1h");
      expect(formatDuration(3660)).toBe("1h 1m");
    });

    it("formats only hours and seconds (no minutes)", () => {
      expect(formatDuration(3601)).toBe("1h 1s");
    });
  });

  describe("formatDurationMs", () => {
    it("returns '-' for null/undefined/NaN", () => {
      expect(formatDurationMs(null as unknown as number)).toBe("-");
      expect(formatDurationMs(undefined as unknown as number)).toBe("-");
      expect(formatDurationMs(NaN)).toBe("-");
    });

    it("converts milliseconds to seconds and formats", () => {
      expect(formatDurationMs(5000)).toBe("5s");
      expect(formatDurationMs(125000)).toBe("2m 5s");
    });

    it("truncates sub-second values", () => {
      expect(formatDurationMs(999)).toBe("0s");
    });
  });

  describe("formatRelativeTime", () => {
    it("returns '-' for empty string", () => {
      expect(formatRelativeTime("")).toBe("-");
    });

    it("returns '-' for invalid date", () => {
      expect(formatRelativeTime("not-a-date")).toBe("-");
    });

    it("returns seconds ago for recent times", () => {
      const now = new Date();
      const result = formatRelativeTime(now.toISOString());
      expect(result).toMatch(/^\d+s ago$/);
    });

    it("returns minutes ago", () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinAgo.toISOString())).toBe("5m ago");
    });

    it("returns hours ago", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo.toISOString())).toBe("2h ago");
    });

    it("returns days ago", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo.toISOString())).toBe("3d ago");
    });
  });

  describe("formatDate", () => {
    it("returns '-' for empty string", () => {
      expect(formatDate("")).toBe("-");
    });

    it("returns '-' for invalid date", () => {
      expect(formatDate("not-a-date")).toBe("-");
    });

    it("formats a valid ISO date string", () => {
      const result = formatDate("2026-06-15T10:30:00Z");
      // Should contain month and day at minimum
      expect(result).toBeTruthy();
      expect(result).not.toBe("-");
    });
  });

  describe("formatTimeUTC8", () => {
    it("returns '-' for empty string", () => {
      expect(formatTimeUTC8("")).toBe("-");
    });

    it("returns '-' for invalid date", () => {
      expect(formatTimeUTC8("not-a-date")).toBe("-");
    });

    it("formats time in UTC+8", () => {
      // 2026-01-01T00:00:00Z → UTC+8 = 08:00:00
      expect(formatTimeUTC8("2026-01-01T00:00:00Z")).toBe("08:00:00");
    });

    it("handles midnight in UTC+8", () => {
      // 2026-01-01T16:00:00Z → UTC+8 = 00:00:00 next day
      expect(formatTimeUTC8("2026-01-01T16:00:00Z")).toBe("00:00:00");
    });
  });

  describe("formatExitCode", () => {
    it("returns 'RUNNING' for null", () => {
      expect(formatExitCode(null)).toBe("RUNNING");
    });

    it("returns 'OK' for 0", () => {
      expect(formatExitCode(0)).toBe("OK");
    });

    it("returns 'INTERRUPTED' for -1", () => {
      expect(formatExitCode(-1)).toBe("INTERRUPTED");
    });

    it("returns 'FAILED' for other codes", () => {
      expect(formatExitCode(1)).toBe("FAILED");
      expect(formatExitCode(127)).toBe("FAILED");
    });
  });

  describe("formatNumber", () => {
    it("formats numbers with locale separators", () => {
      const result = formatNumber(1234567);
      // The exact format depends on locale, but should contain digits
      expect(result).toBeTruthy();
      expect(result.replace(/[,.\s]/g, "")).toBe("1234567");
    });
  });

  describe("formatPercent", () => {
    it("converts 0-1 ratio to percentage string", () => {
      expect(formatPercent(0.8)).toBe("80%");
      expect(formatPercent(1)).toBe("100%");
      expect(formatPercent(0)).toBe("0%");
    });

    it("rounds to nearest integer", () => {
      expect(formatPercent(0.333)).toBe("33%");
      expect(formatPercent(0.666)).toBe("67%");
    });
  });
});
