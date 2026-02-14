import { AsciiBox } from "@/components/ui/AsciiBox";
import { MatrixButton } from "@/components/ui/MatrixButton";
import { TrendMonitor, TrendChart } from "@/components/ui/DataVizComponents";
import { Sparkline } from "@/components/ui/MatrixExtras";
import { useLifeAiViewModel } from "@/viewmodels/useLifeAiViewModel";
import { cn } from "@/lib/utils";

export default function LifeAiPage() {
  const {
    selectedDate,
    stats,
    timeline,
    heatmapData,
    weeklySteps,
    monthlySleep,
    activityBreakdown,
    activeEventCount,
    totalCalories,
    goToPrevDay,
    goToNextDay,
    goToToday,
  } = useLifeAiViewModel();

  const dateStr = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Date navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MatrixButton size="small" onClick={goToPrevDay}>[&lt;]</MatrixButton>
          <span className="font-mono text-sm text-matrix-primary">{dateStr}</span>
          <MatrixButton size="small" onClick={goToNextDay}>[&gt;]</MatrixButton>
        </div>
        <MatrixButton size="small" variant="ghost" onClick={goToToday}>
          [TODAY]
        </MatrixButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <AsciiBox key={stat.title} title={stat.title.toUpperCase()}>
            <div className="text-center space-y-1">
              <p className="font-mono text-xl text-matrix-primary">{stat.value}</p>
              {stat.subtitle && (
                <p className="font-mono text-[10px] text-matrix-dim">{stat.subtitle}</p>
              )}
              {stat.trend && (
                <p className={cn(
                  "font-mono text-xs",
                  stat.trend.value > 0 ? "text-matrix-primary" :
                  stat.trend.value < 0 ? "text-red-400" : "text-matrix-muted"
                )}>
                  {stat.trend.value > 0 ? "+" : ""}{stat.trend.value}% {stat.trend.label}
                </p>
              )}
            </div>
          </AsciiBox>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <AsciiBox title="ACTIVE EVENTS">
          <p className="font-mono text-lg text-matrix-primary text-center">
            {activeEventCount}
          </p>
        </AsciiBox>
        <AsciiBox title="TOTAL CALORIES">
          <p className="font-mono text-lg text-matrix-primary text-center">
            {totalCalories} kcal
          </p>
        </AsciiBox>
      </div>

      {/* Timeline */}
      <AsciiBox title="DAILY TIMELINE">
        <div className="space-y-1">
          {timeline.map((event) => (
            <div key={event.id} className="flex items-start gap-3 font-mono text-xs py-1">
              <span className="text-matrix-dim w-12 shrink-0">{event.time}</span>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full mt-1 shrink-0",
                event.color ?? "bg-matrix-dim"
              )} />
              <div className="min-w-0">
                <span className="text-matrix-muted">{event.title}</span>
                {event.subtitle && (
                  <span className="text-matrix-dim ml-2">{event.subtitle}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </AsciiBox>

      {/* Activity heatmap */}
      <AsciiBox title="ACTIVITY HEATMAP (2026)">
        <div className="flex flex-wrap gap-[2px]">
          {heatmapData.map((d) => (
            <div
              key={d.date}
              className="w-2 h-2 "
              style={{
                backgroundColor: d.value > 0
                  ? `rgba(0, 255, 65, ${Math.min(d.value / 10, 1)})`
                  : "rgba(0, 255, 65, 0.05)",
              }}
              title={`${d.date}: ${d.value}`}
            />
          ))}
        </div>
      </AsciiBox>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AsciiBox title="WEEKLY STEPS">
          <TrendMonitor
            data={weeklySteps.map((d) => d.value)}
            label={weeklySteps.map((d) => d.label).join(", ")}
            color="var(--matrix-ink)"
          />
        </AsciiBox>

        <AsciiBox title="MONTHLY SLEEP (HOURS)">
          <TrendChart
            data={monthlySleep.map((d) => d.value)}
            unitLabel="hrs"
            leftLabel="JAN"
            rightLabel="DEC"
          />
        </AsciiBox>
      </div>

      {/* Activity breakdown */}
      <AsciiBox title="ACTIVITY BREAKDOWN">
        <div className="space-y-2">
          {activityBreakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-3 font-mono text-xs">
              <span className="w-16 text-matrix-muted">{item.label}</span>
              <div className="flex-1 h-3 bg-matrix-primary/10 overflow-hidden">
                <div
                  className="h-full bg-matrix-primary"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="text-matrix-dim w-8 text-right">{item.value}%</span>
              <Sparkline
                data={Array.from({ length: 7 }, () => Math.random() * item.value)}
                width={60}
                height={16}
                color="var(--matrix-ink)"
              />
            </div>
          ))}
        </div>
      </AsciiBox>
    </div>
  );
}
