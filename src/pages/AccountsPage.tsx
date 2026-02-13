import { AsciiBox } from "@/components/ui/AsciiBox";
import { DataRow, Sparkline } from "@/components/ui/MatrixExtras";
import { useAccountsViewModel } from "@/viewmodels/useAccountsViewModel";
import { cn } from "@/lib/utils";

export default function AccountsPage() {
  const { accountList, activityList, activitySummary } = useAccountsViewModel();

  return (
    <div className="space-y-4">
      {/* Total balance */}
      <AsciiBox title="TOTAL BALANCE">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-2xl text-matrix-primary glow-text">
              ${accountList.reduce((s, a) => s + a.balance, 0).toLocaleString()}
            </p>
            <p className="font-mono text-xs text-matrix-dim mt-1">
              across {accountList.length} accounts
            </p>
          </div>
          <Sparkline
            data={[40, 55, 45, 65, 50, 70, 60, 75]}
            width={120}
            height={36}
            color="var(--matrix-ink)"
          />
        </div>
      </AsciiBox>

      {/* Individual accounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {accountList.map((account) => (
          <AsciiBox key={account.name} title={account.name.toUpperCase()}>
            <div className="space-y-3">
              <p className="font-mono text-xl text-matrix-primary">
                ${account.balance.toLocaleString()}
              </p>
              <DataRow
                label="Change"
                value={account.change}
              />
            </div>
          </AsciiBox>
        ))}
      </div>

      {/* Recent activity */}
      <AsciiBox title="RECENT ACTIVITY">
        <div className="space-y-1">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-matrix-dim border-b border-matrix-primary/10 pb-1 mb-1">
            <span>description</span>
            <div className="flex gap-8">
              <span>date</span>
              <span>amount</span>
            </div>
          </div>
          {activityList.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between font-mono text-xs py-1 border-b border-matrix-primary/5 last:border-0"
            >
              <span className="text-matrix-muted">{item.desc}</span>
              <div className="flex items-center gap-6">
                <span className="text-matrix-dim text-[11px]">{item.date}</span>
                <span
                  className={cn(
                    "w-20 text-right",
                    item.direction === "positive" ? "text-matrix-primary" : "text-red-400"
                  )}
                >
                  {item.formattedAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AsciiBox>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <AsciiBox title="INFLOW">
          <p className="font-mono text-lg text-matrix-primary text-center">
            ${activitySummary.totalIn.toFixed(2)}
          </p>
        </AsciiBox>
        <AsciiBox title="OUTFLOW">
          <p className="font-mono text-lg text-red-400 text-center">
            ${activitySummary.totalOut.toFixed(2)}
          </p>
        </AsciiBox>
        <AsciiBox title="NET">
          <p className={cn(
            "font-mono text-lg text-center",
            activitySummary.net >= 0 ? "text-matrix-primary" : "text-red-400"
          )}>
            ${activitySummary.net.toFixed(2)}
          </p>
        </AsciiBox>
      </div>
    </div>
  );
}
