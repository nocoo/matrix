// Pure business logic for the Flow Comparison page.
// No React dependency — fully testable with plain unit tests.

export interface FlowEntry {
  month: string;
  inflow: number;
  outflow: number;
}

export interface FlowSummary {
  totalInflow: number;
  totalOutflow: number;
  netFlow: number;
}

export function computeFlowSummary(data: FlowEntry[]): FlowSummary {
  const totalInflow = data.reduce((s, d) => s + d.inflow, 0);
  const totalOutflow = data.reduce((s, d) => s + d.outflow, 0);
  return { totalInflow, totalOutflow, netFlow: totalInflow - totalOutflow };
}

export interface NetFlowEntry extends FlowEntry {
  net: number;
}

export function deriveNetFlow(data: FlowEntry[]): NetFlowEntry[] {
  return data.map((d) => ({ ...d, net: d.inflow - d.outflow }));
}
