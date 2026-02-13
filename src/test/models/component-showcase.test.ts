import { describe, it, expect } from "vitest";
import {
  createMockTasks,
  createMockRuns,
  createMockRunDetail,
  createMockHeatmap,
  createMockTrend,
  createMockUpcomingTasks,
  createMockLeaderboard,
  createMockModelUsage,
  createMockFleetData,
  createMockNeuralFleetData,
  createMockTrendMonitorData,
  MOCK_RUN_OUTPUT,
  countTasksByExecutor,
  countTotalSchedules,
  calculateSuccessRate,
  getTotalPages,
} from "@/models/component-showcase";

describe("component-showcase model", () => {
  describe("createMockTasks", () => {
    it("returns 5 tasks with schedules", () => {
      const tasks = createMockTasks();
      expect(tasks).toHaveLength(5);
      tasks.forEach((t) => {
        expect(t).toHaveProperty("id");
        expect(t).toHaveProperty("executor");
        expect(t).toHaveProperty("schedules");
        expect(t.schedules.length).toBeGreaterThan(0);
      });
    });

    it("includes all executor types", () => {
      const tasks = createMockTasks();
      const executors = new Set(tasks.map((t) => t.executor));
      expect(executors).toContain("opencode");
      expect(executors).toContain("shell");
      expect(executors).toContain("http");
    });
  });

  describe("createMockRuns", () => {
    it("returns 10 run summaries", () => {
      const runs = createMockRuns();
      expect(runs).toHaveLength(10);
      runs.forEach((r) => {
        expect(r).toHaveProperty("id");
        expect(r).toHaveProperty("task");
        expect(r).toHaveProperty("exit_code");
        expect(r).toHaveProperty("started_at");
        expect(r).toHaveProperty("finished_at");
      });
    });

    it("contains both successful and failed runs", () => {
      const runs = createMockRuns();
      const exitCodes = new Set(runs.map((r) => r.exit_code));
      expect(exitCodes).toContain(0);
      expect(exitCodes).toContain(1);
    });
  });

  describe("createMockRunDetail", () => {
    it("returns a valid run detail", () => {
      const detail = createMockRunDetail();
      expect(detail.id).toBe("run-001");
      expect(detail.task).toBe("morning_briefing");
      expect(detail.trigger).toBe("auto");
      expect(detail.exit_code).toBe(0);
      expect(detail.duration_seconds).toBe(45);
      expect(detail.output_preview).toBeTruthy();
    });
  });

  describe("MOCK_RUN_OUTPUT", () => {
    it("is a non-empty string", () => {
      expect(typeof MOCK_RUN_OUTPUT).toBe("string");
      expect(MOCK_RUN_OUTPUT.length).toBeGreaterThan(50);
    });
  });

  describe("createMockHeatmap", () => {
    it("returns deterministic cells", () => {
      const a = createMockHeatmap();
      const b = createMockHeatmap();
      expect(a).toEqual(b);
    });

    it("cells have required fields", () => {
      const cells = createMockHeatmap();
      expect(cells.length).toBeGreaterThan(0);
      cells.forEach((c) => {
        expect(c).toHaveProperty("date");
        expect(c).toHaveProperty("count");
        expect(c).toHaveProperty("success");
        expect(c).toHaveProperty("failed");
        expect(c.count).toBe(c.success + c.failed);
      });
    });
  });

  describe("createMockTrend", () => {
    it("returns 14 deterministic trend points", () => {
      const a = createMockTrend();
      const b = createMockTrend();
      expect(a).toHaveLength(14);
      expect(a).toEqual(b);
    });

    it("points have required fields", () => {
      const points = createMockTrend();
      points.forEach((p) => {
        expect(p).toHaveProperty("date");
        expect(p).toHaveProperty("total");
        expect(p).toHaveProperty("success");
        expect(p).toHaveProperty("successRate");
        expect(p.success).toBeLessThanOrEqual(p.total);
        expect(p.successRate).toBeGreaterThanOrEqual(0);
        expect(p.successRate).toBeLessThanOrEqual(1);
      });
    });
  });

  describe("createMockUpcomingTasks", () => {
    it("returns up to 8 upcoming tasks sorted by countdown", () => {
      const tasks = createMockTasks();
      const upcoming = createMockUpcomingTasks(tasks);
      expect(upcoming.length).toBeLessThanOrEqual(8);
      for (let i = 1; i < upcoming.length; i++) {
        expect(upcoming[i].countdown).toBeGreaterThanOrEqual(upcoming[i - 1].countdown);
      }
    });

    it("each upcoming task references a valid task", () => {
      const tasks = createMockTasks();
      const upcoming = createMockUpcomingTasks(tasks);
      const taskIds = new Set(tasks.map((t) => t.id));
      upcoming.forEach((u) => {
        expect(taskIds).toContain(u.task.id);
      });
    });
  });

  describe("createMockLeaderboard", () => {
    it("returns 5 entries with required fields", () => {
      const lb = createMockLeaderboard();
      expect(lb).toHaveLength(5);
      lb.forEach((e) => {
        expect(e).toHaveProperty("rank");
        expect(e).toHaveProperty("name");
        expect(e).toHaveProperty("value");
      });
    });

    it("marks special entries", () => {
      const lb = createMockLeaderboard();
      expect(lb.find((e) => e.isTheOne)).toBeTruthy();
      expect(lb.find((e) => e.isSelf)).toBeTruthy();
      expect(lb.find((e) => e.isAnon)).toBeTruthy();
    });
  });

  describe("createMockModelUsage", () => {
    it("returns 4 model entries summing to 100%", () => {
      const models = createMockModelUsage();
      expect(models).toHaveLength(4);
      const total = models.reduce((s, m) => s + m.percent, 0);
      expect(total).toBe(100);
    });
  });

  describe("createMockFleetData", () => {
    it("returns 2 fleet entries with models", () => {
      const fleet = createMockFleetData();
      expect(fleet).toHaveLength(2);
      fleet.forEach((f) => {
        expect(f).toHaveProperty("label");
        expect(f).toHaveProperty("usd");
        expect(f.models.length).toBeGreaterThan(0);
      });
    });
  });

  describe("createMockNeuralFleetData", () => {
    it("returns 2 neural fleet entries summing to 100%", () => {
      const data = createMockNeuralFleetData();
      expect(data).toHaveLength(2);
      const total = data.reduce((s, d) => s + d.totalPercent, 0);
      expect(total).toBe(100);
    });
  });

  describe("createMockTrendMonitorData", () => {
    it("returns the requested count of deterministic values", () => {
      const a = createMockTrendMonitorData(20);
      const b = createMockTrendMonitorData(20);
      expect(a).toHaveLength(20);
      expect(a).toEqual(b);
    });

    it("defaults to 30 values", () => {
      expect(createMockTrendMonitorData()).toHaveLength(30);
    });
  });

  describe("countTasksByExecutor", () => {
    it("counts tasks grouped by executor", () => {
      const tasks = createMockTasks();
      const counts = countTasksByExecutor(tasks);
      expect(counts.opencode).toBe(3);
      expect(counts.shell).toBe(1);
      expect(counts.http).toBe(1);
    });
  });

  describe("countTotalSchedules", () => {
    it("sums all schedules across tasks", () => {
      const tasks = createMockTasks();
      // morning_briefing=1, heartbeat=4, clock=2, webhook_ping=1, twitter_collect=1 => 9
      expect(countTotalSchedules(tasks)).toBe(9);
    });
  });

  describe("calculateSuccessRate", () => {
    it("computes ratio of exit_code=0 runs", () => {
      const runs = createMockRuns();
      const rate = calculateSuccessRate(runs);
      // 8 success out of 10
      expect(rate).toBe(0.8);
    });

    it("returns 0 for empty array", () => {
      expect(calculateSuccessRate([])).toBe(0);
    });
  });

  describe("getTotalPages", () => {
    it("computes correct page count", () => {
      expect(getTotalPages(10, 5)).toBe(2);
      expect(getTotalPages(11, 5)).toBe(3);
      expect(getTotalPages(0, 5)).toBe(1);
    });
  });
});
