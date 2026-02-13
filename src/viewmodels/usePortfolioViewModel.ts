// ViewModel for the Portfolio page.
// Composes model logic with data source — View consumes this hook only.

import { useMemo } from "react";
import { portfolio, performanceData } from "@/data/mock";
import { computePortfolioTotal } from "@/models/portfolio";

export function usePortfolioViewModel() {
  const totalValue = useMemo(() => computePortfolioTotal(portfolio), []);

  return { totalValue, holdings: portfolio, performanceData };
}
