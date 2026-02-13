// ViewModel for the Stats Overview page.
// Composes model logic with data source — View consumes this hook only.

import { useMemo } from "react";
import {
  analyticsWeekly,
  analyticsCategories,
  analyticsTrend,
  analyticsStats,
} from "@/data/mock";
import { classifyChange, changeToColorClass } from "@/models/stats-overview";

export interface StatCard {
  label: string;
  value: string;
  change: string;
  changeColorClass: string;
}

export function useStatsOverviewViewModel() {
  const stats: StatCard[] = useMemo(
    () =>
      analyticsStats.map((s) => ({
        ...s,
        changeColorClass: changeToColorClass(classifyChange(s.change)),
      })),
    [],
  );

  return {
    stats,
    weeklyData: analyticsWeekly,
    categoryData: analyticsCategories,
    trendData: analyticsTrend,
  };
}
