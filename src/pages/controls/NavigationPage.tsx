// ============================================
// Navigation Page — Navigation & wayfinding
// Matrix cyberpunk style replica of Basalt's NavigationPage.
// ============================================

import { AsciiBox, MatrixButton } from "@/components/ui";
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
    <div className={`matrix-panel p-4 ${className}`}>
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

// ── Breadcrumb ────────────────────────────────
function Breadcrumb({ items, withIcons = false }: { items: string[]; withIcons?: boolean }) {
  const icons = ["⌂", "⎔", "⎔", "⎙"];
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {items.map((item, i) => (
        <div key={item} className="flex items-center gap-1">
          {i > 0 && <span className="text-matrix-ghost font-mono text-xs mx-1">/</span>}
          {withIcons && <span className="text-matrix-dim text-xs">{icons[i] || "⎔"}</span>}
          <span
            className={cn(
              "text-xs font-mono",
              i === items.length - 1
                ? "text-matrix-primary font-bold"
                : "text-matrix-muted hover:text-matrix-primary cursor-pointer transition-colors"
            )}
          >
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Pagination ────────────────────────────────
function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (page > 3) pages.push("...");
    const start = Math.max(2, page - 1);
    const end = Math.min(total - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(1)}
        disabled={page === 1}
        className="px-1.5 py-1 text-[10px] font-mono text-matrix-muted hover:text-matrix-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ««
      </button>
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-1.5 py-1 text-[10px] font-mono text-matrix-muted hover:text-matrix-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        «
      </button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-[10px] font-mono text-matrix-dim">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "w-6 h-6 flex items-center justify-center text-[10px] font-mono font-bold transition-colors",
              p === page
                ? "bg-matrix-primary text-black"
                : "text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        className="px-1.5 py-1 text-[10px] font-mono text-matrix-muted hover:text-matrix-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        »
      </button>
      <button
        onClick={() => onChange(total)}
        disabled={page === total}
        className="px-1.5 py-1 text-[10px] font-mono text-matrix-muted hover:text-matrix-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        »»
      </button>
    </div>
  );
}

export default function NavigationPage() {
  const vm = useControlsViewModel();

  return (
    <div className="space-y-4">
      <AsciiBox title="NAVIGATION" subtitle="wayfinding">
        <p className="text-xs font-mono text-matrix-muted">
          Breadcrumbs, pagination, steppers, and tab patterns for navigation and wayfinding.
        </p>
      </AsciiBox>

      {/* ── Breadcrumbs ──────────────────────── */}
      <Section title="BREADCRUMBS">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Simple</p>
            <Breadcrumb items={["HOME", "SYSTEMS", "NEURAL", "INTERFACE"]} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">With icons</p>
            <Breadcrumb items={["HOME", "SECTORS", "SECTOR-7", "LOGS"]} withIcons />
          </div>
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Inside a card</p>
            <div className="border border-matrix-ghost p-3">
              <Breadcrumb items={["DASHBOARD", "SETTINGS", "NOTIFICATIONS"]} />
              <div className="mt-3 pt-3 border-t border-matrix-ghost">
                <p className="text-xs font-mono text-matrix-dim">
                  Configure notification preferences for your neural interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Pagination ───────────────────────── */}
      <Section title="PAGINATION">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Short (5 pages)</p>
            <Pagination page={vm.page1} total={5} onChange={vm.setPage1} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Long (20 pages)</p>
            <Pagination page={vm.page2} total={20} onChange={vm.setPage2} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">With context</p>
            <div className="border border-matrix-ghost p-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-matrix-dim">
                Showing {(vm.page2 - 1) * 10 + 1}–{Math.min(vm.page2 * 10, 200)} of 200 results
              </span>
              <Pagination page={vm.page2} total={20} onChange={vm.setPage2} />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Stepper / Wizard ─────────────────── */}
      <Section title="STEPPER / WIZARD">
        <div className="space-y-6">
          {/* Horizontal */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-4">Horizontal</p>
            <div className="flex items-start justify-between mb-4">
              {vm.stepperSteps.map((step, i) => (
                <div key={step.label} className="flex items-start flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-7 h-7 flex items-center justify-center text-[10px] font-mono font-bold border transition-colors",
                        i < vm.stepperIndex
                          ? "bg-matrix-primary/20 border-matrix-primary text-matrix-primary"
                          : i === vm.stepperIndex
                            ? "bg-matrix-primary border-matrix-primary text-black shadow-[0_0_10px_rgba(0,255,65,0.4)]"
                            : "bg-matrix-panel border-matrix-ghost text-matrix-dim"
                      )}
                    >
                      {i < vm.stepperIndex ? "✓" : i + 1}
                    </div>
                    <span className="text-[9px] font-mono text-matrix-dim mt-1 uppercase">{step.label}</span>
                  </div>
                  {i < vm.stepperSteps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-px mt-[14px]",
                      i < vm.stepperIndex ? "bg-matrix-primary" : "bg-matrix-ghost"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <MatrixButton size="small" onClick={vm.stepperPrev} disabled={vm.stepperIndex === 0}>
                « BACK
              </MatrixButton>
              <MatrixButton size="small" primary onClick={vm.stepperNext} disabled={vm.stepperIndex === 4}>
                NEXT »
              </MatrixButton>
              <MatrixButton size="small" onClick={vm.stepperReset}>RESET</MatrixButton>
            </div>
          </div>

          {/* Vertical */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-4">Vertical</p>
            <div className="space-y-0">
              {vm.stepperSteps.map((step, i) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-6 h-6 flex items-center justify-center text-[10px] font-mono font-bold border shrink-0",
                        i < vm.stepperIndex
                          ? "bg-matrix-primary/20 border-matrix-primary text-matrix-primary"
                          : i === vm.stepperIndex
                            ? "bg-matrix-primary border-matrix-primary text-black"
                            : "bg-matrix-panel border-matrix-ghost text-matrix-dim"
                      )}
                    >
                      {i < vm.stepperIndex ? "✓" : i + 1}
                    </div>
                    {i < vm.stepperSteps.length - 1 && (
                      <div className={cn(
                        "w-px flex-1 min-h-[20px]",
                        i < vm.stepperIndex ? "bg-matrix-primary" : "bg-matrix-ghost"
                      )} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-mono text-matrix-bright font-bold uppercase">{step.label}</p>
                    <p className="text-[10px] font-mono text-matrix-dim">{step.description}</p>
                    <span className={cn(
                      "text-[9px] font-mono uppercase",
                      i < vm.stepperIndex ? "text-green-400" : i === vm.stepperIndex ? "text-matrix-primary" : "text-matrix-ghost"
                    )}>
                      {i < vm.stepperIndex ? "Completed" : i === vm.stepperIndex ? "In progress" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Tab Patterns ─────────────────────── */}
      <Section title="TAB PATTERNS">
        <div className="space-y-6">
          {/* Standard */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Standard tabs</p>
            <div className="flex border-b border-matrix-ghost">
              {["overview", "analytics", "reports", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => vm.setNavTab(tab)}
                  className={cn(
                    "px-4 py-2 text-xs font-mono uppercase font-bold transition-colors",
                    vm.navTab === tab
                      ? "text-matrix-primary border-b-2 border-matrix-primary bg-matrix-primary/5"
                      : "text-matrix-dim hover:text-matrix-muted"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="pt-3 text-xs font-mono text-matrix-muted">
              {">> "}Content for {vm.navTab.toUpperCase()} tab goes here.
            </div>
          </div>

          {/* Underline */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Underline style</p>
            <div className="flex gap-1">
              {["all", "active", "archived", "drafts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => vm.setNavUnderline(tab)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors border-b-2",
                    vm.navUnderline === tab
                      ? "text-matrix-primary border-matrix-primary"
                      : "text-matrix-dim border-transparent hover:text-matrix-muted hover:border-matrix-ghost"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Pill */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Pill style</p>
            <div className="inline-flex bg-matrix-panel-strong p-0.5 border border-matrix-ghost">
              {["day", "week", "month", "year"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => vm.setNavPill(tab)}
                  className={cn(
                    "px-4 py-1 text-xs font-mono uppercase font-bold transition-colors",
                    vm.navPill === tab
                      ? "bg-matrix-primary text-black shadow-[0_0_8px_rgba(0,255,65,0.3)]"
                      : "text-matrix-dim hover:text-matrix-muted"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
