import { AsciiBox } from "@/components/ui/AsciiBox";
import { TrendMonitor } from "@/components/ui/DataVizComponents";
import { usePortfolioViewModel } from "@/viewmodels/usePortfolioViewModel";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  const { totalValue, holdings, performanceData } = usePortfolioViewModel();

  return (
    <div className="space-y-4">
      {/* Total */}
      <AsciiBox title="PORTFOLIO VALUE">
        <p className="font-mono text-2xl text-matrix-primary glow-text text-center">
          ${totalValue.toLocaleString()}
        </p>
      </AsciiBox>

      {/* Performance chart */}
      <AsciiBox title="12-MONTH PERFORMANCE">
        <TrendMonitor
          data={performanceData.map((d) => d.value)}
          label={performanceData.map((d) => d.month).join(", ")}
          color="var(--matrix-ink)"
        />
      </AsciiBox>

      {/* Holdings */}
      <AsciiBox title="HOLDINGS">
        <div className="space-y-0">
          <div className="grid grid-cols-12 gap-2 font-mono text-[10px] uppercase text-matrix-dim border-b border-matrix-primary/15 pb-1.5 mb-1">
            <span className="col-span-3">asset</span>
            <span className="col-span-3 text-right">value</span>
            <span className="col-span-2 text-right">alloc</span>
            <span className="col-span-2 text-right">change</span>
            <span className="col-span-2 text-right">bar</span>
          </div>
          {holdings.map((h) => (
            <div
              key={h.name}
              className="grid grid-cols-12 gap-2 font-mono text-xs py-1.5 border-b border-matrix-primary/5 last:border-0"
            >
              <span className="col-span-3 text-matrix-muted">{h.name}</span>
              <span className="col-span-3 text-right text-matrix-primary">
                ${h.value.toLocaleString()}
              </span>
              <span className="col-span-2 text-right text-matrix-dim">
                {h.allocation}%
              </span>
              <span
                className={cn(
                  "col-span-2 text-right",
                  h.up ? "text-matrix-primary" : "text-red-400"
                )}
              >
                {h.change}
              </span>
              <span className="col-span-2 flex items-center justify-end">
                <div className="w-full h-2 bg-matrix-primary/10 overflow-hidden">
                  <div
                    className="h-full bg-matrix-primary"
                    style={{ width: `${h.allocation}%` }}
                  />
                </div>
              </span>
            </div>
          ))}
        </div>
      </AsciiBox>
    </div>
  );
}
