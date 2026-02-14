// ============================================
// VibeUsage Components - Ported from vibeusage
// Business-specific panels and views
// ============================================

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { AsciiBox } from "./AsciiBox";
import { MatrixButton } from "./MatrixButton";
import {
  MatrixAvatar,
  ScrambleText,
  SignalBox,
  LiveSniffer,
  ConnectionStatus,
} from "./MatrixExtras";

// ============================================
// Constants
// ============================================

const COLORS = {
  MATRIX: "#00FF41",
  GOLD: "#FFD700",
  DARK: "#050505",
};

const TEXTURES = [
  { bg: `${COLORS.MATRIX}99`, pattern: "none" },
  {
    bg: "transparent",
    pattern: `repeating-linear-gradient(45deg, transparent, transparent 2px, ${COLORS.MATRIX}33 2px, ${COLORS.MATRIX}33 4px)`,
  },
  {
    bg: "transparent",
    pattern: `radial-gradient(${COLORS.MATRIX}33 1px, transparent 1px)`,
    size: "4px 4px",
  },
  {
    bg: "transparent",
    pattern: `linear-gradient(90deg, ${COLORS.MATRIX}1A 1px, transparent 1px)`,
    size: "3px 100%",
  },
];

// ============================================
// BackendStatus - Backend health indicator
// ============================================

interface BackendStatusProps {
  status?: "active" | "down" | "checking";
  host?: string;
  className?: string;
}

export function BackendStatus({
  status = "active",
  host,
  className = "",
}: BackendStatusProps) {
  const uiStatus = useMemo(() => {
    if (status === "active") return "STABLE" as const;
    if (status === "down") return "LOST" as const;
    return "UNSTABLE" as const;
  }, [status]);

  const title = useMemo(() => {
    const parts = [`status=${status}`];
    if (host) parts.push(`host=${host}`);
    return parts.join(" • ");
  }, [status, host]);

  return <ConnectionStatus status={uiStatus} title={title} className={className} />;
}

// ============================================
// SystemHeader - System header with status
// ============================================

interface SystemHeaderProps {
  title?: string;
  signalLabel?: string;
  time?: string;
  className?: string;
}

export function SystemHeader({
  title = "SYSTEM",
  signalLabel,
  time,
  className = "",
}: SystemHeaderProps) {
  return (
    <header
      className={`flex justify-between border-b border-matrix-ghost p-4 items-center shrink-0 bg-matrix-panel ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-matrix-primary text-black px-2 py-1 font-black text-heading uppercase skew-x-[-10deg] border border-matrix-primary shadow-[0_0_10px_#00FF41]">
          {title}
        </div>
        {signalLabel && (
          <span className="text-caption text-matrix-muted hidden sm:inline font-bold uppercase animate-pulse">
            {signalLabel}
          </span>
        )}
      </div>
      {time && (
        <div className="text-matrix-primary font-bold text-body tracking-widest">
          {time}
        </div>
      )}
    </header>
  );
}

// ============================================
// IdentityPanel - User identity display
// ============================================

interface IdentityPanelProps {
  name?: string;
  streakDays?: number;
  rankLabel?: string;
}

export function IdentityPanel({
  name = "UNKNOWN",
  streakDays = 0,
  rankLabel,
}: IdentityPanelProps) {
  const handle = useMemo(() => {
    const raw = name?.trim();
    const safe = raw && !raw.includes("@") ? raw : "USER";
    return safe.replace(/[^a-zA-Z0-9._-]/g, "_");
  }, [name]);

  const rankValue = rankLabel ?? "\u2014";
  const streakValue = Number.isFinite(Number(streakDays)) ? `${streakDays}d` : "\u2014";

  return (
    <div className="flex items-center space-x-6">
      <div className="relative group">
        <div className="w-20 h-20 border border-matrix-ghost flex items-center justify-center text-body font-black bg-matrix-panel shadow-[0_0_15px_rgba(0,255,65,0.1)]">
          ID
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white text-black text-caption px-1 font-black uppercase">
          LV1
        </div>
      </div>

      <div className="space-y-3 flex-1 min-w-0">
        <div className="border-l-2 border-matrix-primary pl-3 py-2 bg-matrix-panel">
          <div className="text-2xl md:text-3xl font-black text-matrix-bright tracking-tight leading-none uppercase truncate">
            {handle}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-matrix-panel p-2 border border-matrix-ghost text-center">
            <div className="text-caption text-matrix-muted uppercase font-bold">RANK</div>
            <div className="text-matrix-primary font-black text-body">{rankValue}</div>
          </div>
          <div className="bg-matrix-panel p-2 border border-matrix-ghost text-center">
            <div className="text-caption text-matrix-muted uppercase font-bold">STREAK</div>
            <div className="text-gold font-black tracking-tight text-body">{streakValue}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// IdentityCard - Compact identity card
// ============================================

interface IdentityCardProps {
  name?: string;
  avatarUrl?: string;
  isPublic?: boolean;
  onDecrypt?: () => void;
  title?: string;
  subtitle?: string;
  rankLabel?: string;
  streakDays?: number;
  showStats?: boolean;
  animateTitle?: boolean;
  scanlines?: boolean;
  className?: string;
  avatarSize?: number;
  animate?: boolean;
}

export function IdentityCard({
  name = "UNKNOWN",
  avatarUrl,
  isPublic = false,
  onDecrypt,
  title = "IDENTITY",
  subtitle,
  rankLabel,
  streakDays,
  showStats = true,
  animateTitle = true,
  scanlines = true,
  className = "",
  avatarSize = 80,
  animate = true,
}: IdentityCardProps) {
  const displayName = isPublic ? name : "??????";
  const avatarName = isPublic ? name : "unknown";
  const [avatarFailed, setAvatarFailed] = useState(false);
  const safeAvatarUrl = typeof avatarUrl === "string" ? avatarUrl.trim() : "";
  const showAvatar = isPublic && safeAvatarUrl && !avatarFailed;
  const rankValue = rankLabel ?? "\u2014";
  const streakValue = Number.isFinite(Number(streakDays)) ? `${streakDays}d` : "\u2014";
  const shouldShowStats = showStats && (rankLabel !== undefined || streakDays !== undefined);

  useEffect(() => {
    setAvatarFailed(false);
  }, [safeAvatarUrl]);

  const titleNode = typeof title === "string" && animateTitle ? (
    <ScrambleText text={title} durationMs={2200} startScrambled />
  ) : (
    title
  );

  return (
    <AsciiBox title={titleNode} subtitle={subtitle} className={className}>
      <div className="relative overflow-hidden">
        {scanlines && (
          <>
            <div className="pointer-events-none absolute inset-0 matrix-scanlines opacity-30 mix-blend-screen" />
            <div className="pointer-events-none absolute inset-0 matrix-scan-sweep opacity-20" />
          </>
        )}

        <div className="relative z-10 flex items-center space-x-6 px-2">
          {showAvatar ? (
            <div
              style={{ width: avatarSize, height: avatarSize }}
              className="relative p-1 bg-matrix-panel-strong border border-matrix-dim overflow-hidden"
            >
              <img
                src={safeAvatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={() => setAvatarFailed(true)}
              />
            </div>
          ) : (
            <MatrixAvatar name={avatarName} isAnon={!isPublic} size={avatarSize} />
          )}

          <div className="flex-1 space-y-2">
            <div>
              <div className="text-2xl md:text-3xl font-black text-matrix-bright tracking-tight leading-none">
                {animate ? (
                  <ScrambleText text={displayName} durationMs={2200} startScrambled />
                ) : (
                  displayName
                )}
              </div>
            </div>

            {!isPublic && onDecrypt && (
              <button
                type="button"
                onClick={onDecrypt}
                className="text-caption text-black bg-matrix-primary px-3 py-1 font-bold uppercase hover:bg-white transition-colors"
              >
                DECRYPT
              </button>
            )}

            {shouldShowStats && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-matrix-panel p-2 border border-matrix-ghost text-center">
                  <div className="text-caption text-matrix-muted uppercase font-bold">RANK</div>
                  <div className="text-gold font-black text-body">{rankValue}</div>
                </div>
                <div className="bg-matrix-panel p-2 border border-matrix-ghost text-center">
                  <div className="text-caption text-matrix-muted uppercase font-bold">STREAK</div>
                  <div className="text-gold font-black tracking-tight text-body">{streakValue}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AsciiBox>
  );
}

// ============================================
// TopModelsPanel - AI models usage ranking
// ============================================

interface TopModelRow {
  id?: string;
  name: string;
  percent: string | number;
}

interface TopModelsPanelProps {
  rows?: TopModelRow[];
  className?: string;
}

export const TopModelsPanel = React.memo(function TopModelsPanel({
  rows = [],
  className = "",
}: TopModelsPanelProps) {
  const displayRows = Array.from({ length: 3 }, (_, index) => {
    const row = rows[index];
    if (row) return { ...row, empty: false };
    return { id: "", name: "", percent: "", empty: true };
  });

  return (
    <AsciiBox title="TOP MODELS" subtitle="usage" className={className} bodyClassName="py-3">
      <div className="flex flex-col gap-2">
        {displayRows.map((row, index) => {
          const rankLabel = String(index + 1).padStart(2, "0");
          const isEmpty = Boolean(row?.empty);
          const name = isEmpty ? "" : row?.name ? String(row.name) : "\u2014";
          const percent = isEmpty ? "" : row?.percent ? String(row.percent) : "\u2014";
          const showPercentSymbol = !isEmpty && percent !== "\u2014";
          const rowKey = row?.id ? String(row.id) : `${name}-${index}`;

          return (
            <div
              key={rowKey}
              className="flex items-center justify-between border-b border-matrix-ghost py-2 px-2 last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-caption text-matrix-dim font-bold tracking-[0.28em]">
                  {rankLabel}
                </span>
                <span
                  className="text-body font-black text-matrix-primary uppercase truncate"
                  title={name}
                >
                  {name}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-body font-black text-matrix-primary">{percent}</span>
                {showPercentSymbol && (
                  <span className="text-caption text-matrix-primary font-bold">%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AsciiBox>
  );
});

// ============================================
// LeaderboardPanel - Full leaderboard container
// ============================================

interface LeaderboardPanelRow {
  rank: number;
  name: string;
  value: string | number;
  isAnon?: boolean;
  isSelf?: boolean;
  isTheOne?: boolean;
}

interface LeaderboardPanelSummary {
  totalLabel?: string;
  totalValue?: string;
  sinceLabel?: string;
  stats?: Array<{ label: string; value: string }>;
}

interface LeaderboardPanelProps {
  title?: string;
  period?: string;
  periods?: Array<{ key: string; label: string }>;
  onPeriodChange?: (period: string) => void;
  rows?: LeaderboardPanelRow[];
  summary?: LeaderboardPanelSummary;
  summaryPeriod?: string;
  loadMoreLabel?: string;
  onLoadMore?: () => void;
  className?: string;
}

export function LeaderboardPanel({
  title = "LEADERBOARD",
  period = "ALL",
  periods = [
    { key: "24H", label: "24H" },
    { key: "ALL", label: "ALL TIME" },
  ],
  onPeriodChange,
  rows = [],
  summary,
  summaryPeriod = "ALL",
  loadMoreLabel = "Load more...",
  onLoadMore,
  className = "",
}: LeaderboardPanelProps) {
  const showSummary = summary && period === summaryPeriod;
  const stats = Array.isArray(summary?.stats) ? summary.stats : [];

  return (
    <AsciiBox title={title} className={className}>
      <div className="flex border-b border-matrix-ghost mb-3 pb-2 gap-4 px-2">
        {periods.map((p) => (
          <button
            key={p.key}
            type="button"
            className={`text-caption uppercase font-bold ${
              period === p.key
                ? "text-matrix-bright border-b-2 border-matrix-primary"
                : "text-matrix-muted"
            }`}
            onClick={() => onPeriodChange?.(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {showSummary ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-90 py-4">
          <div className="text-center">
            <div className="text-caption uppercase text-matrix-muted mb-2">{summary?.totalLabel}</div>
            <div className="text-body font-black text-matrix-bright">{summary?.totalValue}</div>
            {summary?.sinceLabel && (
              <div className="text-caption text-matrix-muted mt-2">{summary.sinceLabel}</div>
            )}
          </div>
          {stats.length > 0 && (
            <div className={`grid gap-4 w-full px-8 ${stats.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {stats.map((stat, idx) => (
                <div
                  key={`${stat.label || "stat"}-${idx}`}
                  className="border border-matrix-ghost bg-matrix-panel p-3 text-center"
                >
                  <div className="text-caption text-matrix-muted uppercase">{stat.label}</div>
                  <div className="text-body font-bold text-matrix-bright">{stat.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar py-2 px-1">
          {rows.length > 0 ? (
            rows.map((row) => {
              const highlight = row.isSelf ? "bg-matrix-panel-strong border-l-2 border-l-matrix-primary" : "";
              const formattedRank = String(Math.max(0, row.rank)).padStart(2, "0");
              const formattedValue = typeof row.value === "number" ? row.value.toLocaleString() : row.value;

              return (
                <div
                  key={`${row.rank}-${row.name}`}
                  className={`flex justify-between items-center py-3 px-2 border-b border-matrix-ghost hover:bg-matrix-panel group ${highlight}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-caption w-6 ${row.rank <= 3 ? "text-matrix-primary font-bold" : "text-matrix-muted"}`}>
                      {formattedRank}
                    </span>
                    <MatrixAvatar name={row.name} isAnon={row.isAnon} isTheOne={row.isTheOne ?? row.rank === 1} size={24} />
                    <span className={`text-body uppercase font-bold tracking-tight ${row.isAnon ? "text-matrix-dim blur-[1px]" : "text-matrix-bright"}`}>
                      {row.name}
                    </span>
                  </div>
                  <span className="text-body font-bold text-matrix-primary">{formattedValue}</span>
                </div>
              );
            })
          ) : (
            <div className="text-center text-caption text-matrix-muted py-2">No data</div>
          )}
          {rows.length > 0 && loadMoreLabel && (
            <button
              type="button"
              onClick={onLoadMore}
              className="w-full text-center text-caption text-matrix-muted py-2 hover:text-matrix-primary"
            >
              {loadMoreLabel}
            </button>
          )}
        </div>
      )}
    </AsciiBox>
  );
}

// ============================================
// UsagePanel - Usage statistics panel
// ============================================

interface UsagePanelMetric {
  label: string;
  value: string;
  subValue?: string;
  valueClassName?: string;
}

interface UsagePanelBreakdown {
  label: string;
  value: string;
}

interface UsagePanelProps {
  title?: string;
  period?: string;
  periods?: Array<{ key: string; label: string }>;
  onPeriodChange?: (period: string) => void;
  metrics?: UsagePanelMetric[];
  showSummary?: boolean;
  summaryLabel?: string;
  summaryValue?: string;
  summaryCostValue?: string;
  onCostInfo?: () => void;
  summarySubLabel?: string;
  breakdown?: UsagePanelBreakdown[];
  breakdownCollapsed?: boolean;
  onToggleBreakdown?: () => void;
  collapseLabel?: string;
  expandLabel?: string;
  useSummaryLayout?: boolean;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string;
  rangeLabel?: string;
  rangeTimeZoneLabel?: string;
  statusLabel?: string;
  summaryAnimate?: boolean;
  hideHeader?: boolean;
  className?: string;
}

export const UsagePanel = React.memo(function UsagePanel({
  title = "USAGE",
  period,
  periods = [],
  onPeriodChange,
  metrics = [],
  showSummary = false,
  summaryLabel = "TOTAL OUTPUT",
  summaryValue = "\u2014",
  summaryCostValue,
  onCostInfo,
  summarySubLabel,
  breakdown,
  breakdownCollapsed = false,
  onToggleBreakdown,
  collapseLabel,
  expandLabel,
  useSummaryLayout = false,
  onRefresh,
  loading = false,
  error,
  rangeLabel,
  rangeTimeZoneLabel,
  statusLabel,
  summaryAnimate = true,
  hideHeader = false,
  className = "",
}: UsagePanelProps) {
  const toggleLabel = breakdownCollapsed ? expandLabel : collapseLabel;
  const showBreakdownToggle = Boolean(onToggleBreakdown && toggleLabel);

  const breakdownRows = breakdown && breakdown.length > 0 ? breakdown : [];

  return (
    <AsciiBox title={title} className={className}>
      {!hideHeader && (
        <div className="flex flex-wrap items-center justify-between border-b border-matrix-ghost mb-3 pb-2 gap-4 px-2">
          <div className="flex flex-wrap gap-4">
            {periods.map((p) => (
              <button
                key={p.key}
                type="button"
                className={`text-caption uppercase font-bold ${
                  period === p.key
                    ? "text-matrix-bright border-b-2 border-matrix-primary"
                    : "text-matrix-muted"
                }`}
                onClick={() => onPeriodChange?.(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
          {(onRefresh || statusLabel) && (
            <div className="flex items-center gap-3">
              {statusLabel && (
                <span className="text-caption uppercase font-bold text-matrix-primary">{statusLabel}</span>
              )}
              {showBreakdownToggle && (
                <MatrixButton className="px-2 py-1" onClick={onToggleBreakdown}>
                  {toggleLabel}
                </MatrixButton>
              )}
              {onRefresh && (
                <MatrixButton primary disabled={loading} onClick={onRefresh}>
                  {loading ? "Loading..." : "Refresh"}
                </MatrixButton>
              )}
            </div>
          )}
        </div>
      )}

      {error && <div className="text-caption text-red-400/90 px-2 py-1">Error: {error}</div>}

      {showSummary || useSummaryLayout ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-90 py-4">
          <div className="text-center relative">
            <div className="text-heading text-matrix-muted mb-2">{summaryLabel}</div>
            <div className="text-5xl md:text-8xl font-black text-white tracking-[-0.06em] tabular-nums leading-none glow-text select-none -translate-y-[5px]">
              {summaryValue && summaryValue !== "\u2014" ? (
                <span className="relative inline-block leading-none">
                  {summaryAnimate ? (
                    <ScrambleText text={summaryValue} durationMs={2200} startScrambled />
                  ) : (
                    summaryValue
                  )}
                </span>
              ) : (
                summaryValue
              )}
            </div>
            {summaryCostValue && (
              <div className="flex items-center justify-center gap-3 mt-4 md:mt-6">
                <span className="text-xl md:text-2xl font-bold text-gold leading-none drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                  {summaryCostValue}
                </span>
                {onCostInfo && (
                  <button
                    type="button"
                    onClick={onCostInfo}
                    title="Cost details"
                    className="group inline-flex items-center gap-1 text-caption uppercase font-black text-gold tracking-[0.25em] transition-all hover:text-gold/90"
                  >
                    <span>[?]</span>
                  </button>
                )}
              </div>
            )}
            {summarySubLabel && <div className="text-caption text-matrix-muted mt-2">{summarySubLabel}</div>}
          </div>

          {!breakdownCollapsed && breakdownRows.length > 0 && (
            <div className="w-full px-6">
              <div className="grid grid-cols-2 gap-3 border-t border-b border-matrix-ghost py-4 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-matrix-ghost" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-matrix-dim" />
                {breakdownRows.map((row, idx) => (
                  <div
                    key={`${row.label}-${idx}`}
                    className="flex flex-col items-center p-3 bg-matrix-panel border border-matrix-ghost"
                  >
                    <span className="text-caption text-matrix-muted uppercase mb-1">{row.label}</span>
                    <span className="text-body font-bold text-matrix-primary tracking-tight">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-4 py-2">
          {metrics.map((row, idx) => (
            <div key={`${row.label}-${idx}`} className="border border-matrix-ghost bg-matrix-panel p-4 text-center">
              <div className="text-caption uppercase text-matrix-muted mb-2">{row.label}</div>
              <div className={`text-body font-black text-matrix-bright glow-text ${row.valueClassName || ""}`}>
                {row.value}
              </div>
              {row.subValue && <div className="text-caption text-matrix-muted mt-2">{row.subValue}</div>}
            </div>
          ))}
        </div>
      )}

      {rangeLabel && (
        <div className="mt-3 text-caption uppercase text-matrix-dim font-bold px-2">
          {rangeLabel}
          {rangeTimeZoneLabel ? ` ${rangeTimeZoneLabel}` : ""}
        </div>
      )}
    </AsciiBox>
  );
});

// ============================================
// NeuralAdaptiveFleet - AI fleet animation
// ============================================

interface NeuralAdaptiveFleetModel {
  id?: string;
  name: string;
  share: number;
}

interface NeuralAdaptiveFleetProps {
  label: string;
  totalPercent: number | string;
  usage?: number;
  models?: NeuralAdaptiveFleetModel[];
}

export const NeuralAdaptiveFleet = React.memo(function NeuralAdaptiveFleet({
  label,
  totalPercent,
  usage = 0,
  models = [],
}: NeuralAdaptiveFleetProps) {
  const formatCompactNumber = (n: number): string => {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return String(Math.round(n));
  };

  const usageValue = formatCompactNumber(usage);
  const usageLabel = `${usageValue} tokens`;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-baseline border-b border-matrix-ghost pb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-heading font-black text-matrix-primary uppercase">{label}</span>
          <span className="text-caption text-matrix-muted">{usageLabel}</span>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-body font-black text-matrix-primary">{totalPercent}</span>
          <span className="text-caption text-matrix-dim font-bold">%</span>
        </div>
      </div>

      <div className="h-1 w-full bg-matrix-panel flex overflow-hidden relative">
        {models.map((model, index) => {
          const styleConfig = TEXTURES[index % TEXTURES.length];
          const modelKey = model?.id ? String(model.id) : `${model.name}-${index}`;
          return (
            <div
              key={modelKey}
              className="h-full relative transition-all duration-1000 ease-out border-r border-black last:border-none"
              style={{
                width: `${model.share}%`,
                backgroundColor: styleConfig.bg,
                backgroundImage: styleConfig.pattern,
                backgroundSize: styleConfig.size || "auto",
                boxShadow: index === 0 ? "0 0 10px rgba(0,255,65,0.2)" : "none",
              }}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-6 pl-1">
        {models.map((model, index) => {
          const styleConfig = TEXTURES[index % TEXTURES.length];
          const modelKey = model?.id ? String(model.id) : `${model.name}-${index}`;
          return (
            <div key={modelKey} className="flex items-center space-x-2">
              <div
                className="w-2 h-2 border border-matrix-ghost shrink-0"
                style={{
                  backgroundColor: styleConfig.bg,
                  backgroundImage: styleConfig.pattern,
                  backgroundSize: styleConfig.size || "auto",
                }}
              />
              <div className="flex items-baseline space-x-2 min-w-0">
                <span className="text-caption truncate uppercase text-matrix-primary font-bold" title={model.name}>
                  {model.name}
                </span>
                <span className="text-caption text-matrix-muted font-bold">{model.share}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ============================================
// NeuralDivergenceMap - Model breakdown panel
// ============================================

interface NeuralDivergenceMapFleet {
  label: string;
  totalPercent: number | string;
  usage?: number;
  models: NeuralAdaptiveFleetModel[];
}

interface NeuralDivergenceMapProps {
  fleetData?: NeuralDivergenceMapFleet[];
  className?: string;
  title?: string;
  footer?: string;
}

export const NeuralDivergenceMap = React.memo(function NeuralDivergenceMap({
  fleetData = [],
  className = "",
  title = "MODEL BREAKDOWN",
  footer = "Neural divergence patterns",
}: NeuralDivergenceMapProps) {
  const count = fleetData.length;
  const gridClass = count === 1 ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2";

  return (
    <AsciiBox title={title} className={className}>
      <div className={`${gridClass} gap-6 py-1 overflow-y-auto no-scrollbar`}>
        {fleetData.map((fleet, index) => {
          const isFirstAndOdd = count > 1 && count % 2 !== 0 && index === 0;
          const itemClass = isFirstAndOdd ? "md:col-span-2" : "";

          return (
            <div key={`${fleet.label}-${index}`} className={itemClass}>
              <NeuralAdaptiveFleet
                label={fleet.label}
                totalPercent={fleet.totalPercent}
                usage={fleet.usage}
                models={fleet.models}
              />
            </div>
          );
        })}
      </div>
      {footer && (
        <div className="mt-auto pt-3 border-t border-matrix-ghost text-caption uppercase text-center italic leading-none text-matrix-dim">
          {footer}
        </div>
      )}
    </AsciiBox>
  );
});

// ============================================
// LandingExtras - Landing page decorations
// ============================================

interface LandingExtrasProps {
  handle: string;
  onHandleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  specialHandle?: string;
  handlePlaceholder?: string;
  rankLabel?: string;
}

export function LandingExtras({
  handle,
  onHandleChange,
  specialHandle,
  handlePlaceholder,
  rankLabel,
}: LandingExtrasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
      <SignalBox title="IDENTITY PROBE" className="h-44">
        <div className="flex items-center space-x-6 h-full">
          <MatrixAvatar name={handle} size={80} isTheOne={handle === specialHandle} />
          <div className="flex-1 text-left space-y-3">
            <div className="flex flex-col">
              <label className="text-caption text-matrix-muted uppercase mb-2 font-bold">HANDLE</label>
              <input
                type="text"
                value={handle}
                onChange={onHandleChange}
                className="w-full bg-transparent border-b border-matrix-dim text-matrix-bright font-black text-2xl md:text-3xl p-1 focus:outline-none focus:border-matrix-primary transition-colors"
                maxLength={10}
                placeholder={handlePlaceholder}
              />
            </div>
            <div className="text-caption text-matrix-muted">{rankLabel}</div>
          </div>
        </div>
      </SignalBox>

      <SignalBox title="LIVE SNIFFER" className="h-44">
        <LiveSniffer />
      </SignalBox>
    </div>
  );
}

// ============================================
// GithubStar - GitHub star button
// ============================================

interface GithubStarProps {
  repo?: string;
  isFixed?: boolean;
  size?: "default" | "header";
}

export function GithubStar({
  repo = "example/repo",
  isFixed = true,
  size = "default",
}: GithubStarProps) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => console.error("GitHub API fetch failed", err));
  }, [repo]);

  const baseClasses =
    size === "header"
      ? "matrix-header-chip matrix-header-action text-caption uppercase font-bold tracking-[0.2em] select-none group gap-3 no-underline overflow-hidden"
      : "group flex items-center gap-3 px-4 py-2 bg-matrix-panel border border-matrix-ghost backdrop-blur-md transition-all duration-300 hover:border-matrix-primary hover:bg-matrix-panel-strong no-underline overflow-hidden";
  const positionClasses = isFixed ? "fixed top-6 right-6 z-[100]" : "relative";

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${positionClasses}`}
    >
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-matrix-dim group-hover:border-matrix-primary" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-matrix-dim group-hover:border-matrix-primary" />

      <div className="relative">
        <svg
          height="16"
          viewBox="0 0 16 16"
          width="16"
          className="fill-matrix-primary group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.8)] transition-all duration-500"
        >
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
        </svg>
      </div>

      <div className="flex items-center gap-2 leading-none">
        <span className="text-matrix-primary">STAR</span>
        <span className="text-matrix-bright tabular-nums tracking-normal">{stars !== null ? stars : "---"}</span>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-matrix-dim animate-[scanner_2s_linear_infinite]" />
      </div>

      <style>{`
        @keyframes scanner {
          0% { transform: translateY(0); }
          100% { transform: translateY(44px); }
        }
      `}</style>
    </a>
  );
}

// ============================================
// UpgradeAlertModal - Upgrade notification
// ============================================

interface UpgradeAlertModalProps {
  requiredVersion?: string;
  installCommand?: string;
  onClose?: () => void;
}

export function UpgradeAlertModal({
  requiredVersion,
  installCommand = "npm install -g package@latest",
  onClose,
}: UpgradeAlertModalProps) {
  const normalizedRequired = typeof requiredVersion === "string" ? requiredVersion.trim() : "";
  const hasVersion = normalizedRequired.length > 0;
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-[200] border-b border-gold/30 bg-matrix-dark/95 backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.1)] overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-[linear-gradient(rgba(255,215,0,0)_50%,rgba(255,215,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2 relative flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-xl animate-pulse">*</span>
          <div className="flex flex-col">
            <h3 className="text-gold font-black text-heading uppercase leading-none">UPDATE AVAILABLE</h3>
            <p className="text-caption text-gold/60 uppercase mt-1">
              {hasVersion ? `Version ${normalizedRequired} required` : "A new version is available"}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center max-w-xl w-full">
          <div className="flex items-center w-full bg-matrix-panel border border-gold/20 pl-3 group hover:border-gold/40 transition-all overflow-hidden">
            <span className="text-caption text-gold/80 shrink-0">$</span>
            <input
              readOnly
              value={installCommand}
              className="bg-transparent border-none text-body text-matrix-muted w-full px-2 py-1 outline-none pointer-events-none"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 bg-gold/10 hover:bg-gold/20 border-l border-gold/20 px-3 py-1.5 text-caption font-black uppercase text-gold transition-all"
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleDismiss}
            className="text-caption font-black uppercase text-gold/40 hover:text-gold transition-all tracking-[0.2em]"
          >
            IGNORE
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CostAnalysisModal - Cost breakdown modal
// ============================================

interface CostAnalysisFleet {
  label: string;
  usd?: number;
  models: Array<{
    id?: string;
    name: string;
    share?: number;
    calc?: string;
  }>;
}

interface CostAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  fleetData?: CostAnalysisFleet[];
}

export const CostAnalysisModal = React.memo(function CostAnalysisModal({
  isOpen,
  onClose,
  fleetData = [],
}: CostAnalysisModalProps) {
  useEffect(() => {
    if (typeof onClose !== "function") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const formatUsdValue = (value?: number): string => {
    if (!Number.isFinite(value)) return "\u2014";
    return `$${value!.toFixed(2)}`;
  };

  const normalizedFleet = (Array.isArray(fleetData) ? fleetData : []).map((fleet) => {
    const usdValue = typeof fleet?.usd === "number" && Number.isFinite(fleet.usd) ? fleet.usd : 0;
    const models = Array.isArray(fleet?.models) ? fleet.models : [];
    return {
      label: fleet?.label ? String(fleet.label) : "",
      usdValue,
      usdLabel: formatUsdValue(usdValue),
      models: models.map((model) => {
        const shareValue = typeof model?.share === "number" && Number.isFinite(model.share) ? model.share : 0;
        const shareLabel = Number.isFinite(shareValue) ? `${shareValue}%` : "\u2014";
        const calcRaw = typeof model?.calc === "string" ? model.calc.trim() : "";
        const calcValue = calcRaw ? calcRaw.toUpperCase() : "DYNAMIC";
        return {
          id: model?.id ? String(model.id) : "",
          name: model?.name ? String(model.name) : "",
          shareLabel,
          calcValue,
        };
      }),
    };
  });

  const totalUsd = normalizedFleet.reduce((acc, fleet) => acc + fleet.usdValue, 0);
  const totalUsdLabel = formatUsdValue(totalUsd);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-matrix-dark/95 backdrop-blur-md">
      <div className="w-full max-w-2xl transform animate-in fade-in zoom-in duration-200">
        <AsciiBox title="COST BREAKDOWN">
          <div className="space-y-8 py-4">
            <div className="text-center pb-6 border-b border-matrix-ghost">
              <div className="text-caption text-matrix-muted uppercase mb-2 font-bold">TOTAL COST</div>
              <div
                className="text-body font-black text-gold tracking-tight"
                style={{ textShadow: "0 0 20px rgba(255, 215, 0, 0.4)" }}
              >
                {totalUsdLabel}
              </div>
            </div>

            <div className="space-y-6 max-h-[45vh] overflow-y-auto no-scrollbar pr-2">
              {normalizedFleet.map((fleet, index) => (
                <div key={`${fleet.label}-${index}`} className="space-y-3">
                  <div className="flex justify-between items-baseline border-b border-matrix-ghost pb-2">
                    <span className="text-body font-black text-matrix-bright uppercase tracking-widest">
                      {fleet.label}
                    </span>
                    <span className="text-body font-bold text-gold">{fleet.usdLabel}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {fleet.models.map((model, modelIndex) => {
                      const modelKey = model?.id || `${model.name}-${modelIndex}`;
                      return (
                        <div key={modelKey} className="flex justify-between text-caption text-matrix-muted">
                          <span>
                            {model.name} ({model.shareLabel})
                          </span>
                          <span className="opacity-40">via {model.calcValue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-matrix-ghost flex justify-between items-center">
              <button
                onClick={onClose}
                className="text-caption font-bold uppercase text-matrix-primary border border-matrix-dim px-6 py-2 hover:bg-matrix-primary hover:text-black transition-all"
                type="button"
              >
                CLOSE
              </button>
              <p className="text-caption text-matrix-dim uppercase">Estimates based on API pricing</p>
            </div>
          </div>
        </AsciiBox>
      </div>
    </div>
  );
});
