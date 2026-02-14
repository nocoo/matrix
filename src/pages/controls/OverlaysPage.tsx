// ============================================
// Overlays Page — Overlays & layered surfaces
// Matrix cyberpunk style replica of Basalt's OverlaysPage.
// ============================================

import { useState } from "react";
import { AsciiBox, MatrixButton, MatrixInput } from "@/components/ui";
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

// ── Sheet overlay ─────────────────────────────
function Sheet({
  side,
  open,
  onClose,
  children,
}: {
  side: "left" | "right" | "top" | "bottom";
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  const positionClasses = {
    left: "inset-y-0 left-0 w-80",
    right: "inset-y-0 right-0 w-80",
    top: "inset-x-0 top-0 h-auto max-h-48",
    bottom: "inset-x-0 bottom-0 h-auto max-h-64",
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("fixed z-50 matrix-panel border-matrix-primary/30 p-5 overflow-y-auto matrix-scrollbar", positionClasses[side])}>
        {children}
      </div>
    </>
  );
}

// ── Toggle switch ─────────────────────────────
function ToggleSwitch({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-xs font-mono text-matrix-muted uppercase">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={cn(
          "relative w-10 h-5 border transition-colors",
          on ? "bg-matrix-primary/30 border-matrix-primary" : "bg-matrix-panel-strong border-matrix-ghost"
        )}
      >
        <span className={cn(
          "absolute top-0.5 w-4 h-4 transition-all",
          on ? "left-5 bg-matrix-primary shadow-[0_0_8px_rgba(0,255,65,0.6)]" : "left-0.5 bg-matrix-dim"
        )} />
      </button>
    </label>
  );
}

export default function OverlaysPage() {
  const [sheetSide, setSheetSide] = useState<"left" | "right" | "top" | "bottom" | null>(null);
  const [basicDialog, setBasicDialog] = useState(false);
  const [compactDialog, setCompactDialog] = useState(false);
  const [scrollDialog, setScrollDialog] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [discardAlert, setDiscardAlert] = useState(false);
  const [filterPop, setFilterPop] = useState(false);
  const [profilePop, setProfilePop] = useState(false);
  const [settingsPop, setSettingsPop] = useState(false);
  const [collapse1, setCollapse1] = useState(false);
  const [collapse2, setCollapse2] = useState(false);

  return (
    <div className="space-y-4">
      <AsciiBox title="OVERLAYS" subtitle="layered surfaces">
        <p className="text-xs font-mono text-matrix-muted">
          Sheets, dialogs, alert dialogs, popovers, and collapsible sections — all the layered surface patterns.
        </p>
      </AsciiBox>

      {/* ── Sheet / Drawer ───────────────────── */}
      <Section title="SHEET / DRAWER">
        <div className="flex flex-wrap gap-3">
          {(["right", "left", "top", "bottom"] as const).map((side) => (
            <MatrixButton key={side} size="small" onClick={() => setSheetSide(side)}>
              {side.toUpperCase()}
            </MatrixButton>
          ))}
        </div>
      </Section>

      {/* ── Dialogs ──────────────────────────── */}
      <Section title="DIALOGS">
        <div className="flex flex-wrap gap-3">
          <MatrixButton size="small" onClick={() => setBasicDialog(true)}>BASIC</MatrixButton>
          <MatrixButton size="small" onClick={() => setCompactDialog(true)}>COMPACT</MatrixButton>
          <MatrixButton size="small" onClick={() => setScrollDialog(true)}>SCROLLABLE</MatrixButton>
        </div>
      </Section>

      {/* ── Alert Dialogs ────────────────────── */}
      <Section title="ALERT DIALOGS">
        <div className="flex flex-wrap gap-3">
          <MatrixButton
            size="small"
            onClick={() => setDeleteAlert(true)}
            className="!bg-red-500/10 !border-red-500/30 !text-red-400"
          >
            DELETE ITEM
          </MatrixButton>
          <MatrixButton size="small" onClick={() => setDiscardAlert(true)}>
            DISCARD CHANGES
          </MatrixButton>
        </div>
      </Section>

      {/* ── Popovers ────────────────────────── */}
      <Section title="POPOVERS">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <MatrixButton size="small" onClick={() => setFilterPop(!filterPop)}>FILTER</MatrixButton>
            {filterPop && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setFilterPop(false)} />
                <div className="absolute top-10 left-0 z-40 matrix-panel border border-matrix-primary/30 p-3 w-56">
                  <MatrixInput label="Status" placeholder="ACTIVE" />
                  <MatrixInput label="Category" placeholder="ALL" className="mt-2" />
                  <div className="flex gap-2 mt-3">
                    <MatrixButton size="small" onClick={() => setFilterPop(false)}>RESET</MatrixButton>
                    <MatrixButton size="small" primary onClick={() => setFilterPop(false)}>APPLY</MatrixButton>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <MatrixButton size="small" onClick={() => setProfilePop(!profilePop)}>PROFILE</MatrixButton>
            {profilePop && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfilePop(false)} />
                <div className="absolute top-10 left-0 z-40 matrix-panel border border-matrix-primary/30 p-3 w-56">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 border border-matrix-primary/30 bg-matrix-primary/10 flex items-center justify-center text-xs font-mono text-matrix-primary font-bold">
                      NE
                    </div>
                    <div>
                      <p className="text-xs font-mono text-matrix-primary font-bold">NEO</p>
                      <p className="text-[10px] font-mono text-matrix-dim">neo@matrix.zion</p>
                    </div>
                  </div>
                  <div className="border-t border-matrix-ghost pt-2 space-y-1">
                    {["PROFILE SETTINGS", "BILLING", "TEAM", "SIGN OUT"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setProfilePop(false)}
                        className={cn(
                          "w-full text-left px-2 py-1 text-xs font-mono transition-colors",
                          item === "SIGN OUT"
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <MatrixButton size="small" onClick={() => setSettingsPop(!settingsPop)}>SETTINGS</MatrixButton>
            {settingsPop && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSettingsPop(false)} />
                <div className="absolute top-10 left-0 z-40 matrix-panel border border-matrix-primary/30 p-3 w-56">
                  <div className="space-y-3">
                    <ToggleSwitch label="Dark mode" defaultOn />
                    <ToggleSwitch label="Notifications" defaultOn />
                    <ToggleSwitch label="Compact view" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* ── Collapsible Sections ─────────────── */}
      <Section title="COLLAPSIBLE SECTIONS">
        <div className="space-y-3">
          <div className="border border-matrix-ghost">
            <button
              onClick={() => setCollapse1(!collapse1)}
              className="w-full flex items-center justify-between p-3 text-xs font-mono font-bold uppercase text-matrix-muted hover:text-matrix-primary transition-colors"
            >
              <span>ADVANCED OPTIONS</span>
              <span className="text-matrix-dim">{collapse1 ? "▲" : "▼"}</span>
            </button>
            {collapse1 && (
              <div className="px-3 pb-3 space-y-3 border-t border-matrix-ghost pt-3">
                <MatrixInput label="API Endpoint" placeholder="https://api.matrix.zion/v2" />
                <ToggleSwitch label="Enable caching" defaultOn />
                <ToggleSwitch label="Debug mode" />
              </div>
            )}
          </div>
          <div className="border border-red-500/20">
            <button
              onClick={() => setCollapse2(!collapse2)}
              className="w-full flex items-center justify-between p-3 text-xs font-mono font-bold uppercase text-red-400 hover:text-red-300 transition-colors"
            >
              <span>DANGER ZONE</span>
              <span className="text-red-400/50">{collapse2 ? "▲" : "▼"}</span>
            </button>
            {collapse2 && (
              <div className="px-3 pb-3 border-t border-red-500/20 pt-3">
                <p className="text-xs font-mono text-red-400/60 mb-3">
                  Permanently delete this workspace and all associated data.
                </p>
                <MatrixButton className="!bg-red-500/10 !border-red-500/30 !text-red-400 hover:!bg-red-500/20">
                  DELETE WORKSPACE
                </MatrixButton>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* OVERLAY MODALS                          */}
      {/* ═══════════════════════════════════════ */}

      {/* Sheet */}
      <Sheet side={sheetSide ?? "right"} open={!!sheetSide} onClose={() => setSheetSide(null)}>
        {sheetSide === "right" && (
          <div className="space-y-4">
            <p className="text-xs font-mono text-matrix-primary font-bold uppercase">Detail Panel</p>
            <MatrixInput label="Name" placeholder="NEO" />
            <MatrixInput label="Email" placeholder="neo@matrix.zion" />
            <ToggleSwitch label="Active" defaultOn />
            <div className="flex gap-2 pt-2">
              <MatrixButton onClick={() => setSheetSide(null)}>CANCEL</MatrixButton>
              <MatrixButton primary onClick={() => setSheetSide(null)}>SAVE</MatrixButton>
            </div>
          </div>
        )}
        {sheetSide === "left" && (
          <div className="space-y-4">
            <p className="text-xs font-mono text-matrix-primary font-bold uppercase">Filter Panel</p>
            <MatrixInput label="Status" placeholder="ALL" />
            <MatrixInput label="Category" placeholder="ALL" />
            <MatrixInput label="Date Range" placeholder="LAST 30 DAYS" />
            <MatrixButton primary onClick={() => setSheetSide(null)} className="w-full">APPLY FILTERS</MatrixButton>
          </div>
        )}
        {sheetSide === "top" && (
          <div className="text-center py-2">
            <p className="text-xs font-mono text-matrix-primary font-bold uppercase">
              ◈ ANNOUNCEMENT — Matrix v2.1 is now available. Upgrade for enhanced neural processing.
            </p>
          </div>
        )}
        {sheetSide === "bottom" && (
          <div>
            <p className="text-xs font-mono text-matrix-primary font-bold uppercase mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {["EXPORT CSV", "PRINT", "SHARE LINK", "ARCHIVE"].map((action) => (
                <MatrixButton key={action} size="small" onClick={() => setSheetSide(null)} className="w-full">
                  {action}
                </MatrixButton>
              ))}
            </div>
          </div>
        )}
      </Sheet>

      {/* Basic dialog */}
      {basicDialog && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setBasicDialog(false)} />
          <div className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-md">
            <AsciiBox title="EDIT PROFILE">
              <div className="space-y-3">
                <MatrixInput label="Display Name" placeholder="NEO" />
                <div>
                  <label className="text-xs font-mono text-matrix-muted uppercase font-bold block mb-2">Bio</label>
                  <textarea
                    placeholder="Enter your bio..."
                    rows={3}
                    className="w-full bg-matrix-panel border border-matrix-ghost px-3 py-2 text-sm font-mono text-matrix-bright outline-none focus:border-matrix-primary resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <MatrixButton onClick={() => setBasicDialog(false)}>CANCEL</MatrixButton>
                  <MatrixButton primary onClick={() => setBasicDialog(false)}>SAVE</MatrixButton>
                </div>
              </div>
            </AsciiBox>
          </div>
        </>
      )}

      {/* Compact dialog */}
      {compactDialog && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setCompactDialog(false)} />
          <div className="fixed inset-x-4 top-[25%] z-50 mx-auto max-w-sm">
            <div className="matrix-panel border border-matrix-primary/30 p-5">
              <p className="text-sm font-mono text-matrix-bright font-bold mb-2">CONFIRM ACTION</p>
              <p className="text-xs font-mono text-matrix-dim mb-4">
                Are you sure you want to proceed with this operation?
              </p>
              <div className="flex justify-end gap-2">
                <MatrixButton onClick={() => setCompactDialog(false)}>CANCEL</MatrixButton>
                <MatrixButton primary onClick={() => setCompactDialog(false)}>CONFIRM</MatrixButton>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Scrollable dialog */}
      {scrollDialog && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setScrollDialog(false)} />
          <div className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-2xl max-h-[80vh] overflow-y-auto matrix-scrollbar">
            <AsciiBox title="TERMS OF SERVICE">
              <div className="space-y-4 text-xs font-mono text-matrix-dim">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i}>
                    <p className="text-matrix-muted font-bold mb-1">SECTION {i + 1} — {
                      ["NEURAL INTERFACE AGREEMENT", "DATA PROCESSING", "SECURITY PROTOCOLS",
                       "USAGE LIMITS", "LIABILITY", "MODIFICATIONS", "TERMINATION", "GOVERNING LAW"][i]
                    }</p>
                    <p>
                      By accessing the Matrix neural interface, you acknowledge and agree to the terms
                      outlined in this section. All data transmitted through the interface is subject to
                      encryption protocols and monitoring systems as defined by Zion Security Council
                      directive ZSC-{2026 + i}. Unauthorized access attempts will be logged and reported.
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-matrix-ghost mt-4">
                <MatrixButton onClick={() => setScrollDialog(false)}>DECLINE</MatrixButton>
                <MatrixButton primary onClick={() => setScrollDialog(false)}>ACCEPT</MatrixButton>
              </div>
            </AsciiBox>
          </div>
        </>
      )}

      {/* Delete alert */}
      {deleteAlert && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <div className="fixed inset-x-4 top-[25%] z-50 mx-auto max-w-sm">
            <div className="matrix-panel border border-red-500/30 p-5">
              <p className="text-sm font-mono text-red-400 font-bold mb-2">DELETE ITEM?</p>
              <p className="text-xs font-mono text-red-400/60 mb-4">
                This item will be permanently deleted. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <MatrixButton
                  onClick={() => setDeleteAlert(false)}
                  className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10"
                >CANCEL</MatrixButton>
                <MatrixButton
                  onClick={() => setDeleteAlert(false)}
                  className="!bg-red-500/20 !border-red-500/40 !text-red-400"
                >
                  DELETE
                </MatrixButton>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Discard alert */}
      {discardAlert && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <div className="fixed inset-x-4 top-[25%] z-50 mx-auto max-w-sm">
            <div className="matrix-panel border border-matrix-primary/30 p-5">
              <p className="text-sm font-mono text-matrix-primary font-bold mb-2">DISCARD CHANGES?</p>
              <p className="text-xs font-mono text-matrix-muted mb-4">
                You have unsaved modifications. Discard all changes and exit?
              </p>
              <div className="flex justify-end gap-2">
                <MatrixButton onClick={() => setDiscardAlert(false)}>KEEP EDITING</MatrixButton>
                <MatrixButton primary onClick={() => setDiscardAlert(false)}>DISCARD</MatrixButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
