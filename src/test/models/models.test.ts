import { describe, expect, it } from "vitest";
import {
	classifyDirection as accountsClassifyDirection,
	formatSignedAmount as accountsFormatSignedAmount,
	computeActivitySummary,
} from "@/models/accounts";
import { classifyDirection, formatSignedAmount } from "@/models/amount";
import { computeUtilization, deriveColorScheme, formatBalance } from "@/models/card-showcase";
import { computeFlowSummary, deriveNetFlow } from "@/models/flow-comparison";
import { faqCount, filterFAQs } from "@/models/help";
import { ALL_TOAST_VARIANTS, toastVariantLabel } from "@/models/interaction-showcase";
import { computeTotalCalories, countActiveEvents, shiftDate } from "@/models/life-ai";
import {
	generatePixelHeatmap,
	HEATMAP_COLS,
	HEATMAP_MAX,
	HEATMAP_ROWS,
} from "@/models/pixel-heatmap";
import { computePortfolioTotal } from "@/models/portfolio";
import { computeProgressPercent, computeProgressSummary } from "@/models/progress-tracking";
import { classifyStatus } from "@/models/record-list";
import { changeToColorClass, classifyChange } from "@/models/stats-overview";
import {
	computeGoalPercent,
	computeMonthlyTarget,
	enrichGoal,
	isOnTrack,
} from "@/models/target-cards";

describe("amount & accounts models", () => {
	it("classifies direction and formats signed amounts", () => {
		expect(classifyDirection(100)).toBe("positive");
		expect(classifyDirection(-50)).toBe("negative");
		expect(classifyDirection(0)).toBe("negative");
		expect(formatSignedAmount(12.5)).toBe("+$12.50");
		expect(formatSignedAmount(-12.5)).toBe("$12.50");
		expect(accountsClassifyDirection(10)).toBe("positive");
		expect(accountsFormatSignedAmount(-3)).toBe("$3.00");
	});

	it("computes activity summary", () => {
		const summary = computeActivitySummary([
			{ desc: "Salary", amount: 5000, date: "2026-01-01" },
			{ desc: "Rent", amount: -1500, date: "2026-01-02" },
			{ desc: "Coffee", amount: -25, date: "2026-01-03" },
		]);
		expect(summary).toEqual({ totalIn: 5000, totalOut: 1525, net: 3475 });
	});
});

describe("card-showcase model", () => {
	it("computes utilization and guards zero limit", () => {
		expect(computeUtilization(500, 0)).toBe(0);
		expect(computeUtilization(250, 1000)).toBe(25);
	});

	it("derives color schemes for amex and visa", () => {
		expect(deriveColorScheme("amex").chipHighContrast).toBe(true);
		expect(deriveColorScheme("visa").chipHighContrast).toBe(false);
	});

	it("formats balance visibility", () => {
		expect(formatBalance(1234, true)).toBe("$1,234");
		expect(formatBalance(1234, false)).toBe("******");
	});
});

describe("flow-comparison model", () => {
	it("computes flow summary and derives net flow", () => {
		const data = [
			{ month: "Jan", inflow: 1000, outflow: 400 },
			{ month: "Feb", inflow: 800, outflow: 900 },
		];
		expect(computeFlowSummary(data)).toEqual({
			totalInflow: 1800,
			totalOutflow: 1300,
			netFlow: 500,
		});
		expect(deriveNetFlow(data)).toEqual([
			{ month: "Jan", inflow: 1000, outflow: 400, net: 600 },
			{ month: "Feb", inflow: 800, outflow: 900, net: -100 },
		]);
	});
});

describe("help model", () => {
	const faqs = [
		{ q: "How to connect?", a: "Run setup command." },
		{ q: "Where are logs?", a: "Under /var/log." },
	];

	it("filters FAQs by question or answer and returns all on blank query", () => {
		expect(filterFAQs(faqs, "   ")).toEqual(faqs);
		expect(filterFAQs(faqs, "SETUP")).toEqual([faqs[0]]);
		expect(filterFAQs(faqs, "logs")).toEqual([faqs[1]]);
		expect(faqCount(faqs)).toBe(2);
	});
});

describe("interaction-showcase model", () => {
	it("maps all toast variants to labels", () => {
		expect(ALL_TOAST_VARIANTS).toHaveLength(5);
		expect(toastVariantLabel("success")).toBe("Success");
		expect(toastVariantLabel("error")).toBe("Error");
	});
});

describe("life-ai model", () => {
	it("counts active events and extracts calories", () => {
		const events = [
			{ id: "1", time: "08:00", title: "Run", subtitle: "450 kcal burned", color: "#00FF41" },
			{ id: "2", time: "12:00", title: "Lunch", subtitle: "1,200 kcal" },
			{ id: "3", time: "15:00", title: "Break", subtitle: "Coffee" },
			{ id: "4", time: "18:00", title: "Rest" },
		];
		expect(countActiveEvents(events)).toBe(1);
		expect(computeTotalCalories(events)).toBe(1650);
	});

	it("shifts dates without mutating the input", () => {
		const base = new Date(2026, 0, 10);
		const next = shiftDate(base, 5);
		const prev = shiftDate(base, -3);
		expect(base.getDate()).toBe(10);
		expect(next.getDate()).toBe(15);
		expect(prev.getDate()).toBe(7);
	});
});

describe("pixel-heatmap model", () => {
	it("generates deterministic grid with bright 2026 glyphs and dim background", () => {
		const cells = generatePixelHeatmap(42);
		expect(cells).toHaveLength(HEATMAP_ROWS * HEATMAP_COLS);
		expect(HEATMAP_MAX).toBe(10);
		expect(cells.some((c) => c.value === 10)).toBe(true);
		expect(cells.every((c) => c.value === 10 || (c.value >= 0 && c.value <= 5))).toBe(true);
		expect(generatePixelHeatmap(42)).toEqual(cells);
	});
});

describe("portfolio, progress-tracking, record-list, stats-overview, target-cards models", () => {
	it("computes portfolio total", () => {
		expect(
			computePortfolioTotal([
				{ name: "BTC", value: 60, allocation: 60, change: "+5%", up: true },
				{ name: "ETH", value: 40, allocation: 40, change: "-2%", up: false },
			]),
		).toBe(100);
	});

	it("computes progress summary and percent", () => {
		expect(
			computeProgressSummary([
				{ category: "Food", spent: 300, limit: 500 },
				{ category: "Travel", spent: 200, limit: 300 },
			]),
		).toEqual({ totalSpent: 500, totalLimit: 800, remaining: 300 });
		expect(computeProgressPercent(50, 0)).toBe(0);
		expect(computeProgressPercent(25, 100)).toBe(25);
	});

	it("classifies transaction status", () => {
		expect(classifyStatus("Completed")).toBe("success");
		expect(classifyStatus("Pending")).toBe("warning");
	});

	it("classifies stat changes and color classes", () => {
		expect(classifyChange("+12%")).toBe("positive");
		expect(classifyChange("-5%")).toBe("negative");
		expect(classifyChange("0%")).toBe("neutral");
		expect(changeToColorClass("positive")).toBe("text-matrix-primary");
		expect(changeToColorClass("negative")).toBe("text-red-500");
		expect(changeToColorClass("neutral")).toBe("text-matrix-muted");
	});

	it("computes and enriches goal progress", () => {
		expect(computeGoalPercent(50, 0)).toBe(0);
		expect(computeMonthlyTarget(50, 100, 0)).toBe(0);
		expect(isOnTrack(50, 0)).toBe(false);
		expect(enrichGoal({ name: "Reserve", saved: 900, target: 1000, icon: "shield" })).toEqual({
			name: "Reserve",
			saved: 900,
			target: 1000,
			icon: "shield",
			percent: 90,
			monthlyTarget: 17,
			onTrack: true,
		});
	});
});
