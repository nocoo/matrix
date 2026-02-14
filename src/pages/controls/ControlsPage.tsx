// ============================================
// Controls Page — Master control showcase
// 1:1 replica of Basalt's ControlsPage in Matrix cyberpunk style.
// ============================================

import { useState } from "react";
import { AsciiBox, MatrixButton, MatrixInput, SignalBox } from "@/components/ui";
import { useControlsViewModel } from "@/viewmodels/useControlsViewModel";
import { cn } from "@/lib/utils";

// ── Section wrapper ─────────────────────────────
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

export default function ControlsPage() {
  const vm = useControlsViewModel();
  const [hoverCardVisible, setHoverCardVisible] = useState(false);
  const [menubarOpen, setMenubarOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* ── Page header ─────────────────────────── */}
      <AsciiBox
        title="CONTROLS"
        subtitle="core patterns"
        headerRight={
          <MatrixButton size="small" onClick={() => vm.fireToast("success", "SIGNAL TRANSMITTED")}>
            TRIGGER TOAST
          </MatrixButton>
        }
      >
        <p className="text-xs font-mono text-matrix-muted">
          Full control library showcasing every interactive primitive. Matrix-styled inputs, toggles,
          selectors, overlays, menus, and compound components — all wired to a shared viewmodel.
        </p>
      </AsciiBox>

      {/* ── Row 1: Inputs + Toggles ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="INPUTS">
          <div className="space-y-3">
            <MatrixInput label="Full Name" placeholder="Enter your alias..." />
            <div className="relative">
              <MatrixInput label="Email" placeholder="neo@matrix.zion" type="email" />
              <span className="absolute right-3 top-8 text-matrix-dim font-mono text-xs">@</span>
            </div>
            <div className="relative">
              <MatrixInput label="Password" placeholder="********" type="password" />
              <span className="absolute right-3 top-8 text-matrix-dim font-mono text-xs">[*]</span>
            </div>
          </div>
        </Section>

        <Section title="TOGGLES & CHECKS">
          <div className="space-y-4">
            {/* Switch A */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-mono text-matrix-muted uppercase">Enable alerts</span>
              <button
                onClick={() => vm.setSwitchA(!vm.switchA)}
                className={cn(
                  "relative w-10 h-5 border transition-colors",
                  vm.switchA
                    ? "bg-matrix-primary/30 border-matrix-primary"
                    : "bg-matrix-panel-strong border-matrix-ghost"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-4 h-4 transition-all",
                    vm.switchA
                      ? "left-5 bg-matrix-primary shadow-[0_0_8px_rgba(0,255,65,0.6)]"
                      : "left-0.5 bg-matrix-dim"
                  )}
                />
              </button>
            </label>
            {/* Switch B */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs font-mono text-matrix-muted uppercase">Auto-sync data</span>
              <button
                onClick={() => vm.setSwitchB(!vm.switchB)}
                className={cn(
                  "relative w-10 h-5 border transition-colors",
                  vm.switchB
                    ? "bg-matrix-primary/30 border-matrix-primary"
                    : "bg-matrix-panel-strong border-matrix-ghost"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-4 h-4 transition-all",
                    vm.switchB
                      ? "left-5 bg-matrix-primary shadow-[0_0_8px_rgba(0,255,65,0.6)]"
                      : "left-0.5 bg-matrix-dim"
                  )}
                />
              </button>
            </label>
            {/* Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <button
                onClick={() => vm.setCheckbox(!vm.checkbox)}
                className={cn(
                  "w-4 h-4 border flex items-center justify-center transition-colors",
                  vm.checkbox
                    ? "bg-matrix-primary border-matrix-primary"
                    : "bg-matrix-panel border-matrix-ghost hover:border-matrix-dim"
                )}
              >
                {vm.checkbox && <span className="text-black text-[10px] font-bold">✓</span>}
              </button>
              <span className="text-xs font-mono text-matrix-muted uppercase">Remember preferences</span>
            </label>
          </div>
        </Section>
      </div>

      {/* ── Row 2: Select + Slider + Tabs ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="SELECT">
          <div className="relative">
            <label className="text-xs font-mono text-matrix-muted uppercase font-bold block mb-2">Protocol</label>
            <select
              value={vm.selectValue}
              onChange={(e) => vm.setSelectValue(e.target.value)}
              className="w-full h-10 bg-matrix-panel border border-matrix-ghost px-3 text-sm font-mono text-matrix-bright outline-none focus:border-matrix-primary appearance-none cursor-pointer"
            >
              <option value="standard">STANDARD</option>
              <option value="growth">GROWTH</option>
              <option value="enterprise">ENTERPRISE</option>
            </select>
            <span className="absolute right-3 bottom-3 text-matrix-dim font-mono text-xs pointer-events-none">▼</span>
          </div>
        </Section>

        <Section title="SLIDER">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-mono text-matrix-dim uppercase">Signal strength</span>
                <span className="text-xs font-mono text-matrix-primary">{vm.sliderValue}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={vm.sliderValue}
                onChange={(e) => vm.setSliderValue(Number(e.target.value))}
                className="w-full h-1 bg-matrix-ghost appearance-none cursor-pointer accent-[#00ff41]"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-mono text-matrix-dim uppercase">Power level</span>
                <span className="text-xs font-mono text-yellow-400">{vm.sliderValue2}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={vm.sliderValue2}
                onChange={(e) => vm.setSliderValue2(Number(e.target.value))}
                className="w-full h-1 bg-matrix-ghost appearance-none cursor-pointer accent-yellow-400"
              />
            </div>
          </div>
        </Section>

        <Section title="TABS">
          <div>
            <div className="flex border-b border-matrix-ghost">
              {["summary", "details"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => vm.setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-xs font-mono uppercase font-bold transition-colors",
                    vm.activeTab === tab
                      ? "text-matrix-primary border-b-2 border-matrix-primary"
                      : "text-matrix-dim hover:text-matrix-muted"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="pt-3 text-xs font-mono text-matrix-muted">
              {vm.activeTab === "summary"
                ? ">> Neural link summary: all systems nominal. 42 active connections."
                : ">> Detailed analysis: latency 12ms, bandwidth 847Mbps, uptime 99.97%."}
            </div>
          </div>
        </Section>
      </div>

      {/* ── Row 3: Progress + Radio + Hover Card ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="PROGRESS">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-mono text-matrix-dim uppercase">Upload</span>
                <span className="text-xs font-mono text-matrix-primary">{vm.progress1}%</span>
              </div>
              <div className="w-full h-2 bg-matrix-panel-strong border border-matrix-ghost overflow-hidden">
                <div
                  className="h-full bg-matrix-primary transition-all shadow-[0_0_8px_rgba(0,255,65,0.4)]"
                  style={{ width: `${vm.progress1}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-mono text-matrix-dim uppercase">Processing</span>
                <span className="text-xs font-mono text-yellow-400">{vm.progress2}%</span>
              </div>
              <div className="w-full h-2 bg-matrix-panel-strong border border-matrix-ghost overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all shadow-[0_0_8px_rgba(255,215,0,0.4)]"
                  style={{ width: `${vm.progress2}%` }}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title="RADIO GROUP">
          <div className="space-y-3">
            {["monthly", "annual", "enterprise"].map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <button
                  onClick={() => vm.setRadioValue(opt)}
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    vm.radioValue === opt
                      ? "border-matrix-primary"
                      : "border-matrix-ghost hover:border-matrix-dim"
                  )}
                >
                  {vm.radioValue === opt && (
                    <span className="w-2 h-2 rounded-full bg-matrix-primary shadow-[0_0_6px_rgba(0,255,65,0.6)]" />
                  )}
                </button>
                <span className="text-xs font-mono text-matrix-muted uppercase">{opt}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="HOVER CARD">
          <div className="relative">
            <button
              className="text-xs font-mono text-matrix-primary underline underline-offset-4 decoration-matrix-ghost hover:decoration-matrix-primary transition-colors"
              onMouseEnter={() => setHoverCardVisible(true)}
              onMouseLeave={() => setHoverCardVisible(false)}
            >
              [HOVER FOR DETAILS]
            </button>
            {hoverCardVisible && (
              <div className="absolute top-8 left-0 z-20 matrix-panel p-3 w-64 border border-matrix-primary/30 shadow-[0_0_20px_rgba(0,255,65,0.15)]">
                <p className="text-xs font-mono text-matrix-primary font-bold mb-1">MATRIX SYSTEMS</p>
                <p className="text-xs font-mono text-matrix-dim">
                  Neural interface framework. Active since 2026. Processing 1.2M daily operations.
                </p>
              </div>
            )}
          </div>
        </Section>
      </div>

      {/* ── Row 4: Alerts + Badges + Tags ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="ALERTS">
          <div className="space-y-3">
            <div className="border border-yellow-500/30 bg-yellow-500/5 p-3">
              <p className="text-xs font-mono text-yellow-400 font-bold">⚠ SYSTEM WARNING</p>
              <p className="text-xs font-mono text-matrix-dim mt-1">Memory allocation at 80% capacity. Consider optimizing.</p>
            </div>
            <div className="border border-blue-500/30 bg-blue-500/5 p-3">
              <p className="text-xs font-mono text-blue-400 font-bold">◈ MAINTENANCE</p>
              <p className="text-xs font-mono text-matrix-dim mt-1">Scheduled downtime: 2026-02-15 03:00 UTC.</p>
            </div>
          </div>
        </Section>

        <Section title="BADGES">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-green-500/20 text-green-400 border border-green-500/30">ACTIVE</span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">PENDING</span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">BLOCKED</span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-matrix-panel-strong text-matrix-dim border border-matrix-ghost">NEUTRAL</span>
          </div>
        </Section>

        <Section title="TAGS">
          <div className="flex flex-wrap gap-2">
            {["NEURAL", "QUANTUM", "CIPHER", "FLUX"].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-matrix-muted border border-matrix-ghost hover:border-matrix-dim hover:text-matrix-primary transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </Section>
      </div>

      {/* ── Row 5: Dialog + Command Palette ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="DIALOG">
          <MatrixButton onClick={() => vm.setDialogOpen(true)}>
            OPEN DIALOG
          </MatrixButton>
          <p className="text-xs font-mono text-matrix-dim mt-2">
            Modal dialog with form fields and actions.
          </p>
        </Section>

        <Section title="COMMAND PALETTE">
          <MatrixButton onClick={() => vm.setCommandOpen(true)}>
            OPEN COMMAND [⌘K]
          </MatrixButton>
          <p className="text-xs font-mono text-matrix-dim mt-2">
            Quick-access command palette with search.
          </p>
        </Section>
      </div>

      {/* ── Row 6: Dropdown + Popover + Menubar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="DROPDOWN MENU">
          <div className="relative">
            <MatrixButton size="small" onClick={() => vm.setDropdownOpen(!vm.dropdownOpen)}>
              OPTIONS ▼
            </MatrixButton>
            {vm.dropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => vm.setDropdownOpen(false)} />
                <div className="absolute top-10 left-0 z-40 matrix-panel border border-matrix-primary/30 py-1 min-w-[160px]">
                  {["PROFILE", "TEAM"].map((item) => (
                    <button
                      key={item}
                      onClick={() => vm.setDropdownOpen(false)}
                      className="w-full text-left px-3 py-1.5 text-xs font-mono text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                  <div className="border-t border-matrix-ghost my-1" />
                  <button
                    onClick={() => vm.setDropdownOpen(false)}
                    className="w-full text-left px-3 py-1.5 text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    LOGOUT
                  </button>
                </div>
              </>
            )}
          </div>
        </Section>

        <Section title="POPOVER">
          <div className="relative">
            <MatrixButton size="small" onClick={() => vm.setPopoverOpen(!vm.popoverOpen)}>
              VIEW DETAILS
            </MatrixButton>
            {vm.popoverOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => vm.setPopoverOpen(false)} />
                <div className="absolute top-10 left-0 z-40 matrix-panel border border-matrix-primary/30 p-3 w-56">
                  <p className="text-xs font-mono text-matrix-primary font-bold mb-1">RELEASE SCHEDULE</p>
                  <p className="text-xs font-mono text-matrix-dim">Next deployment: 2026-02-20. All modules staged for release.</p>
                </div>
              </>
            )}
          </div>
        </Section>

        <Section title="MENUBAR">
          <div className="flex border border-matrix-ghost overflow-hidden">
            {[
              { label: "FILE", items: ["NEW", "DUPLICATE", "SHARE"] },
              { label: "EDIT", items: ["UNDO", "REDO"] },
            ].map((menu) => (
              <div key={menu.label} className="relative">
                <button
                  onClick={() => setMenubarOpen(menubarOpen === menu.label ? null : menu.label)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors",
                    menubarOpen === menu.label
                      ? "bg-matrix-primary/10 text-matrix-primary"
                      : "text-matrix-muted hover:text-matrix-primary"
                  )}
                >
                  {menu.label}
                </button>
                {menubarOpen === menu.label && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setMenubarOpen(null)} />
                    <div className="absolute top-full left-0 z-40 matrix-panel border border-matrix-primary/30 py-1 min-w-[120px]">
                      {menu.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => setMenubarOpen(null)}
                          className="w-full text-left px-3 py-1.5 text-xs font-mono text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── Row 7: Context Menu ────────────────── */}
      <Section title="CONTEXT MENU">
        <div
          onContextMenu={vm.handleContextMenu}
          className="border border-dashed border-matrix-ghost p-6 text-center cursor-context-menu"
        >
          <p className="text-xs font-mono text-matrix-dim uppercase">Right-click this area</p>
        </div>
        {vm.contextMenuOpen && (
          <>
            <div className="fixed inset-0 z-50" onClick={() => vm.setContextMenuOpen(false)} />
            <div
              className="fixed z-50 matrix-panel border border-matrix-primary/30 py-1 min-w-[140px]"
              style={{ top: vm.contextMenuPos.y, left: vm.contextMenuPos.x }}
            >
              {["RENAME", "DUPLICATE", "ARCHIVE"].map((item) => (
                <button
                  key={item}
                  onClick={() => vm.setContextMenuOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-xs font-mono text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* ── Row 8: Tooltip ─────────────────────── */}
      <Section title="TOOLTIP">
        <div className="flex flex-wrap gap-3">
          {[
            { label: "HOVER ME", tip: "This is a tooltip message" },
            { label: "PRICING", tip: "Starts at $0.01 per 1K tokens" },
            { label: "SECURITY", tip: "256-bit AES encryption enabled" },
          ].map((item) => (
            <div key={item.label} className="group relative">
              <MatrixButton size="small">{item.label}</MatrixButton>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 matrix-panel border border-matrix-primary/30 text-[10px] font-mono text-matrix-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.tip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-matrix-primary/30" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Row 9: Accordion ───────────────────── */}
      <Section title="ACCORDION">
        <div className="divide-y divide-matrix-ghost">
          {[
            { id: "billing", title: "BILLING DETAILS", content: "Current plan: ENTERPRISE. Next invoice: $4,200.00 on 2026-03-01. Payment method: Neural transfer." },
            { id: "security", title: "SECURITY PROTOCOLS", content: "2FA enabled. Last audit: 2026-01-28. No vulnerabilities detected. Encryption: AES-256." },
            { id: "api", title: "API LIMITS", content: "Rate limit: 10,000 req/min. Current usage: 4,247 req/min. Burst capacity: 15,000 req/min." },
          ].map((item) => (
            <div key={item.id}>
              <button
                onClick={() => vm.setAccordionOpen(vm.accordionOpen === item.id ? null : item.id)}
                className="w-full flex items-center justify-between py-3 text-xs font-mono font-bold uppercase text-matrix-muted hover:text-matrix-primary transition-colors"
              >
                <span>{item.title}</span>
                <span className="text-matrix-dim">{vm.accordionOpen === item.id ? "▲" : "▼"}</span>
              </button>
              {vm.accordionOpen === item.id && (
                <div className="pb-3 text-xs font-mono text-matrix-dim">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Row 10: Alert Dialog ───────────────── */}
      <Section title="ALERT DIALOG">
        <MatrixButton
          onClick={() => vm.setAlertDialogOpen(true)}
          className="!bg-red-500/10 !border-red-500/30 !text-red-400 hover:!bg-red-500/20"
        >
          DELETE PROJECT
        </MatrixButton>
        <p className="text-xs font-mono text-matrix-dim mt-2">
          Destructive action with confirmation prompt.
        </p>
      </Section>

      {/* ── Row 11: Toggle + Toggle Group ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="TOGGLE">
          <div className="flex gap-2">
            <button
              onClick={() => vm.setToggleBold(!vm.toggleBold)}
              className={cn(
                "px-3 py-2 text-xs font-mono font-bold uppercase border transition-colors",
                vm.toggleBold
                  ? "bg-matrix-primary/20 border-matrix-primary text-matrix-primary"
                  : "bg-matrix-panel border-matrix-ghost text-matrix-muted hover:border-matrix-dim"
              )}
            >
              B
            </button>
            <button
              onClick={() => vm.setToggleItalic(!vm.toggleItalic)}
              className={cn(
                "px-3 py-2 text-xs font-mono italic uppercase border transition-colors",
                vm.toggleItalic
                  ? "bg-matrix-primary/20 border-matrix-primary text-matrix-primary"
                  : "bg-matrix-panel border-matrix-ghost text-matrix-muted hover:border-matrix-dim"
              )}
            >
              I
            </button>
          </div>
        </Section>

        <Section title="TOGGLE GROUP">
          <div className="inline-flex border border-matrix-ghost overflow-hidden">
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                onClick={() => vm.setToggleAlign(align)}
                className={cn(
                  "px-4 py-2 text-xs font-mono uppercase font-bold transition-colors border-r border-matrix-ghost last:border-r-0",
                  vm.toggleAlign === align
                    ? "bg-matrix-primary/20 text-matrix-primary"
                    : "text-matrix-muted hover:text-matrix-primary hover:bg-matrix-primary/5"
                )}
              >
                {align}
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* ── Summary card ───────────────────────── */}
      <SignalBox title="FORM SUMMARY">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-matrix-muted">12 components ready for deployment.</p>
          </div>
          <MatrixButton primary>PUBLISH</MatrixButton>
        </div>
      </SignalBox>

      {/* ═══════════════════════════════════════════ */}
      {/* MODALS                                      */}
      {/* ═══════════════════════════════════════════ */}

      {/* Dialog */}
      {vm.dialogOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => vm.setDialogOpen(false)} />
          <div className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-md">
            <AsciiBox title="INVITE COLLABORATOR">
              <div className="space-y-3">
                <MatrixInput label="Email" placeholder="operator@zion.net" type="email" />
                <div>
                  <label className="text-xs font-mono text-matrix-muted uppercase font-bold block mb-2">Role</label>
                  <select className="w-full h-10 bg-matrix-panel border border-matrix-ghost px-3 text-sm font-mono text-matrix-bright outline-none focus:border-matrix-primary appearance-none">
                    <option>OPERATOR</option>
                    <option>VIEWER</option>
                    <option>ADMIN</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <MatrixButton onClick={() => vm.setDialogOpen(false)}>CANCEL</MatrixButton>
                  <MatrixButton primary onClick={() => vm.setDialogOpen(false)}>SEND</MatrixButton>
                </div>
              </div>
            </AsciiBox>
          </div>
        </>
      )}

      {/* Command palette */}
      {vm.commandOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => vm.setCommandOpen(false)} />
          <div className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-md">
            <div className="matrix-panel border border-matrix-primary/30">
              <div className="flex items-center gap-2 border-b border-matrix-primary/20 px-3 py-2">
                <span className="text-matrix-dim font-mono text-xs">$</span>
                <input
                  autoFocus
                  type="text"
                  placeholder="type a command..."
                  className="flex-1 bg-transparent font-mono text-sm text-matrix-primary placeholder:text-matrix-dim outline-none"
                />
                <kbd className="border border-matrix-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-matrix-dim">ESC</kbd>
              </div>
              <div className="py-1">
                <p className="px-3 py-1 text-[10px] font-mono text-matrix-dim uppercase">Suggestions</p>
                {[
                  { label: "New workspace", shortcut: "⌘N" },
                  { label: "Settings", shortcut: "⌘," },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => vm.setCommandOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-mono text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary transition-colors"
                  >
                    <span>{item.label}</span>
                    <kbd className="text-[10px] text-matrix-dim">{item.shortcut}</kbd>
                  </button>
                ))}
                <p className="px-3 py-1 text-[10px] font-mono text-matrix-dim uppercase mt-1">Templates</p>
                {["Dashboard", "Billing"].map((item) => (
                  <button
                    key={item}
                    onClick={() => vm.setCommandOpen(false)}
                    className="w-full text-left px-3 py-1.5 text-xs font-mono text-matrix-muted hover:bg-matrix-primary/10 hover:text-matrix-primary transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Alert dialog */}
      {vm.alertDialogOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <div className="fixed inset-x-4 top-[25%] z-50 mx-auto max-w-sm">
            <div className="matrix-panel border border-red-500/30 p-5">
              <p className="text-sm font-mono text-matrix-bright font-bold mb-2">DELETE PROJECT?</p>
              <p className="text-xs font-mono text-matrix-dim mb-4">
                This action is irreversible. All data, configurations, and deployment history will be permanently erased.
              </p>
              <div className="flex justify-end gap-2">
                <MatrixButton onClick={() => vm.setAlertDialogOpen(false)}>CANCEL</MatrixButton>
                <MatrixButton
                  onClick={() => vm.setAlertDialogOpen(false)}
                  className="!bg-red-500/20 !border-red-500/40 !text-red-400 hover:!bg-red-500/30"
                >
                  DELETE
                </MatrixButton>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {vm.toastMessage && (
        <div
          className="fixed bottom-8 right-8 z-50 matrix-panel p-4 max-w-sm cursor-pointer border-l-2"
          style={{
            borderLeftColor: vm.toastMessage.tone === "success" ? "#00ff41"
              : vm.toastMessage.tone === "error" ? "#ff4141"
              : vm.toastMessage.tone === "warning" ? "#ffd700"
              : "#3b82f6",
          }}
          onClick={() => vm.fireToast("success", "")}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                vm.toastMessage.tone === "success" && "bg-matrix-primary",
                vm.toastMessage.tone === "error" && "bg-red-500",
                vm.toastMessage.tone === "warning" && "bg-yellow-500",
                vm.toastMessage.tone === "info" && "bg-blue-500",
              )}
            />
            <span className="text-xs font-mono text-matrix-bright">{vm.toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
