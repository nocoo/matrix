// Pure business logic for the Portfolio page.
// No React dependency — fully testable with plain unit tests.

import type { PortfolioItem } from "@/models/types";

export function computePortfolioTotal(items: PortfolioItem[]): number {
  return items.reduce((sum, item) => sum + item.value, 0);
}
