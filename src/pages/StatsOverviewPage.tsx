import { AsciiBox } from "@/components/ui/AsciiBox";
import { TrendMonitor } from "@/components/ui/DataVizComponents";
import { useStatsOverviewViewModel } from "@/viewmodels/useStatsOverviewViewModel";
import { cn } from "@/lib/utils";

export default function StatsOverviewPage() {
  const { stats, weeklyData, categoryData, trendData } = useStatsOverviewViewModel();

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <AsciiBox key={stat.label} title={stat.label.toUpperCase()}>
            <div className="text-center space-y-1">
              <p className="font-mono text-xl text-matrix-primary">{stat.value}</p>
              <p className={cn("font-mono text-xs", stat.changeColorClass)}>
                {stat.change}
              </p>
            </div>
          </AsciiBox>
        ))}
      </div>

      {/* 30-day trend */}
      <AsciiBox title="30-DAY TREND">
        <TrendMonitor
          data={trendData.map((d) => d.value)}
          label={trendData.map((d) => `${d.day}`).join(", ")}
          color="var(--matrix-ink)"
        />
      </AsciiBox>

      {/* Weekly income vs expense */}
      <AsciiBox title="WEEKLY INCOME VS EXPENSE">
        <div className="space-y-2">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex items-center gap-3 font-mono text-xs">
              <span className="w-8 text-matrix-dim">{d.day}</span>
              <div className="flex-1 flex gap-1 h-4">
                <div
                  className="bg-matrix-primary/60"
                  style={{ width: `${(d.income / 2000) * 100}%` }}
                  title={`Income: $${d.income}`}
                />
                <div
                  className="bg-red-500/40"
                  style={{ width: `${(d.expense / 2000) * 100}%` }}
                  title={`Expense: $${d.expense}`}
                />
              </div>
              <span className="text-matrix-primary w-12 text-right">${d.income}</span>
              <span className="text-red-400 w-12 text-right">${d.expense}</span>
            </div>
          ))}
        </div>
      </AsciiBox>

      {/* Category breakdown */}
      <AsciiBox title="SPENDING BY CATEGORY">
        <div className="space-y-2">
          {categoryData.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3 font-mono text-xs">
              <span className="w-20 text-matrix-muted">{cat.name}</span>
              <div className="flex-1 h-3 bg-matrix-primary/10 overflow-hidden">
                <div
                  className="h-full bg-matrix-primary"
                  style={{ width: `${cat.value}%` }}
                />
              </div>
              <span className="text-matrix-dim w-8 text-right">{cat.value}%</span>
            </div>
          ))}
        </div>
      </AsciiBox>
    </div>
  );
}
