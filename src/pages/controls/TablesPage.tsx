// ============================================
// Tables Page — Data tables with control density
// Matrix cyberpunk style replica of Basalt's TablesPage.
// ============================================

import { AsciiBox, MatrixButton, MatrixInput } from "@/components/ui";
import { useControlsViewModel } from "@/viewmodels/useControlsViewModel";
import { cn } from "@/lib/utils";

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`matrix-panel rounded p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4 border-b border-matrix-primary/15 pb-2">
        <span className="w-1.5 h-1.5 bg-matrix-primary" />
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-matrix-primary">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

const STATUS_STYLES = {
  paid: "bg-green-500/15 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  overdue: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function TablesPage() {
  const vm = useControlsViewModel();

  return (
    <div className="space-y-4">
      <AsciiBox
        title="TABLES"
        subtitle="data control"
        headerRight={
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="search..."
                className="h-7 w-36 bg-matrix-panel border border-matrix-ghost px-2 text-[10px] font-mono text-matrix-primary placeholder:text-matrix-dim outline-none focus:border-matrix-primary/40"
              />
              <span className="absolute right-2 top-1.5 text-matrix-dim text-[10px]">⌕</span>
            </div>
            <MatrixButton size="small">FILTER</MatrixButton>
            <MatrixButton size="small">COLUMNS</MatrixButton>
          </div>
        }
      >
        <p className="text-xs font-mono text-matrix-muted">
          Data tables with real control density. Sortable columns, status indicators, and actions.
        </p>
      </AsciiBox>

      {/* ── Invoice Table ────────────────────── */}
      <Section title="INVOICE TABLE">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-matrix-primary/20">
                {["INVOICE", "CUSTOMER", "STATUS", "AMOUNT", "DATE"].map((col) => (
                  <th
                    key={col}
                    className="text-left text-[10px] font-mono font-bold uppercase text-matrix-dim px-3 py-2 tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vm.invoices.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-matrix-ghost hover:bg-matrix-primary/5 transition-colors cursor-pointer"
                >
                  <td className="px-3 py-2.5 text-xs font-mono text-matrix-primary font-bold">
                    {row.id}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-mono text-matrix-muted">
                    {row.customer}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-mono font-bold uppercase border",
                      STATUS_STYLES[row.status]
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs font-mono text-matrix-bright font-bold text-right">
                    {row.amount}
                  </td>
                  <td className="px-3 py-2.5 text-xs font-mono text-matrix-dim">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Recent Transfers ─────────────────── */}
      <Section title="RECENT TRANSFERS">
        <div className="space-y-0">
          {vm.transfers.map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-between py-3 px-2 border-b border-matrix-ghost last:border-b-0 hover:bg-matrix-primary/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center text-xs font-mono font-bold border",
                  t.direction === "out"
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-green-500/10 border-green-500/30 text-green-400"
                )}>
                  {t.direction === "out" ? "↗" : "↙"}
                </div>
                <div>
                  <p className="text-xs font-mono text-matrix-bright font-bold">{t.label}</p>
                  <p className="text-[10px] font-mono text-matrix-dim">{t.type}</p>
                </div>
              </div>
              <span className={cn(
                "text-sm font-mono font-bold",
                t.direction === "out" ? "text-red-400" : "text-green-400"
              )}>
                {t.direction === "out" ? "-" : "+"}{t.amount}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Table Footer ─────────────────────── */}
      <Section title="TABLE FOOTER">
        <p className="text-xs font-mono text-matrix-dim">
          Summaries and bulk actions can be placed here to complement the data table layout.
          Aggregate totals, export controls, and batch operations enhance table workflows.
        </p>
      </Section>
    </div>
  );
}
