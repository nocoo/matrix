// Pixel-art heatmap data generator.
// Renders "2026" as bright cells (value 10) on a random dim background (0-5).

// Each digit is a 5-wide × 7-tall bitmap (1 = bright, 0 = background).
const PIXEL_FONT: Record<string, number[][]> = {
  "2": [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  "0": [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  "6": [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
};

// Gap columns between digits
const DIGIT_GAP = 2;
// Padding columns on each side
const PAD_COLS = 2;
// Padding rows top/bottom
const PAD_ROWS = 1;
// Digit dimensions
const DIGIT_W = 5;
const DIGIT_H = 7;

const TEXT = "2026";

/** Total grid width */
export const HEATMAP_COLS =
  PAD_COLS * 2 + TEXT.length * DIGIT_W + (TEXT.length - 1) * DIGIT_GAP;

/** Total grid height */
export const HEATMAP_ROWS = PAD_ROWS * 2 + DIGIT_H;

/** Seeded pseudo-random for deterministic "random" background. */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export interface HeatmapCell {
  row: number;
  col: number;
  value: number;
}

/**
 * Generate the full heatmap grid as a flat array of cells.
 * Bright cells (value = 10) spell out "2026".
 * Background cells get a random value in [0, 5].
 */
export function generatePixelHeatmap(seed = 2026): HeatmapCell[] {
  const rand = seededRandom(seed);
  const cells: HeatmapCell[] = [];

  // Build a mask: true = bright pixel belonging to "2026"
  const mask: boolean[][] = Array.from({ length: HEATMAP_ROWS }, () =>
    Array.from({ length: HEATMAP_COLS }, () => false),
  );

  for (let di = 0; di < TEXT.length; di++) {
    const glyph = PIXEL_FONT[TEXT[di]];
    if (!glyph) continue;
    const offsetX = PAD_COLS + di * (DIGIT_W + DIGIT_GAP);
    const offsetY = PAD_ROWS;
    for (let r = 0; r < DIGIT_H; r++) {
      for (let c = 0; c < DIGIT_W; c++) {
        if (glyph[r][c]) {
          mask[offsetY + r][offsetX + c] = true;
        }
      }
    }
  }

  for (let r = 0; r < HEATMAP_ROWS; r++) {
    for (let c = 0; c < HEATMAP_COLS; c++) {
      cells.push({
        row: r,
        col: c,
        value: mask[r][c] ? 10 : Math.floor(rand() * 6), // 0-5 for bg
      });
    }
  }

  return cells;
}

/** Max value in the heatmap (used for normalization). */
export const HEATMAP_MAX = 10;
