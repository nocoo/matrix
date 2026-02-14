import { AsciiBox } from "@/components/ui/AsciiBox";
import {
  Sparkline,
  TypewriterText,
  ConnectionStatus,
} from "@/components/ui/MatrixExtras";
import { TrendMonitor } from "@/components/ui/DataVizComponents";
import { MatrixClock } from "@/components/ui/RunnerComponents";
import { IdentityCard } from "@/components/ui/VibeComponents";
import { useDashboardViewModel } from "@/viewmodels/useDashboardViewModel";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, string> = {
  shield: "[#]",
  plane: "[>]",
  car: "[=]",
  home: "[^]",
};

/** Map a heatmap value (0-10) to a matrix green color. */
function heatmapColor(value: number, max: number): string {
  if (value >= max) return "rgba(0,255,65,1)";
  if (value === 0) return "rgba(0,255,65,0.06)";
  const t = value / max;
  const opacity = 0.08 + t * 0.35; // 0.08 – 0.43 for background range
  return `rgba(0,255,65,${opacity})`;
}

export default function DashboardPage() {
  const {
    accountList,
    activityList,
    activitySummary,
    goals,
    budgetRows,
    trendData,
    flowData,
    portfolioRows,
    totalPortfolioValue,
    pixelHeatmap,
    pixelHeatmapRows,
    pixelHeatmapCols,
    pixelHeatmapMax,
    signalRows,
  } = useDashboardViewModel();

  return (
    <div className="space-y-3">
      {/* Row 1: Status + Clock + Identity + Signal — 4-col on xl */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <AsciiBox title="SYSTEM STATUS">
          <div className="flex flex-col gap-2">
            <TypewriterText
              text="> welcome back, operator"
              className="font-mono text-sm text-matrix-primary"
              speedMs={30}
            />
            <div className="flex items-center gap-3">
              <ConnectionStatus status="STABLE" />
              <span className="font-mono text-xs text-matrix-muted">
                {`${accountList.length} accounts active \u00B7 ${goals.length} targets tracked`}
              </span>
            </div>
          </div>
        </AsciiBox>

        <AsciiBox title="CHRONOMETER">
          <div className="flex items-center justify-center py-2">
            <MatrixClock label="SYSTEM TIME" />
          </div>
        </AsciiBox>

        <IdentityCard
          name="OPERATOR"
          isPublic
          title="IDENTITY"
          subtitle="// clearance level: root"
          rankLabel="S+"
          streakDays={128}
          showStats
          animateTitle
          scanlines
          avatarSize={64}
        />

        <AsciiBox title="SIGNAL MONITOR">
          <div className="flex flex-col gap-2">
            {signalRows.map((sig) => (
              <div key={sig.label} className="flex items-center justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[10px] text-matrix-dim uppercase">{sig.label}</span>
                  <span
                    className={cn(
                      "font-mono text-sm font-bold",
                      sig.status === "critical" ? "text-red-400" :
                      sig.status === "warning" ? "text-yellow-400" :
                      "text-matrix-primary",
                    )}
                  >
                    {sig.value}
                  </span>
                </div>
                <Sparkline
                  data={sig.trend}
                  width={64}
                  height={20}
                  color={
                    sig.status === "critical" ? "#f87171" :
                    sig.status === "warning" ? "#facc15" :
                    "#00FF41"
                  }
                />
              </div>
            ))}
          </div>
        </AsciiBox>
      </div>

      {/* Row 2: Heatmap full-width */}
      <AsciiBox title="DATA VISUALIZATION">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-matrix-dim uppercase">contribution density</span>
            <span className="text-matrix-muted">// pixel render: 2026</span>
          </div>
          <div
            className="flex justify-center"
          >
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${pixelHeatmapCols}, 10px)`,
                gridTemplateRows: `repeat(${pixelHeatmapRows}, 10px)`,
                gap: "2px",
              }}
              data-testid="pixel-heatmap"
            >
              {pixelHeatmap.map((cell) => (
                <span
                  key={`${cell.row}-${cell.col}`}
                  className="border border-matrix-ghost/30"
                  style={{
                    width: 10,
                    height: 10,
                    background: heatmapColor(cell.value, pixelHeatmapMax),
                    boxShadow:
                      cell.value >= pixelHeatmapMax
                        ? "0 0 4px rgba(0,255,65,0.6)"
                        : "none",
                  }}
                  title={`[${cell.row},${cell.col}] = ${cell.value}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-matrix-muted">
            <span>less</span>
            <div className="flex gap-0.5">
              {[0, 2, 4, 6, 8, 10].map((v) => (
                <span
                  key={v}
                  className="border border-matrix-ghost/30"
                  style={{
                    width: 10,
                    height: 10,
                    background: heatmapColor(v, pixelHeatmapMax),
                  }}
                />
              ))}
            </div>
            <span>more</span>
          </div>
        </div>
      </AsciiBox>

      {/* Row 3: Target goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {goals.map((goal) => (
          <AsciiBox key={goal.name} title={goal.name.toUpperCase()}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg text-matrix-primary">
                  {ICON_MAP[goal.icon] ?? "[?]"}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase px-2 py-0.5 flex items-center gap-1",
                    goal.onTrack
                      ? "bg-matrix-primary/10 text-matrix-primary"
                      : "bg-yellow-500/10 text-yellow-500",
                  )}
                >
                  <ConnectionStatus
                    status={goal.onTrack ? "STABLE" : "UNSTABLE"}
                  />
                  {goal.onTrack ? "on track" : "behind"}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="text-matrix-muted">
                    ${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()}
                  </span>
                  <span className="text-matrix-primary">{goal.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-matrix-primary/10 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      goal.onTrack ? "bg-matrix-primary" : "bg-yellow-500",
                    )}
                    style={{ width: `${goal.percent}%` }}
                  />
                </div>
              </div>
              <div className="font-mono text-[10px] text-matrix-dim">
                need ${goal.monthlyTarget.toLocaleString()}/month
              </div>
            </div>
          </AsciiBox>
        ))}
      </div>

      {/* Row 4: Accounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accountList.map((account) => (
          <AsciiBox key={account.name} title={account.name.toUpperCase()}>
            <div className="space-y-2">
              <p className="font-mono text-xl text-matrix-primary glow-text">
                ${account.balance.toLocaleString()}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "font-mono text-xs",
                    account.change.startsWith("+") ? "text-matrix-primary" : "text-red-500",
                  )}
                >
                  {account.change}
                </span>
                <Sparkline
                  data={[30, 45, 35, 55, 40, 60, 50]}
                  width={80}
                  height={24}
                  color="var(--matrix-ink)"
                />
              </div>
            </div>
          </AsciiBox>
        ))}
      </div>

      {/* Row 5: Budget + Trend side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AsciiBox title="BUDGET TRACKER">
          <div className="space-y-3">
          {budgetRows.map((budget) => (
            <div key={budget.category} className="space-y-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-matrix-muted uppercase">{budget.category}</span>
                <span
                  className={cn(
                    budget.overBudget ? "text-red-400" : "text-matrix-primary",
                  )}
                >
                  ${budget.spent} / ${budget.limit}
                </span>
              </div>
              <div className="h-1.5 w-full bg-matrix-primary/10 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    budget.overBudget ? "bg-red-400" : "bg-matrix-primary",
                  )}
                  style={{ width: `${Math.min(budget.percent, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        </AsciiBox>

        <TrendMonitor
          data={trendData}
          label="30-DAY TREND"
          color="#00FF41"
        />
      </div>

      {/* Row 6: Portfolio + Cash flow side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Portfolio allocation */}
        <AsciiBox title="PORTFOLIO">
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs border-b border-matrix-ghost pb-2">
              <span className="text-matrix-dim uppercase">Total value</span>
              <span className="text-matrix-bright font-bold glow-text">
                ${totalPortfolioValue.toLocaleString()}
              </span>
            </div>
            {portfolioRows.map((asset) => (
              <div key={asset.name} className="space-y-1">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-matrix-muted uppercase">{asset.name}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-[10px]",
                        asset.up ? "text-matrix-primary" : "text-red-400",
                      )}
                    >
                      {asset.change}
                    </span>
                    <span className="text-matrix-dim">{asset.allocation}%</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-matrix-primary/10 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      asset.up ? "bg-matrix-primary" : "bg-red-400",
                    )}
                    style={{ width: `${asset.allocation}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AsciiBox>

        {/* Cash flow */}
        <AsciiBox title="CASH FLOW">
          <div className="space-y-2">
            {flowData.map((flow) => {
              const maxVal = Math.max(
                ...flowData.map((f) => Math.max(f.inflow, f.outflow)),
              );
              return (
                <div key={flow.month} className="space-y-0.5">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-matrix-dim uppercase w-8">{flow.month}</span>
                    <span
                      className={cn(
                        flow.net >= 0 ? "text-matrix-primary" : "text-red-400",
                      )}
                    >
                      {flow.net >= 0 ? "+" : ""}${flow.net.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5">
                    <div className="flex-1 bg-matrix-primary/10 overflow-hidden">
                      <div
                        className="h-full bg-matrix-primary/60"
                        style={{ width: `${(flow.inflow / maxVal) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-red-400/10 overflow-hidden">
                      <div
                        className="h-full bg-red-400/60"
                        style={{ width: `${(flow.outflow / maxVal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 font-mono text-[10px] text-matrix-dim pt-1 border-t border-matrix-ghost">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-matrix-primary/60" /> inflow
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-400/60" /> outflow
              </span>
            </div>
          </div>
        </AsciiBox>
      </div>

      {/* Activity log + Flow summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AsciiBox title="ACTIVITY LOG">
          <div className="space-y-1.5">
            {activityList.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between font-mono text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-matrix-dim">{item.date}</span>
                  <span className="text-matrix-muted truncate">{item.desc}</span>
                </div>
                <span
                  className={cn(
                    "shrink-0 ml-2",
                    item.direction === "positive" ? "text-matrix-primary" : "text-red-400",
                  )}
                >
                  {item.formattedAmount}
                </span>
              </div>
            ))}
          </div>
        </AsciiBox>

        <AsciiBox title="FLOW SUMMARY">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase text-matrix-dim">inflow</p>
              <p className="font-mono text-lg text-matrix-primary">
                ${activitySummary.totalIn.toFixed(0)}
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase text-matrix-dim">outflow</p>
              <p className="font-mono text-lg text-red-400">
                ${activitySummary.totalOut.toFixed(0)}
              </p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase text-matrix-dim">net</p>
              <p
                className={cn(
                  "font-mono text-lg",
                  activitySummary.net >= 0 ? "text-matrix-primary" : "text-red-400",
                )}
              >
                ${Math.abs(activitySummary.net).toFixed(0)}
              </p>
            </div>
          </div>
        </AsciiBox>
      </div>
    </div>
  );
}
