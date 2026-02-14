// ============================================
// Data Display Page — Data display & passive content
// Matrix cyberpunk style replica of Basalt's DataDisplayPage.
// ============================================

import { AsciiBox, MatrixAvatar, DataRow } from "@/components/ui";
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

export default function DataDisplayPage() {
  const vm = useControlsViewModel();

  return (
    <div className="space-y-4">
      <AsciiBox title="DATA DISPLAY" subtitle="passive content">
        <p className="text-xs font-mono text-matrix-muted">
          Avatars, badges, stat tiles, timeline, list items, and key-value displays —
          all passive data presentation patterns in Matrix style.
        </p>
      </AsciiBox>

      {/* ── Avatars ──────────────────────────── */}
      <Section title="AVATARS">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Sizes</p>
            <div className="flex items-end gap-4">
              {[
                { name: "neo", size: 24 },
                { name: "morpheus", size: 32 },
                { name: "trinity", size: 40 },
                { name: "oracle", size: 48 },
                { name: "architect", size: 56 },
              ].map((a) => (
                <div key={a.size} className="flex flex-col items-center gap-1">
                  <MatrixAvatar name={a.name} size={a.size} />
                  <span className="text-[10px] font-mono text-matrix-dim">{a.size}px</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Fallbacks</p>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 border border-matrix-ghost bg-matrix-panel flex items-center justify-center font-mono text-xs text-matrix-muted">NE</div>
                <span className="text-[10px] font-mono text-matrix-dim">Plain</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 border border-matrix-primary/30 bg-matrix-primary/10 flex items-center justify-center font-mono text-xs text-matrix-primary">MO</div>
                <span className="text-[10px] font-mono text-matrix-dim">Primary</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 border border-green-500/30 bg-green-500/10 flex items-center justify-center font-mono text-xs text-green-400">TR</div>
                <span className="text-[10px] font-mono text-matrix-dim">Green</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-center font-mono text-xs text-yellow-400">OR</div>
                <span className="text-[10px] font-mono text-matrix-dim">Amber</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Stacked group</p>
            <div className="flex items-center">
              {["neo", "morpheus", "trinity", "oracle", "tank"].map((name, i) => (
                <div key={name} className="hover:z-20" style={{ zIndex: 5 - i, marginLeft: i === 0 ? 0 : -8 }}>
                  <MatrixAvatar name={name} size={32} className="border-2 border-[var(--matrix-bg)]" />
                </div>
              ))}
              <div className="w-8 h-8 border-2 border-[var(--matrix-bg)] bg-matrix-panel-strong flex items-center justify-center font-mono text-[10px] text-matrix-dim" style={{ zIndex: 0, marginLeft: -8 }}>
                +3
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Badges ───────────────────────────── */}
      <Section title="BADGES">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Variants</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-matrix-primary text-black">DEFAULT</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-matrix-panel-strong text-matrix-muted border border-matrix-ghost">SECONDARY</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-500 text-black">DESTRUCTIVE</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-matrix-ghost text-matrix-muted">OUTLINE</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">Semantic colors</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-green-500/15 text-green-400 border border-green-500/30">ACTIVE</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">PENDING</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30">FAILED</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">INFO</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">BETA</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-matrix-dim uppercase mb-3">With dot indicator</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "ONLINE", color: "bg-green-400", textColor: "text-green-400" },
                { label: "AWAY", color: "bg-yellow-400", textColor: "text-yellow-400" },
                { label: "BUSY", color: "bg-red-400", textColor: "text-red-400" },
                { label: "OFFLINE", color: "bg-matrix-dim", textColor: "text-matrix-dim" },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-matrix-ghost">
                  <span className={cn("w-1.5 h-1.5 rounded-full", b.color)} />
                  <span className={b.textColor}>{b.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Stat Tiles ───────────────────────── */}
      <Section title="STAT TILES">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {vm.kpis.map((kpi) => (
            <div key={kpi.label} className="border border-matrix-ghost p-3">
              <p className="text-[10px] font-mono text-matrix-dim uppercase mb-1">{kpi.label}</p>
              <p className="text-lg font-mono font-bold text-matrix-primary">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className={cn(
                  "text-[10px] font-mono font-bold",
                  kpi.trend === "up" && "text-green-400",
                  kpi.trend === "down" && "text-red-400",
                  kpi.trend === "flat" && "text-matrix-dim",
                )}>
                  {kpi.trend === "up" ? "▲" : kpi.trend === "down" ? "▼" : "─"} {kpi.change}
                </span>
                <span className="text-[10px] font-mono text-matrix-dim">vs last month</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Timeline ─────────────────────────── */}
      <Section title="TIMELINE">
        <div className="relative">
          {vm.timeline.map((event, i) => (
            <div key={event.id} className="flex gap-3 pb-4 last:pb-0">
              {/* Vertical line + dot */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-3 h-3 rounded-full border-2 shrink-0",
                  event.status === "success" && "bg-green-500/20 border-green-500",
                  event.status === "info" && "bg-blue-500/20 border-blue-500",
                  event.status === "warning" && "bg-yellow-500/20 border-yellow-500",
                  event.status === "special" && "bg-purple-500/20 border-purple-500",
                  event.status === "primary" && "bg-matrix-primary/20 border-matrix-primary",
                )} />
                {i < vm.timeline.length - 1 && (
                  <div className="w-px flex-1 bg-matrix-ghost mt-1" />
                )}
              </div>
              {/* Content */}
              <div className="pb-2">
                <p className="text-xs font-mono text-matrix-primary font-bold">{event.title}</p>
                <p className="text-[10px] font-mono text-matrix-dim">{event.description}</p>
                <p className="text-[10px] font-mono text-matrix-ghost mt-0.5">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── List Items + Key-Value ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="LIST ITEMS">
          <div className="space-y-0">
            {vm.people.map((person) => (
              <div key={person.name} className="flex items-center gap-3 py-2 border-b border-matrix-ghost last:border-b-0 hover:bg-matrix-panel transition-colors px-2">
                <MatrixAvatar name={person.name} size={28} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-matrix-primary font-bold uppercase truncate">{person.name}</p>
                  <p className="text-[10px] font-mono text-matrix-dim truncate">{person.email}</p>
                </div>
                <span className={cn(
                  "flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold uppercase",
                  person.status === "active"
                    ? "text-green-400 bg-green-500/10 border border-green-500/20"
                    : "text-matrix-dim bg-matrix-panel border border-matrix-ghost"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", person.status === "active" ? "bg-green-400" : "bg-matrix-dim")} />
                  {person.status}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="KEY-VALUE DISPLAY">
          <div className="space-y-0">
            {vm.keyValues.map((kv) => (
              <DataRow key={kv.key} label={kv.key} value={kv.value} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
