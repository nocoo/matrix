// ============================================
// Buttons Page — Button variants & patterns
// Matrix cyberpunk style replica of Basalt's ButtonsPage.
// ============================================

import { useState } from "react";
import { AsciiBox, MatrixButton } from "@/components/ui";
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

function LoadingButton() {
  const [loading, setLoading] = useState(false);
  return (
    <MatrixButton
      loading={loading}
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
      }}
    >
      {loading ? "PROCESSING..." : "EXECUTE"}
    </MatrixButton>
  );
}

function CopyButton() {
  const [copied, setCopied] = useState(false);
  return (
    <MatrixButton
      onClick={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "✓ COPIED" : "⎘ COPY"}
    </MatrixButton>
  );
}

export default function ButtonsPage() {
  return (
    <div className="space-y-4">
      <AsciiBox title="BUTTONS" subtitle="action triggers">
        <p className="text-xs font-mono text-matrix-muted">
          Matrix-styled buttons and action triggers. Every variant, size, state, and composition pattern.
        </p>
      </AsciiBox>

      {/* ── Variants ───────────────────────────── */}
      <Section title="VARIANTS">
        <div className="flex flex-wrap gap-3">
          <MatrixButton>DEFAULT</MatrixButton>
          <MatrixButton primary>PRIMARY</MatrixButton>
          <MatrixButton className="!bg-red-500/10 !border-red-500/30 !text-red-400 hover:!bg-red-500/20">DESTRUCTIVE</MatrixButton>
          <MatrixButton className="!bg-transparent !border-matrix-ghost !text-matrix-muted hover:!bg-matrix-panel hover:!text-matrix-primary">OUTLINE</MatrixButton>
          <MatrixButton className="!bg-transparent !border-transparent !text-matrix-muted hover:!bg-matrix-primary/5 hover:!text-matrix-primary">GHOST</MatrixButton>
          <MatrixButton className="!bg-transparent !border-transparent !text-matrix-primary underline underline-offset-4 hover:!text-matrix-bright">LINK</MatrixButton>
        </div>
      </Section>

      {/* ── Sizes ──────────────────────────────── */}
      <Section title="SIZES">
        <div className="flex flex-wrap items-center gap-3">
          <MatrixButton size="small">SMALL</MatrixButton>
          <MatrixButton>DEFAULT</MatrixButton>
          <MatrixButton className="!px-6 !py-3 !text-sm">LARGE</MatrixButton>
          <MatrixButton size="small" className="!px-2 !min-w-0">
            <span className="text-sm">+</span>
          </MatrixButton>
        </div>
      </Section>

      {/* ── With Icons ─────────────────────────── */}
      <Section title="WITH ICONS">
        <div className="flex flex-wrap gap-3">
          <MatrixButton>
            <span className="flex items-center gap-2">
              <span className="text-xs">✉</span> SEND EMAIL
            </span>
          </MatrixButton>
          <MatrixButton>
            <span className="flex items-center gap-2">
              <span className="text-xs">↓</span> EXPORT
            </span>
          </MatrixButton>
          <MatrixButton className="!bg-red-500/10 !border-red-500/30 !text-red-400 hover:!bg-red-500/20">
            <span className="flex items-center gap-2">
              <span className="text-xs">✕</span> DELETE
            </span>
          </MatrixButton>
          <MatrixButton className="!bg-transparent !border-matrix-ghost !text-matrix-muted hover:!text-matrix-primary">
            <span className="flex items-center gap-2">
              SHARE <span className="text-xs">↗</span>
            </span>
          </MatrixButton>
        </div>
      </Section>

      {/* ── States ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="DISABLED">
          <div className="flex flex-wrap gap-3">
            <MatrixButton disabled>DEFAULT</MatrixButton>
            <MatrixButton primary disabled>PRIMARY</MatrixButton>
            <MatrixButton disabled className="!bg-red-500/10 !border-red-500/30 !text-red-400">DESTRUCTIVE</MatrixButton>
            <MatrixButton disabled className="!bg-transparent !border-matrix-ghost !text-matrix-muted">OUTLINE</MatrixButton>
          </div>
        </Section>

        <Section title="LOADING">
          <div className="flex flex-wrap gap-3">
            <LoadingButton />
            <MatrixButton loading>SYNCING...</MatrixButton>
          </div>
        </Section>
      </div>

      {/* ── Icon-only buttons ──────────────────── */}
      <Section title="ICON BUTTONS">
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "♥", cls: "" },
            { icon: "♥", cls: "!bg-matrix-panel-strong !border-matrix-ghost" },
            { icon: "♥", cls: "!bg-transparent !border-matrix-ghost !text-matrix-muted" },
            { icon: "♥", cls: "!bg-transparent !border-transparent !text-matrix-muted" },
            { icon: "♥", cls: "!bg-red-500/10 !border-red-500/30 !text-red-400" },
          ].map((btn, i) => (
            <MatrixButton key={i} size="small" className={cn("!px-2 !min-w-0", btn.cls)}>
              {btn.icon}
            </MatrixButton>
          ))}
        </div>
      </Section>

      {/* ── Button Groups ──────────────────────── */}
      <Section title="BUTTON GROUPS">
        <div className="space-y-4">
          {/* Pair */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Primary + Secondary</p>
            <div className="flex gap-2">
              <MatrixButton primary>SAVE</MatrixButton>
              <MatrixButton>CANCEL</MatrixButton>
            </div>
          </div>

          {/* Segmented */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Segmented</p>
            <div className="inline-flex border border-matrix-ghost overflow-hidden">
              {["LEFT", "CENTER", "RIGHT"].map((label) => (
                <button
                  key={label}
                  className="px-4 py-2 text-xs font-mono uppercase font-bold text-matrix-muted border-r border-matrix-ghost last:border-r-0 hover:bg-matrix-primary/10 hover:text-matrix-primary transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Split */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Split button</p>
            <div className="inline-flex">
              <MatrixButton primary>SAVE</MatrixButton>
              <MatrixButton primary className="!border-l-0 !px-2 !min-w-0">▼</MatrixButton>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Interactive Patterns ────────────────── */}
      <Section title="INTERACTIVE PATTERNS">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Copy to clipboard</p>
            <CopyButton />
          </div>
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Confirmation destructive</p>
            <MatrixButton className="!bg-red-500/10 !border-red-500/30 !text-red-400 hover:!bg-red-500/20">
              DELETE ACCOUNT
            </MatrixButton>
            <p className="text-[10px] font-mono text-red-400/60 mt-1">This action cannot be undone.</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-2">Full width</p>
            <MatrixButton primary className="w-full">CREATE NEW PROJECT</MatrixButton>
          </div>
        </div>
      </Section>
    </div>
  );
}
