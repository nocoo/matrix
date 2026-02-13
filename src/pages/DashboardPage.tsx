import { AsciiBox } from "@/components/ui/AsciiBox";
import { Sparkline } from "@/components/ui/MatrixExtras";
import { useAccountsViewModel } from "@/viewmodels/useAccountsViewModel";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { accountList, activityList, activitySummary } = useAccountsViewModel();

  return (
    <div className="space-y-4">
      {/* Welcome banner */}
      <AsciiBox title="SYSTEM STATUS">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-sm text-matrix-primary">
            &gt; welcome back, operator
          </p>
          <p className="font-mono text-xs text-matrix-muted">
            all systems nominal. {accountList.length} accounts active.
          </p>
        </div>
      </AsciiBox>

      {/* Account cards */}
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
                    account.change.startsWith("+") ? "text-matrix-primary" : "text-red-500"
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

      {/* Activity summary */}
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
                    item.direction === "positive" ? "text-matrix-primary" : "text-red-400"
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
                  activitySummary.net >= 0 ? "text-matrix-primary" : "text-red-400"
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
