// ViewModel for the Life.ai demo page.
// Composes model logic with data source — View consumes this hook only.

import { useCallback, useMemo, useState } from "react";
import {
	lifeAiActivityBreakdown,
	lifeAiHeartRateSlots,
	lifeAiHeatmapData,
	lifeAiMonthlySleep,
	lifeAiSleepSlots,
	lifeAiStats,
	lifeAiTimeline,
	lifeAiWeeklySteps,
} from "@/data/mock";
import { computeTotalCalories, countActiveEvents, shiftDate } from "@/models/life-ai";

export function useLifeAiViewModel() {
	const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 1, 13)); // Feb 13, 2026

	const stats = lifeAiStats;
	const timeline = lifeAiTimeline;
	const heatmapData = lifeAiHeatmapData;
	const weeklySteps = lifeAiWeeklySteps;
	const monthlySleep = lifeAiMonthlySleep;
	const activityBreakdown = lifeAiActivityBreakdown;
	const sleepSlots = lifeAiSleepSlots;
	const heartRateSlots = lifeAiHeartRateSlots;

	const activeEventCount = useMemo(() => countActiveEvents(timeline), []);
	const totalCalories = useMemo(() => computeTotalCalories(timeline), []);

	const goToPrevDay = useCallback(() => setSelectedDate((d) => shiftDate(d, -1)), []);
	const goToNextDay = useCallback(() => setSelectedDate((d) => shiftDate(d, 1)), []);
	const goToToday = useCallback(() => setSelectedDate(new Date()), []);

	return {
		selectedDate,
		stats,
		timeline,
		heatmapData,
		weeklySteps,
		monthlySleep,
		activityBreakdown,
		sleepSlots,
		heartRateSlots,
		activeEventCount,
		totalCalories,
		goToPrevDay,
		goToNextDay,
		goToToday,
	};
}
