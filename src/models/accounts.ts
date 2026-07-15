// Pure business logic for the Accounts page.
// No React dependency — fully testable with plain unit tests.

import type { ActivityItem } from "@/models/types";

export type { AmountDirection } from "@/models/amount";
export { classifyDirection, formatSignedAmount } from "@/models/amount";

export function computeActivitySummary(items: ActivityItem[]) {
	const totalIn = items.filter((i) => i.amount > 0).reduce((s, i) => s + i.amount, 0);
	const totalOut = items.filter((i) => i.amount < 0).reduce((s, i) => s + Math.abs(i.amount), 0);
	return { totalIn, totalOut, net: totalIn - totalOut };
}
