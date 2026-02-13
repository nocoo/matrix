import { describe, it, expect } from "vitest";
import { countActiveEvents, computeTotalCalories, shiftDate } from "@/models/life-ai";

describe("life-ai model", () => {
  const events = [
    { id: "1", time: "07:00", title: "Run", subtitle: "5km", color: "bg-green-500" },
    { id: "2", time: "08:00", title: "Breakfast", subtitle: "420 kcal" },
    { id: "3", time: "12:00", title: "Lunch", subtitle: "680 kcal" },
    { id: "4", time: "17:00", title: "Gym", color: "bg-blue-500" },
  ];

  it("counts active (colored) events", () => {
    expect(countActiveEvents(events)).toBe(2);
  });

  it("computes total calories from subtitles", () => {
    expect(computeTotalCalories(events)).toBe(1100);
  });

  it("shifts date forward and backward", () => {
    const base = new Date(2026, 1, 13);
    const forward = shiftDate(base, 3);
    expect(forward.getDate()).toBe(16);
    const back = shiftDate(base, -5);
    expect(back.getDate()).toBe(8);
  });
});
