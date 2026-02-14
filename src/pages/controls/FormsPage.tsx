// ============================================
// Forms Page — Form layouts
// Matrix cyberpunk style replica of Basalt's FormsPage.
// ============================================

import { useState } from "react";
import { AsciiBox, MatrixButton, MatrixInput, SignalBox } from "@/components/ui";
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

export default function FormsPage() {
  const [twoFa, setTwoFa] = useState(true);
  const [consent, setConsent] = useState(false);

  return (
    <div className="space-y-4">
      <AsciiBox title="FORMS" subtitle="layouts">
        <p className="text-xs font-mono text-matrix-muted">
          Form layouts that integrate Matrix styling: profile forms, security settings,
          newsletter subscriptions, file uploads, and success states.
        </p>
      </AsciiBox>

      {/* ── Profile + Security ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="PROFILE FORM">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <MatrixInput label="First Name" placeholder="THOMAS" />
              <MatrixInput label="Last Name" placeholder="ANDERSON" />
            </div>
            <MatrixInput label="Email" placeholder="neo@matrix.zion" type="email" />
            <div className="relative">
              <MatrixInput label="Location" placeholder="ZION, SECTOR 7" />
              <span className="absolute right-3 top-8 text-matrix-dim font-mono text-xs">⌖</span>
            </div>
            <MatrixButton primary className="mt-2">SAVE PROFILE</MatrixButton>
          </form>
        </Section>

        <Section title="SECURITY">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <MatrixInput label="Password" placeholder="********" type="password" />
            <MatrixInput label="Confirm Password" placeholder="********" type="password" />
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-xs font-mono text-matrix-muted uppercase font-bold block">Two-factor auth</span>
                <span className="text-[10px] font-mono text-matrix-dim">Recommended for all operators</span>
              </div>
              <button
                type="button"
                onClick={() => setTwoFa(!twoFa)}
                className={cn(
                  "relative w-9 h-5 border overflow-hidden shrink-0 transition-colors",
                  twoFa
                    ? "bg-matrix-primary/30 border-matrix-primary"
                    : "bg-matrix-panel-strong border-matrix-ghost"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-3 h-3 transition-all",
                    twoFa
                      ? "left-[20px] bg-matrix-primary shadow-[0_0_8px_rgba(0,255,65,0.6)]"
                      : "left-1 bg-matrix-dim"
                  )}
                />
              </button>
            </div>
            <MatrixButton primary>UPDATE SECURITY</MatrixButton>
          </form>
        </Section>
      </div>

      {/* ── Newsletter + Upload + Success ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="NEWSLETTER">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <MatrixInput label="Email" placeholder="operator@zion.net" type="email" />
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setConsent(!consent)}
                className={cn(
                  "w-4 h-4 border flex items-center justify-center transition-colors shrink-0",
                  consent
                    ? "bg-matrix-primary border-matrix-primary"
                    : "bg-matrix-panel border-matrix-ghost hover:border-matrix-dim"
                )}
              >
                {consent && <span className="text-black text-[10px] font-bold">✓</span>}
              </button>
              <span className="text-[10px] font-mono text-matrix-dim">
                I consent to receive neural network updates
              </span>
            </label>
            <MatrixButton primary className="w-full">SUBSCRIBE</MatrixButton>
          </form>
        </Section>

        <Section title="FILE UPLOAD">
          <div className="border-2 border-dashed border-matrix-ghost p-6 text-center hover:border-matrix-dim transition-colors cursor-pointer">
            <p className="text-2xl font-mono text-matrix-dim mb-2">↑</p>
            <p className="text-xs font-mono text-matrix-muted font-bold">DROP FILES HERE</p>
            <p className="text-[10px] font-mono text-matrix-dim mt-1">
              PNG, JPG, SVG up to 4MB
            </p>
            <MatrixButton size="small" className="mt-3">BROWSE FILES</MatrixButton>
          </div>
        </Section>

        <Section title="SUCCESS STATE">
          <div className="text-center py-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-400 font-mono font-bold">✓</span>
            </div>
            <p className="text-xs font-mono text-matrix-bright font-bold mb-1">FORM SUBMITTED</p>
            <p className="text-[10px] font-mono text-matrix-dim mb-3">
              Your data has been processed and stored in the Matrix.
            </p>
            <div className="border-t border-matrix-ghost pt-3 mt-3">
              <MatrixButton size="small">VIEW DETAILS</MatrixButton>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
