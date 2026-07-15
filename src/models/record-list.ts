// Pure business logic for the Record List page.
// No React dependency — fully testable with plain unit tests.

import type { Transaction } from "@/models/types";

export type { AmountDirection } from "@/models/amount";
export { classifyDirection, formatSignedAmount } from "@/models/amount";

export type StatusVariant = "success" | "warning";

export function classifyStatus(status: Transaction["status"]): StatusVariant {
	return status === "Completed" ? "success" : "warning";
}
