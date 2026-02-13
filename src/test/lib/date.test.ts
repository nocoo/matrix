import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getDateKey,
  getDaysAgo,
  isToday,
  getWeekday,
  formatScheduleTime,
  getDateRange,
  getDateNDaysAgo,
  getTodayKey,
} from "@/lib/date";

describe("date utilities", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getDateKey", () => {
    it("formats a Date object as YYYY-MM-DD", () => {
      const d = new Date(2026, 0, 5); // Jan 5, 2026
      expect(getDateKey(d)).toBe("2026-01-05");
    });

    it("pads single-digit month and day", () => {
      const d = new Date(2026, 2, 3); // Mar 3, 2026
      expect(getDateKey(d)).toBe("2026-03-03");
    });

    it("accepts an ISO string", () => {
      // Use a date string that creates the same local date regardless of TZ
      const d = new Date(2026, 11, 25); // Dec 25, 2026
      const key = getDateKey(d.toISOString());
      expect(key).toBe(getDateKey(d));
    });
  });

  describe("getDaysAgo", () => {
    it("returns 0 for today", () => {
      const now = new Date();
      expect(getDaysAgo(now.toISOString())).toBe(0);
    });

    it("returns 1 for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(getDaysAgo(yesterday.toISOString())).toBe(1);
    });

    it("returns positive number for past dates", () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      expect(getDaysAgo(weekAgo.toISOString())).toBe(7);
    });
  });

  describe("isToday", () => {
    it("returns true for today", () => {
      expect(isToday(new Date().toISOString())).toBe(true);
    });

    it("returns false for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday.toISOString())).toBe(false);
    });
  });

  describe("getWeekday", () => {
    it("returns 'Daily' for '*'", () => {
      expect(getWeekday("*")).toBe("Daily");
    });

    it("returns the string as-is for non-numeric strings", () => {
      expect(getWeekday("Monday")).toBe("Monday");
    });

    it("returns weekday name for valid index", () => {
      expect(getWeekday(0)).toBe("Sun");
      expect(getWeekday(1)).toBe("Mon");
      expect(getWeekday(6)).toBe("Sat");
    });

    it("returns '?' for out-of-range index", () => {
      expect(getWeekday(7)).toBe("?");
      expect(getWeekday(-1)).toBe("?");
    });
  });

  describe("formatScheduleTime", () => {
    it("formats numeric hour and minute with padding", () => {
      expect(formatScheduleTime(8, 5)).toBe("08:05");
      expect(formatScheduleTime(14, 30)).toBe("14:30");
    });

    it("handles wildcard '*'", () => {
      expect(formatScheduleTime("*", 30)).toBe("*:30");
      expect(formatScheduleTime(8, "*")).toBe("08:*");
      expect(formatScheduleTime("*", "*")).toBe("*:*");
    });

    it("passes through string values as-is", () => {
      expect(formatScheduleTime("12", "00")).toBe("12:00");
    });
  });

  describe("getDateRange", () => {
    it("returns array of date keys between start and end (inclusive)", () => {
      const result = getDateRange("2026-01-01", "2026-01-03");
      expect(result).toHaveLength(3);
      expect(result[0]).toBe("2026-01-01");
      expect(result[1]).toBe("2026-01-02");
      expect(result[2]).toBe("2026-01-03");
    });

    it("returns single element when start equals end", () => {
      const result = getDateRange("2026-06-15", "2026-06-15");
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("2026-06-15");
    });

    it("returns empty array when start is after end", () => {
      const result = getDateRange("2026-01-05", "2026-01-01");
      expect(result).toHaveLength(0);
    });
  });

  describe("getDateNDaysAgo", () => {
    it("returns today's key for 0 days", () => {
      expect(getDateNDaysAgo(0)).toBe(getTodayKey());
    });

    it("returns correct date for N days ago", () => {
      const expected = new Date();
      expected.setDate(expected.getDate() - 5);
      expect(getDateNDaysAgo(5)).toBe(getDateKey(expected));
    });
  });

  describe("getTodayKey", () => {
    it("returns today's date in YYYY-MM-DD format", () => {
      const now = new Date();
      const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      expect(getTodayKey()).toBe(expected);
    });
  });
});
