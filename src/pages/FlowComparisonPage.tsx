import { AsciiBox } from "@/components/ui/AsciiBox";
import { TrendMonitor } from "@/components/ui/DataVizComponents";
import { useFlowComparisonViewModel } from "@/viewmodels/useFlowComparisonViewModel";

export default function FlowComparisonPage() {
  const { summary, flowData, netFlowData } = useFlowComparisonViewModel();

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <AsciiBox title="TOTAL INFLOW">
          <p className="font-mono text-lg text-matrix-primary text-center">
            ${summary.totalInflow.toLocaleString()}
          </p>
        </AsciiBox>
        <AsciiBox title="TOTAL OUTFLOW">
          <p className="font-mono text-lg text-red-400 text-center">
            ${summary.totalOutflow.toLocaleString()}
          </p>
        </AsciiBox>
        <AsciiBox title="NET FLOW">
          <p className="font-mono text-lg text-matrix-primary text-center glow-text">
            ${summary.netFlow.toLocaleString()}
          </p>
        </AsciiBox>
      </div>

      {/* Flow chart */}
      <AsciiBox title="MONTHLY CASH FLOW">
        <TrendMonitor
          data={flowData.map((d) => d.inflow)}
          labels={flowData.map((d) => d.month)}
          height={160}
          color="var(--matrix-ink)"
        />
      </AsciiBox>

      {/* Net flow table */}
      <AsciiBox title="NET FLOW BREAKDOWN">
        <div className="space-y-0">
          <div className="grid grid-cols-4 gap-2 font-mono text-[10px] uppercase text-matrix-dim border-b border-matrix-primary/15 pb-1.5 mb-1">
            <span>month</span>
            <span className="text-right">inflow</span>
            <span className="text-right">outflow</span>
            <span className="text-right">net</span>
          </div>
          {netFlowData.map((d) => (
            <div
              key={d.month}
              className="grid grid-cols-4 gap-2 font-mono text-xs py-1.5 border-b border-matrix-primary/5 last:border-0"
            >
              <span className="text-matrix-muted">{d.month}</span>
              <span className="text-right text-matrix-primary">
                ${d.inflow.toLocaleString()}
              </span>
              <span className="text-right text-red-400">
                ${d.outflow.toLocaleString()}
              </span>
              <span className="text-right text-matrix-primary">
                ${d.net.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </AsciiBox>
    </div>
  );
}
