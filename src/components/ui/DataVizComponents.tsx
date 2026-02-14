import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { AsciiBox } from "./AsciiBox";

// ============================================
// TrendMonitor - Industrial TUI style chart
// ============================================

interface TrendMonitorRow {
  hour?: string;
  day?: string;
  month?: string;
  label?: string;
  billable_total_tokens?: number;
  total_tokens?: number;
  value?: number;
  missing?: boolean;
  future?: boolean;
}

interface TrendMonitorProps {
  rows?: TrendMonitorRow[];
  data?: number[];
  color?: string;
  label?: string;
  from?: string;
  to?: string;
  period?: "day" | "week" | "month" | "total";
  timeZoneLabel?: string;
  showTimeZoneLabel?: boolean;
  className?: string;
}

export function TrendMonitor({
  rows,
  data = [],
  color = "#00FF41",
  label = "TREND",
  period,
  timeZoneLabel,
  className = "",
}: TrendMonitorProps) {
  const series = Array.isArray(rows) && rows.length ? rows : null;
  const fallbackValues = data.length > 0 ? data : Array.from({ length: 24 }, () => 0);
  const seriesValues = series
    ? series.map((row) => {
        if (row?.missing || row?.future) return null;
        const raw = row?.billable_total_tokens ?? row?.total_tokens ?? row?.value;
        if (raw == null) return null;
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
      })
    : fallbackValues;
  const seriesLabels = series
    ? series.map((row) => row?.hour || row?.day || row?.month || row?.label || "")
    : [];
  const seriesMeta = series
    ? series.map((row) => ({
        missing: Boolean(row?.missing),
        future: Boolean(row?.future),
      }))
    : Array.from({ length: seriesValues.length }, () => ({
        missing: false,
        future: false,
      }));

  const statsValues = seriesValues.filter((val): val is number => Number.isFinite(val));
  const max = Math.max(...(statsValues.length ? statsValues : [0]), 100);
  const avg = statsValues.length
    ? statsValues.reduce((a, b) => a + b, 0) / statsValues.length
    : 0;

  const width = 100;
  const height = 100;
  const axisWidthFallback = 8;
  const [axisWidthView, setAxisWidthView] = useState(axisWidthFallback);
  const plotWidth = width - axisWidthView;
  const pointCount = Math.max(seriesValues.length, 1);
  const DAY_AXIS_POINT_COUNT = 24;
  const dayStep = DAY_AXIS_POINT_COUNT > 1 ? plotWidth / (DAY_AXIS_POINT_COUNT - 1) : 0;
  const dayPadding = Math.min(dayStep / 2, plotWidth * 0.12);
  const xPadding = pointCount > 1 ? dayPadding : plotWidth / 2;
  const plotSpan = Math.max(plotWidth - xPadding * 2, 0);
  const stepWithPadding = pointCount > 1 ? plotSpan / (pointCount - 1) : 0;
  const pointRadius = 2.4;
  const plotTop = Math.max(6, pointRadius + 3);
  const plotBottom = Math.max(8, pointRadius + 4);
  const plotHeight = height - plotTop - plotBottom;

  const formatCompact = (value: number): string => {
    const n = Number(value) || 0;
    const abs = Math.abs(n);
    if (abs >= 1e9) return `${(n / 1e9).toFixed(abs >= 1e10 ? 0 : 1)}B`;
    if (abs >= 1e6) return `${(n / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
    if (abs >= 1e3) return `${(n / 1e3).toFixed(abs >= 1e4 ? 0 : 1)}K`;
    return String(Math.round(n));
  };

  const formatFull = (value: number): string => {
    const n = Number(value) || 0;
    return n.toLocaleString();
  };

  const lineSegments = useMemo(() => {
    const segments: Array<Array<{ x: number; y: number; index: number; value: number }>> = [];
    let current: Array<{ x: number; y: number; index: number; value: number }> = [];
    seriesValues.forEach((val, i) => {
      if (!Number.isFinite(val)) {
        if (current.length) {
          segments.push(current);
          current = [];
        }
        return;
      }
      const x = pointCount > 1 ? xPadding + i * stepWithPadding : plotWidth / 2;
      const normalizedVal = max > 0 ? (val as number) / max : 0;
      const y = plotTop + (1 - normalizedVal) * plotHeight;
      current.push({ x, y, index: i, value: val as number });
    });
    if (current.length) segments.push(current);
    return segments;
  }, [max, plotHeight, plotTop, plotWidth, pointCount, seriesValues, stepWithPadding, xPadding]);

  const singlePoints = useMemo(() => {
    if (!lineSegments.length) return [];
    return lineSegments
      .filter((segment) => segment.length === 1)
      .map((segment, idx) => {
        const pt = segment[0];
        const clampedY = Math.min(Math.max(pt.y, plotTop + pointRadius), plotTop + plotHeight);
        return { key: `single-${idx}`, x: pt.x, y: clampedY };
      });
  }, [lineSegments, plotHeight, plotTop, pointRadius]);

  const solveSmoothPath = (points: Array<{ x: number; y: number }>): string => {
    if (!Array.isArray(points) || points.length === 0) return "";
    if (points.length === 1) {
      const pt = points[0];
      return `M ${pt.x},${pt.y}`;
    }
    if (points.length === 2) {
      const [a, b] = points;
      return `M ${a.x},${a.y} L ${b.x},${b.y}`;
    }

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) * 0.16;
      const cp1y = p1.y + (p2.y - p0.y) * 0.16;
      const cp2x = p2.x - (p3.x - p1.x) * 0.16;
      const cp2y = p2.y - (p3.y - p1.y) * 0.16;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const xLabels = useMemo(() => {
    if (period === "day") {
      return ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:00"];
    }
    return ["T-24", "T-18", "T-12", "T-6", "NOW"];
  }, [period]);

  const plotRef = useRef<HTMLDivElement>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{
    index: number;
    value: number;
    label: string;
    x: number;
    y: number;
    rectWidth: number;
    axisWidthPx: number;
    plotWidthPx: number;
    missing: boolean;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const measure = () => {
      const plotEl = plotRef.current;
      const axisEl = axisRef.current;
      if (!plotEl || !axisEl) return;
      const plotRect = plotEl.getBoundingClientRect();
      const axisRect = axisEl.getBoundingClientRect();
      if (!plotRect.width) return;
      const next = (axisRect.width / plotRect.width) * width;
      const clamped = Math.max(4, Math.min(width - 1, next));
      setAxisWidthView((prev) => (Math.abs(prev - clamped) > 0.2 ? clamped : prev));
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      if (plotRef.current) observer.observe(plotRef.current);
      if (axisRef.current) observer.observe(axisRef.current);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [width]);

  const handleMove = (e: React.MouseEvent) => {
    const el = plotRef.current;
    if (!el || seriesValues.length === 0) return;
    const rect = el.getBoundingClientRect();
    const axisWidthPx = axisRef.current?.getBoundingClientRect().width ?? (axisWidthView / width) * rect.width;
    const plotWidthPx = rect.width - axisWidthPx;
    const rawX = Math.min(Math.max(e.clientX - rect.left, 0), plotWidthPx);
    const xPaddingPx = plotWidth > 0 ? (xPadding / plotWidth) * plotWidthPx : 0;
    const plotSpanPx = Math.max(plotWidthPx - xPaddingPx * 2, 0);
    const denom = Math.max(seriesValues.length - 1, 1);
    const clamped = Math.min(Math.max(rawX - xPaddingPx, 0), plotSpanPx);
    const ratio = plotSpanPx > 0 ? clamped / plotSpanPx : 0;
    const index = Math.round(ratio * denom);
    const meta = seriesMeta[index] || {};
    if (meta.future) {
      setHover(null);
      return;
    }
    const rawValue = seriesValues[index];
    const value = Number.isFinite(rawValue) ? (rawValue as number) : 0;
    const snappedX = denom > 0 ? xPaddingPx + (index / denom) * plotSpanPx : plotWidthPx / 2;
    const labelText = seriesLabels[index] || "";
    const yRatio = max > 0 ? 1 - value / max : 1;
    const yPx = (plotTop / height) * rect.height + yRatio * (plotHeight / height) * rect.height;
    setHover({
      index,
      value,
      label: labelText,
      x: snappedX,
      y: yPx,
      rectWidth: rect.width,
      axisWidthPx,
      plotWidthPx,
      missing: Boolean(meta.missing),
    });
  };

  const handleLeave = () => {
    setHover(null);
  };

  return (
    <AsciiBox title={label} className={`w-full ${className}`} bodyClassName="flex flex-col gap-3">
      <div className="flex items-center justify-between text-caption text-matrix-muted px-1">
        <div className="flex gap-3">
          <span>MAX: {Math.round(max)}</span>
          <span>AVG: {Math.round(avg)}</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden border border-matrix-ghost bg-matrix-panel min-h-[200px]">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${color} 1px, transparent 1px),
              linear-gradient(to bottom, ${color} 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF41]/10 to-transparent w-[50%] h-full animate-[scan-x_3s_linear_infinite] pointer-events-none mix-blend-screen" />

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full absolute inset-0 z-10"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {lineSegments.map((segment, idx) => {
            if (segment.length < 2) return null;
            const first = segment[0];
            const last = segment[segment.length - 1];
            const linePath = solveSmoothPath(segment);
            const fillPath = `${linePath} L ${last.x},${height - plotBottom} L ${first.x},${height - plotBottom} Z`;
            return (
              <React.Fragment key={`seg-${idx}`}>
                <path d={fillPath} fill={`url(#grad-${label})`} />
                <path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  className="drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]"
                />
              </React.Fragment>
            );
          })}
        </svg>
        {singlePoints.map((pt) => (
          <div
            key={pt.key}
            className="absolute z-15 w-2.5 h-2.5 rounded-full"
            style={{
              left: `calc(${(pt.x / width) * 100}% - 5px)`,
              top: `calc(${(pt.y / height) * 100}% - 5px)`,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        ))}

        <div
          ref={axisRef}
          className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-1 px-1 text-caption text-matrix-muted pointer-events-none bg-matrix-panel-strong border-l border-matrix-ghost w-10 text-right"
        >
          <span>{formatCompact(max)}</span>
          <span>{formatCompact(max * 0.75)}</span>
          <span>{formatCompact(max * 0.5)}</span>
          <span>{formatCompact(max * 0.25)}</span>
          <span>0</span>
        </div>

        <div
          ref={plotRef}
          className="absolute inset-0 z-20"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        />

        {hover && (
          <>
            <div
              className="absolute inset-y-0 left-0 pointer-events-none z-25"
              style={{ right: hover.axisWidthPx }}
            >
              <div
                className="absolute top-0 bottom-0 w-px bg-[#00FF41]/40 shadow-[0_0_6px_rgba(0,255,65,0.35)]"
                style={{ left: hover.x }}
              />
              <div
                className="absolute w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_6px_rgba(0,255,65,0.8)]"
                style={{ left: hover.x - 4, top: hover.y - 4 }}
              />
            </div>
            <div
              className="absolute z-30 px-3 py-2 text-caption bg-matrix-panel-strong border border-matrix-ghost text-matrix-bright pointer-events-none"
              style={{
                left: Math.min(hover.x + 10, hover.rectWidth - hover.axisWidthPx - 120),
                top: Math.max(hover.y - 24, 6),
              }}
            >
              <div className="text-matrix-muted">{hover.label || timeZoneLabel || ""}</div>
              {hover.missing ? (
                <div className="font-bold">UNSYNCED</div>
              ) : (
                <div className="font-bold">{formatFull(hover.value)} tokens</div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="h-5 flex justify-between items-center px-1 text-caption text-matrix-muted border-t border-matrix-ghost pt-2">
        {xLabels.map((labelText, idx) => (
          <span
            key={`${labelText}-${idx}`}
            className={labelText === "NOW" ? "text-matrix-primary font-bold animate-pulse" : ""}
          >
            {labelText}
          </span>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan-x {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `,
        }}
      />
    </AsciiBox>
  );
}

// ============================================
// ActivityHeatmap - GitHub-style heatmap
// ============================================

interface ActivityHeatmapCell {
  day: string;
  value?: number;
  total_tokens?: number;
  billable_total_tokens?: number;
  level?: number;
}

type ActivityHeatmapWeek = Array<ActivityHeatmapCell | null>;

interface ActivityHeatmapData {
  weeks?: ActivityHeatmapWeek[];
  to?: string;
  week_starts_on?: "sun" | "mon";
}

interface ActivityHeatmapProps {
  heatmap?: ActivityHeatmapData;
  timeZoneLabel?: string;
  timeZoneShortLabel?: string;
  hideLegend?: boolean;
  defaultToLatestMonth?: boolean;
}

const OPACITY_BY_LEVEL = [0.12, 0.32, 0.5, 0.7, 1];
const CELL_SIZE = 12;
const CELL_GAP = 3;
const LABEL_WIDTH = 26;
const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAY_LABELS_SUN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_LABELS_MON = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function parseUtcDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  const dt = new Date(Date.UTC(year, month, day));
  if (!Number.isFinite(dt.getTime())) return null;
  return dt;
}

function addUtcDays(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

function diffUtcDays(a: Date, b: Date): number {
  const ms =
    Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()) -
    Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  return Math.floor(ms / 86400000);
}

function getWeekStart(date: Date, weekStartsOn: "sun" | "mon"): Date {
  const desired = weekStartsOn === "mon" ? 1 : 0;
  const dow = date.getUTCDay();
  const delta = (dow - desired + 7) % 7;
  return addUtcDays(date, -delta);
}

function buildMonthMarkers(weeksCount: number, to: string | undefined, weekStartsOn: "sun" | "mon") {
  if (!weeksCount) return [];
  const end = to ? parseUtcDate(to) : new Date();
  if (!end) return [];
  const endMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
  const months: Date[] = [];
  for (let i = 11; i >= 0; i -= 1) {
    months.push(new Date(Date.UTC(endMonth.getUTCFullYear(), endMonth.getUTCMonth() - i, 1)));
  }

  const endWeekStart = getWeekStart(end, weekStartsOn);
  const startAligned = addUtcDays(endWeekStart, -(weeksCount - 1) * 7);

  const markers: Array<{ label: string; index: number }> = [];
  const usedIndexes = new Set<number>();
  for (const monthStart of months) {
    const weekIndex = Math.floor(diffUtcDays(startAligned, monthStart) / 7);
    if (weekIndex < 0 || weekIndex >= weeksCount) continue;
    if (usedIndexes.has(weekIndex)) continue;
    usedIndexes.add(weekIndex);
    markers.push({
      label: MONTH_LABELS[monthStart.getUTCMonth()],
      index: weekIndex,
    });
  }
  return markers;
}

function formatTokenValue(value: unknown): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value).toLocaleString() : "0";
  }
  if (typeof value === "string") {
    const n = Number(value.trim());
    return Number.isFinite(n) ? Math.round(n).toLocaleString() : value;
  }
  return "0";
}

export function ActivityHeatmap({
  heatmap,
  timeZoneLabel,
  timeZoneShortLabel,
  hideLegend = false,
  defaultToLatestMonth = false,
}: ActivityHeatmapProps) {
  const weekStartsOn = heatmap?.week_starts_on === "mon" ? "mon" : "sun";
  const weeks = Array.isArray(heatmap?.weeks) ? heatmap!.weeks : [];
  const dayLabels = weekStartsOn === "mon" ? DAY_LABELS_MON : DAY_LABELS_SUN;

  const monthMarkers = useMemo(
    () => buildMonthMarkers(weeks.length, heatmap?.to, weekStartsOn),
    [heatmap?.to, weekStartsOn, weeks.length],
  );
  const latestMonthIndex = useMemo(() => {
    if (!monthMarkers.length) return null;
    return monthMarkers[monthMarkers.length - 1]?.index ?? null;
  }, [monthMarkers]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolledRef = useRef(false);
  const [, setIsHoveringHeatmap] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !weeks.length) return;
    if (hasAutoScrolledRef.current) return;
    if (el.scrollWidth <= el.clientWidth + 1) {
      hasAutoScrolledRef.current = true;
      return;
    }

    const snapToLatest = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      let targetScroll = maxScroll;
      if (defaultToLatestMonth && typeof latestMonthIndex === "number" && Number.isFinite(latestMonthIndex)) {
        const columnWidth = CELL_SIZE + CELL_GAP;
        targetScroll = Math.min(maxScroll, Math.max(0, latestMonthIndex * columnWidth));
      }
      el.scrollLeft = targetScroll;
      hasAutoScrolledRef.current = true;
    };

    requestAnimationFrame(() => requestAnimationFrame(snapToLatest));
  }, [defaultToLatestMonth, latestMonthIndex, weeks.length]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, []);

  if (!weeks.length) {
    return <div className="text-caption text-matrix-muted">No activity data</div>;
  }

  const gridColumns = {
    display: "grid" as const,
    gridTemplateColumns: `${LABEL_WIDTH}px repeat(${weeks.length}, ${CELL_SIZE}px)`,
    columnGap: `${CELL_GAP}px`,
  };

  const labelRows = {
    display: "grid" as const,
    gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
    rowGap: `${CELL_GAP}px`,
  };

  const gridRows = {
    display: "grid" as const,
    gridAutoFlow: "column" as const,
    gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
    gap: `${CELL_GAP}px`,
  };

  const contentWidth = LABEL_WIDTH + weeks.length * CELL_SIZE + Math.max(0, weeks.length - 1) * CELL_GAP;

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsHoveringHeatmap(true)}
      onMouseLeave={() => setIsHoveringHeatmap(false)}
    >
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 w-6 pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-10 pointer-events-none z-10" />

        <div
          ref={scrollRef}
          className="w-full max-w-full overflow-x-scroll no-scrollbar select-none pb-2 outline-none"
          tabIndex={0}
          aria-label="Activity heatmap"
          onWheel={handleWheel}
          style={{ scrollbarWidth: "none" }}
        >
          <div
            className="inline-flex flex-col min-w-max outline-none cursor-grab"
            style={{ touchAction: "none", minWidth: contentWidth }}
          >
            <div style={gridColumns} className="text-caption uppercase text-matrix-muted mb-2">
              <span />
              {monthMarkers.map((labelItem) => (
                <span
                  key={`${labelItem.label}-${labelItem.index}`}
                  style={{ gridColumnStart: labelItem.index + 2 }}
                  className="whitespace-nowrap"
                >
                  {labelItem.label}
                </span>
              ))}
            </div>

            <div style={gridColumns}>
              <div
                style={labelRows}
                className="text-caption uppercase text-matrix-muted sticky left-0 z-10 bg-matrix-panel pr-2"
              >
                {dayLabels.map((labelItem) => (
                  <span key={labelItem} className="leading-none">
                    {labelItem}
                  </span>
                ))}
              </div>

              <div style={gridRows}>
                {weeks.map((week, wIdx) =>
                  (Array.isArray(week) ? week : []).map((cell, dIdx) => {
                    const key = cell?.day || `empty-${wIdx}-${dIdx}`;
                    if (!cell) {
                      return (
                        <span
                          key={key}
                          className="border border-transparent"
                          style={{ width: CELL_SIZE, height: CELL_SIZE }}
                        />
                      );
                    }

                    const level = Number(cell.level) || 0;
                    const opacity = OPACITY_BY_LEVEL[level] ?? 0.3;
                    const cellColor = level === 0 ? "rgba(0,255,65,0.08)" : `rgba(0,255,65,${opacity})`;
                    const tzDetail = timeZoneLabel || timeZoneShortLabel || "UTC";
                    const cellValue = cell.value ?? cell.total_tokens ?? cell.billable_total_tokens ?? 0;

                    return (
                      <span
                        key={key}
                        title={`${cell.day}: ${formatTokenValue(cellValue)} tokens (${tzDetail})`}
                        className="border border-matrix-ghost"
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          background: cellColor,
                        }}
                      />
                    );
                  }),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!hideLegend && (
        <div className="flex justify-between items-center text-caption border-t border-matrix-ghost pt-2 text-matrix-muted font-bold uppercase">
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className="border border-matrix-ghost"
                  style={{
                    width: 10,
                    height: 10,
                    background: level === 0 ? "rgba(0,255,65,0.08)" : `rgba(0,255,65,${OPACITY_BY_LEVEL[level]})`,
                  }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
          <span>{timeZoneShortLabel || "UTC"}</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// ArchiveHeatmap - Alternative heatmap variant
// ============================================

interface ArchiveHeatmapProps {
  heatmap?: ActivityHeatmapData;
  title?: string;
  rangeLabel?: string;
  footerLeft?: string;
  footerRight?: string;
  className?: string;
}

export function ArchiveHeatmap({
  heatmap,
  title = "ARCHIVE",
  rangeLabel,
  footerLeft = "Historical data",
  footerRight,
  className = "",
}: ArchiveHeatmapProps) {
  const showFooter = Boolean(footerLeft || footerRight);

  return (
    <AsciiBox title={title} className={className}>
      <div className="flex flex-col h-full">
        <ActivityHeatmap heatmap={heatmap} />
        {rangeLabel && (
          <div className="mt-4 text-caption text-matrix-dim uppercase font-bold">Range: {rangeLabel}</div>
        )}
        {showFooter && (
          <div className="mt-auto pt-3 border-t border-matrix-ghost text-caption text-matrix-muted flex justify-between uppercase">
            <span>{footerLeft}</span>
            {footerRight && <span>{footerRight}</span>}
          </div>
        )}
      </div>
    </AsciiBox>
  );
}

// ============================================
// TrendChart - Simple bar chart visualization
// ============================================

interface TrendChartProps {
  data?: number[];
  unitLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
}

export function TrendChart({
  data,
  unitLabel = "tokens",
  leftLabel = "START",
  rightLabel = "NOW",
}: TrendChartProps) {
  const values = Array.isArray(data) ? data.map((n) => Number(n) || 0) : [];
  const max = Math.max(...values, 1);

  if (!values.length) {
    return <div className="text-caption text-matrix-muted">No trend data</div>;
  }

  const peakLabel = `PEAK: ${max.toLocaleString()} ${unitLabel}`;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-end h-24 space-x-1 border-b border-matrix-ghost pb-2 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
          <div className="border-t border-matrix-ghost w-full" />
          <div className="border-t border-matrix-ghost w-full" />
          <div className="border-t border-matrix-ghost w-full" />
        </div>
        {values.map((val, i) => (
          <div key={i} className="flex-1 bg-matrix-panel relative group">
            <div
              style={{ height: `${(val / max) * 100}%` }}
              className="w-full bg-matrix-primary opacity-50 group-hover:opacity-100 group-hover:bg-matrix-bright transition-all duration-300 shadow-[0_0_10px_rgba(0,255,65,0.2)]"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-caption text-matrix-muted uppercase font-bold">
        <span>{leftLabel}</span>
        <span>{peakLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
