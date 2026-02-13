import { AsciiBox } from "@/components/ui/AsciiBox";
import { useProgressTrackingViewModel } from "@/viewmodels/useProgressTrackingViewModel";
import { TrendMonitor } from "@/components/ui/DataVizComponents";
import { cn } from "@/lib/utils";

export default function ProgressTrackingPage() {
  const { summary, categories, comparisonData } = useProgressTrackingViewModel();

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <AsciiBox title="TOTAL SPENT">
          <p className="font-mono text-lg text-matrix-primary text-center">
            ${summary.totalSpent.toLocaleString()}
          </p>
        </AsciiBox>
        <AsciiBox title="TOTAL LIMIT">
          <p className="font-mono text-lg text-matrix-muted text-center">
            ${summary.totalLimit.toLocaleString()}
          </p>
        </AsciiBox>
        <AsciiBox title="REMAINING">
          <p className={cn(
            "font-mono text-lg text-center",
            summary.remaining >= 0 ? "text-matrix-primary" : "text-red-400"
          )}>
            ${summary.remaining.toLocaleString()}
          </p>
        </AsciiBox>
      </div>

      {/* Category progress */}
      <AsciiBox title="BUDGET CATEGORIES">
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between font-mono text-xs mb-1">
                <span className="text-matrix-muted">{cat.category}</span>
                <span className="text-matrix-dim">
                  ${cat.spent} / ${cat.limit}
                </span>
              </div>
              <div className="h-2 w-full bg-matrix-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(cat.progress, 100)}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <p className="font-mono text-[10px] text-matrix-dim mt-0.5 text-right">
                {cat.progress.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </AsciiBox>

      {/* Monthly comparison chart */}
      <AsciiBox title="BUDGET VS ACTUAL">
        <TrendMonitor
          data={comparisonData.map((d) => d.actual)}
          labels={comparisonData.map((d) => d.month)}
          height={160}
          color="var(--matrix-ink)"
        />
      </AsciiBox>
    </div>
  );
}
