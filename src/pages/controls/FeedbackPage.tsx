// ============================================
// Feedback Page — Feedback & status communication
// Matrix cyberpunk style replica of Basalt's FeedbackPage.
// ============================================

import { useState, useCallback } from "react";
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

// ── Inline Alert ──────────────────────────────
const ALERT_STYLES = {
  info: { border: "border-blue-500/30", bg: "bg-blue-500/5", icon: "◈", iconColor: "text-blue-400", titleColor: "text-blue-400" },
  success: { border: "border-green-500/30", bg: "bg-green-500/5", icon: "✓", iconColor: "text-green-400", titleColor: "text-green-400" },
  warning: { border: "border-yellow-500/30", bg: "bg-yellow-500/5", icon: "⚠", iconColor: "text-yellow-400", titleColor: "text-yellow-400" },
  error: { border: "border-red-500/30", bg: "bg-red-500/5", icon: "✕", iconColor: "text-red-400", titleColor: "text-red-400" },
};

function InlineAlert({ variant, title, message }: { variant: keyof typeof ALERT_STYLES; title: string; message: string }) {
  const s = ALERT_STYLES[variant];
  return (
    <div className={cn("border rounded p-3", s.border, s.bg)}>
      <div className="flex items-center gap-2 mb-1">
        <span className={cn("text-xs", s.iconColor)}>{s.icon}</span>
        <p className={cn("text-xs font-mono font-bold uppercase", s.titleColor)}>{title}</p>
      </div>
      <p className="text-xs font-mono text-matrix-dim ml-5">{message}</p>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={cn("bg-matrix-primary/8 animate-pulse rounded", className)} />;
}

export default function FeedbackPage() {
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = useCallback((id: string) => {
    setActiveToast(id);
    setTimeout(() => setActiveToast(null), 3000);
  }, []);

  return (
    <div className="space-y-4">
      <AsciiBox title="FEEDBACK" subtitle="status communication">
        <p className="text-xs font-mono text-matrix-muted">
          Feedback patterns for status communication: toast notifications, inline alerts, skeleton loaders,
          empty states, progress indicators, and banners.
        </p>
      </AsciiBox>

      {/* ── Toast Notifications ──────────────── */}
      <Section title="TOAST NOTIFICATIONS">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: "success", label: "SUCCESS", color: "text-green-400 bg-green-500/10 border-green-500/30" },
            { id: "error", label: "ERROR", color: "text-red-400 bg-red-500/10 border-red-500/30" },
            { id: "warning", label: "WARNING", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
            { id: "info", label: "INFO", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
            { id: "action", label: "WITH ACTION", color: "text-matrix-primary bg-matrix-primary/10 border-matrix-primary/30" },
            { id: "promise", label: "ASYNC PROMISE", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => showToast(t.id)}
              className={cn(
                "text-left border rounded p-3 transition-colors font-mono text-xs font-bold uppercase",
                t.color,
                "hover:opacity-80"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Inline Alerts ────────────────────── */}
      <Section title="INLINE ALERTS">
        <div className="space-y-3">
          <InlineAlert variant="info" title="SYSTEM INFO" message="Neural interface v2.1 is available for upgrade." />
          <InlineAlert variant="success" title="OPERATION COMPLETE" message="All 42 nodes synchronized successfully." />
          <InlineAlert variant="warning" title="RESOURCE WARNING" message="Memory allocation approaching threshold (87%)." />
          <InlineAlert variant="error" title="CONNECTION FAILED" message="Unable to reach Sector 7 relay. Retrying in 30s." />
        </div>
      </Section>

      {/* ── Banners ──────────────────────────── */}
      <Section title="BANNERS">
        <div className="space-y-3">
          <div className="bg-matrix-primary/10 border border-matrix-primary/30 rounded p-3 flex items-center justify-between">
            <p className="text-xs font-mono text-matrix-primary font-bold">
              ↑ UPGRADE TO PRO — Unlock advanced neural processing capabilities.
            </p>
            <MatrixButton size="small" primary>UPGRADE</MatrixButton>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/30 rounded p-3 flex items-center justify-between">
            <p className="text-xs font-mono text-yellow-400 font-bold">
              ◈ SCHEDULED MAINTENANCE — 2026-02-15 03:00–05:00 UTC
            </p>
            <MatrixButton size="small">DISMISS</MatrixButton>
          </div>
        </div>
      </Section>

      {/* ── Skeleton Loaders ─────────────────── */}
      <Section title="SKELETON LOADERS">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Card skeleton</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border border-matrix-ghost rounded p-4 space-y-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-8 w-24 mt-2" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">List skeleton</p>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 border border-matrix-ghost rounded p-3">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2.5 w-2/3" />
                  </div>
                  <Skeleton className="h-5 w-14 shrink-0" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Text skeleton</p>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Empty States ─────────────────────── */}
      <Section title="EMPTY STATES">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="border border-dashed border-matrix-ghost rounded p-6 text-center">
            <p className="text-2xl font-mono text-matrix-dim mb-2">⌸</p>
            <p className="text-xs font-mono text-matrix-muted font-bold mb-1">NO DATA</p>
            <p className="text-[10px] font-mono text-matrix-dim mb-3">Create your first record to get started.</p>
            <MatrixButton size="small">CREATE RECORD</MatrixButton>
          </div>
          <div className="border border-dashed border-matrix-ghost rounded p-6 text-center">
            <p className="text-2xl font-mono text-matrix-dim mb-2">⌕</p>
            <p className="text-xs font-mono text-matrix-muted font-bold mb-1">NO RESULTS</p>
            <p className="text-[10px] font-mono text-matrix-dim mb-3">Try adjusting your search filters.</p>
            <MatrixButton size="small">CLEAR FILTERS</MatrixButton>
          </div>
          <div className="border border-dashed border-matrix-ghost rounded p-6 text-center">
            <p className="text-2xl font-mono text-red-400 mb-2">✕</p>
            <p className="text-xs font-mono text-matrix-muted font-bold mb-1">ERROR</p>
            <p className="text-[10px] font-mono text-matrix-dim mb-3">Something went wrong loading this data.</p>
            <MatrixButton size="small">↻ RETRY</MatrixButton>
          </div>
        </div>
      </Section>

      {/* ── Progress Indicators ──────────────── */}
      <Section title="PROGRESS INDICATORS">
        <div className="space-y-4">
          {/* Determinate */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Determinate progress</p>
            <div className="space-y-3">
              {[
                { label: "Uploading", value: 25, color: "bg-matrix-primary" },
                { label: "Processing", value: 60, color: "bg-yellow-500" },
                { label: "Complete", value: 100, color: "bg-green-500" },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-mono text-matrix-dim uppercase">{p.label}</span>
                    <span className="text-[10px] font-mono text-matrix-muted">{p.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-matrix-panel-strong border border-matrix-ghost overflow-hidden">
                    <div className={cn("h-full transition-all", p.color)} style={{ width: `${p.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spinners */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Spinners</p>
            <div className="flex items-center gap-6">
              {[
                { size: "w-4 h-4", label: "SM" },
                { size: "w-6 h-6", label: "MD" },
                { size: "w-8 h-8", label: "LG" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <div className={cn("border-2 border-matrix-ghost border-t-matrix-primary rounded-full animate-spin", s.size)} />
                  <span className="text-[10px] font-mono text-matrix-dim">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-step */}
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Multi-step progress</p>
            <div className="flex items-center justify-between">
              {["UPLOAD", "PROCESS", "REVIEW", "COMPLETE"].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border",
                        i < 2
                          ? "bg-matrix-primary/20 border-matrix-primary text-matrix-primary"
                          : i === 2
                            ? "bg-matrix-primary border-matrix-primary text-black"
                            : "bg-matrix-panel border-matrix-ghost text-matrix-dim"
                      )}
                    >
                      {i < 2 ? "✓" : i + 1}
                    </div>
                    <span className="text-[9px] font-mono text-matrix-dim mt-1 uppercase">{step}</span>
                  </div>
                  {i < 3 && (
                    <div className={cn(
                      "w-8 lg:w-16 h-px mx-1",
                      i < 2 ? "bg-matrix-primary" : "bg-matrix-ghost"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Active toast overlay */}
      {activeToast && (
        <div
          className="fixed bottom-8 right-8 z-50 matrix-panel p-4 max-w-sm cursor-pointer border-l-2 border-l-matrix-primary"
          onClick={() => setActiveToast(null)}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-matrix-primary animate-pulse" />
            <span className="text-xs font-mono text-matrix-bright uppercase">
              {activeToast === "success" && "Operation completed successfully."}
              {activeToast === "error" && "An error occurred during processing."}
              {activeToast === "warning" && "Warning: approaching resource limits."}
              {activeToast === "info" && "System update available."}
              {activeToast === "action" && "Item archived. [UNDO]"}
              {activeToast === "promise" && "Async operation in progress..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
