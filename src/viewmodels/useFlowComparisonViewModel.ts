// ViewModel for the Flow Comparison page.
// Composes model logic with data source — View consumes this hook only.

import { useMemo } from "react";
import { monthlyFlow } from "@/data/mock";
import type { FlowSummary, NetFlowEntry } from "@/models/flow-comparison";
import { computeFlowSummary, deriveNetFlow } from "@/models/flow-comparison";

export function useFlowComparisonViewModel() {
	const summary: FlowSummary = useMemo(() => computeFlowSummary(monthlyFlow), []);
	const netFlowData: NetFlowEntry[] = useMemo(() => deriveNetFlow(monthlyFlow), []);

	return { summary, flowData: monthlyFlow, netFlowData };
}
