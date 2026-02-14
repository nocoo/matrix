import { describe, it, expect } from "vitest";
import {
  generatePixelHeatmap,
  HEATMAP_ROWS,
  HEATMAP_COLS,
  HEATMAP_MAX,
} from "@/models/pixel-heatmap";

describe("pixel-heatmap", () => {
  it("generates correct total cells", () => {
    const cells = generatePixelHeatmap();
    expect(cells.length).toBe(HEATMAP_ROWS * HEATMAP_COLS);
  });

  it("has expected grid dimensions", () => {
    // 4 digits × 5 wide + 3 gaps × 2 + 2 padding × 2 = 20 + 6 + 4 = 30? Let's verify:
    // DIGIT_W=5, DIGIT_GAP=2, PAD_COLS=2, TEXT="2026" (4 chars)
    // HEATMAP_COLS = 2*2 + 4*5 + 3*2 = 4 + 20 + 6 = 30
    expect(HEATMAP_COLS).toBe(30);
    // DIGIT_H=7, PAD_ROWS=1 → 1*2 + 7 = 9
    expect(HEATMAP_ROWS).toBe(9);
  });

  it("bright cells have value equal to HEATMAP_MAX", () => {
    const cells = generatePixelHeatmap();
    const brightCells = cells.filter((c) => c.value === HEATMAP_MAX);
    // Each digit "2","0","2","6" contributes a known count of bright pixels
    // "2" = 5+1+1+5+1+1+5 = 19, "0" = 5+2+2+2+2+2+5 = 20, "6" = 5+1+1+5+2+2+5 = 21
    // Total = 19 + 20 + 19 + 21 = 79
    expect(brightCells.length).toBe(79);
  });

  it("background cells have values between 0 and 5", () => {
    const cells = generatePixelHeatmap();
    const bgCells = cells.filter((c) => c.value < HEATMAP_MAX);
    for (const cell of bgCells) {
      expect(cell.value).toBeGreaterThanOrEqual(0);
      expect(cell.value).toBeLessThanOrEqual(5);
    }
  });

  it("produces deterministic output for the same seed", () => {
    const a = generatePixelHeatmap(42);
    const b = generatePixelHeatmap(42);
    expect(a).toEqual(b);
  });

  it("produces different backgrounds for different seeds", () => {
    const a = generatePixelHeatmap(1);
    const b = generatePixelHeatmap(2);
    const aBg = a.filter((c) => c.value < HEATMAP_MAX).map((c) => c.value);
    const bBg = b.filter((c) => c.value < HEATMAP_MAX).map((c) => c.value);
    expect(aBg).not.toEqual(bBg);
  });
});
