import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LifeAiPage from "@/pages/LifeAiPage";

vi.mock("@/viewmodels/useLifeAiViewModel", () => ({
  useLifeAiViewModel: () => ({
    selectedDate: new Date(2026, 1, 13),
    stats: [
      { title: "Steps", value: "8,432", subtitle: "Goal: 10,000", trend: { value: 12.5, label: "vs last week" } },
      { title: "Heart Rate", value: "72 bpm", subtitle: "Resting avg", trend: { value: -2, label: "vs avg" } },
    ],
    timeline: [
      { id: "e1", time: "07:00", title: "Morning Run", subtitle: "5km", color: "bg-green-500" },
      { id: "e2", time: "12:30", title: "Lunch", subtitle: "Healthy meal" },
    ],
    heatmapData: Array.from({ length: 365 }, (_, i) => {
      const d = new Date(2026, 0, 1 + i);
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return { date: `${d.getFullYear()}-${m}-${day}`, value: i % 10 };
    }),
    weeklySteps: [
      { label: "Mon", value: 7200 },
      { label: "Tue", value: 8400 },
      { label: "Wed", value: 6800 },
      { label: "Thu", value: 9100 },
      { label: "Fri", value: 8432 },
      { label: "Sat", value: 11200 },
      { label: "Sun", value: 5600 },
    ],
    monthlySleep: Array.from({ length: 12 }, (_, i) => ({
      label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      value: 7 + (i % 3) * 0.3,
    })),
    activityBreakdown: [
      { label: "Running", value: 35 },
      { label: "Gym", value: 25 },
    ],
    sleepSlots: [],
    heartRateSlots: [],
    activeEventCount: 1,
    totalCalories: 850,
    goToPrevDay: vi.fn(),
    goToNextDay: vi.fn(),
    goToToday: vi.fn(),
  }),
}));

describe("LifeAiPage", () => {
  it("renders active events section", () => {
    render(<LifeAiPage />);
    expect(screen.getByText("ACTIVE EVENTS")).toBeInTheDocument();
  });

  it("renders total calories section", () => {
    render(<LifeAiPage />);
    expect(screen.getByText("TOTAL CALORIES")).toBeInTheDocument();
  });

  it("renders daily timeline section", () => {
    render(<LifeAiPage />);
    expect(screen.getByText("DAILY TIMELINE")).toBeInTheDocument();
  });

  it("renders today button", () => {
    render(<LifeAiPage />);
    expect(screen.getByText("[TODAY]")).toBeInTheDocument();
  });

  it("renders activity heatmap section", () => {
    render(<LifeAiPage />);
    expect(screen.getByText("ACTIVITY HEATMAP (2026)")).toBeInTheDocument();
  });
});
