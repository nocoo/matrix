// Centralized chart / visualization color palette for the Matrix theme.
// Uses direct hex values from the Matrix green spectrum instead of CSS custom
// properties — this avoids dependency on basalt's --chart-N variables.

/** Matrix-themed chart colors — a spectrum from bright green through cyan,
 *  amber, and muted tones to keep charts visually distinct on the dark bg. */
export const CHART_COLORS = [
  "#00FF41", // matrix primary green
  "#00CC33", // darker green
  "#00FF88", // mint
  "#00FFAA", // seafoam
  "#00FFCC", // teal
  "#00FFEE", // cyan
  "#00CCFF", // sky
  "#0099FF", // cobalt
  "#0066FF", // blue
  "#3366FF", // indigo
  "#6633FF", // purple
  "#9933FF", // orchid
  "#CC33FF", // magenta
  "#FF33CC", // rose
  "#FF3399", // crimson
  "#FF3366", // red
  "#FF6633", // vermilion
  "#FF9933", // orange
  "#FFCC33", // amber
  "#FFFF33", // lime
  "#CCFF33", // chartreuse
  "#99FF33", // lime-green
  "#66FF33", // bright-lime
  "#33FF33", // neon-green
] as const;

/** Returns a hex color with alpha as rgba string */
export function withAlpha(color: string, alpha: number): string {
  // Parse hex to rgb
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// -- Semantic aliases --

/** Positive / income / inflow */
export const chartPositive = "#00FF41";

/** Negative / expense / outflow */
export const chartNegative = "#FF3366";

/** Primary chart accent (most-used single color) */
export const chartPrimary = "#00FF41";

/** Axis / grid color */
export const chartAxis = "rgba(0, 255, 65, 0.2)";
