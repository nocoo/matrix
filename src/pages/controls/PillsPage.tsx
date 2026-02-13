// ============================================
// Pills Page — Pill chips in every style
// Matrix cyberpunk style replica of Basalt's PillsPage.
// ============================================

import { useState } from "react";
import { AsciiBox } from "@/components/ui";
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

export default function PillsPage() {
  const vm = useControlsViewModel();
  const [closablePills, setClosablePills] = useState(["NEURAL", "QUANTUM", "CIPHER", "FLUX"]);

  return (
    <div className="space-y-4">
      <AsciiBox title="PILLS" subtitle="chip styles">
        <p className="text-xs font-mono text-matrix-muted">
          Pill chips in every style: solid, soft, outline, icon, size scale, gradient, dot indicators, and closable.
        </p>
      </AsciiBox>

      {/* ── Solid pills ──────────────────────── */}
      <Section title="SOLID PILLS">
        <div className="flex flex-wrap gap-2">
          {vm.solidPills.map((pill) => (
            <span
              key={pill.label}
              className={cn("px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-sm", pill.className)}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </Section>

      {/* ── Soft pills ───────────────────────── */}
      <Section title="SOFT PILLS">
        <div className="flex flex-wrap gap-2">
          {vm.softPills.map((pill) => (
            <span
              key={pill.label}
              className={cn("px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-sm", pill.className)}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </Section>

      {/* ── Outline pills ────────────────────── */}
      <Section title="OUTLINE PILLS">
        <div className="flex flex-wrap gap-2">
          {vm.outlinePills.map((pill) => (
            <span
              key={pill.label}
              className={cn("px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-sm", pill.className)}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </Section>

      {/* ── Icon pills + Size scale ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="ICON PILLS">
          <div className="flex flex-wrap gap-2">
            {[
              { icon: "◉", label: "VERIFIED", cls: "bg-green-500/15 text-green-400 border border-green-500/30" },
              { icon: "⚠", label: "AT RISK", cls: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" },
              { icon: "◈", label: "INFO", cls: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
              { icon: "✦", label: "AI", cls: "bg-purple-500/15 text-purple-400 border border-purple-500/30" },
            ].map((pill) => (
              <span
                key={pill.label}
                className={cn("flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-sm", pill.cls)}
              >
                <span>{pill.icon}</span>
                {pill.label}
              </span>
            ))}
          </div>
        </Section>

        <Section title="SIZE SCALE">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-matrix-primary/20 text-matrix-primary border border-matrix-primary/30">
              XS
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-matrix-primary/20 text-matrix-primary border border-matrix-primary/30">
              SM
            </span>
            <span className="px-3 py-1 text-xs font-mono font-bold uppercase bg-matrix-primary/20 text-matrix-primary border border-matrix-primary/30">
              MD
            </span>
            <span className="px-4 py-1.5 text-sm font-mono font-bold uppercase bg-matrix-primary/20 text-matrix-primary border border-matrix-primary/30">
              LG
            </span>
          </div>
        </Section>
      </div>

      {/* ── Gradient pills ───────────────────── */}
      <Section title="GRADIENT PILLS">
        <div className="flex flex-wrap gap-2">
          {vm.gradientPills.map((pill) => (
            <span
              key={pill.label}
              className={cn("px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-sm", pill.className)}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </Section>

      {/* ── Dot indicators + Closable ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="DOT INDICATORS">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "LIVE", dotColor: "bg-green-400", cls: "text-green-400 border-green-500/30" },
              { label: "PAUSED", dotColor: "bg-yellow-400", cls: "text-yellow-400 border-yellow-500/30" },
              { label: "OFFLINE", dotColor: "bg-red-400", cls: "text-red-400 border-red-500/30" },
            ].map((pill) => (
              <span
                key={pill.label}
                className={cn("flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold uppercase border rounded-sm", pill.cls)}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", pill.dotColor)} />
                {pill.label}
              </span>
            ))}
          </div>
        </Section>

        <Section title="CLOSABLE PILLS">
          <div className="flex flex-wrap gap-2">
            {closablePills.map((label) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold uppercase text-matrix-muted border border-matrix-ghost rounded-sm group"
              >
                {label}
                <button
                  onClick={() => setClosablePills((prev) => prev.filter((p) => p !== label))}
                  className="text-matrix-dim hover:text-red-400 transition-colors ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
            {closablePills.length === 0 && (
              <button
                onClick={() => setClosablePills(["NEURAL", "QUANTUM", "CIPHER", "FLUX"])}
                className="text-[10px] font-mono text-matrix-dim hover:text-matrix-primary transition-colors underline"
              >
                [RESET PILLS]
              </button>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
