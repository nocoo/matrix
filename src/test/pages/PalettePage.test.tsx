import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PalettePage from "@/pages/PalettePage";

describe("PalettePage", () => {
  it("renders theme colors section", () => {
    render(<PalettePage />);
    expect(screen.getByText("MATRIX THEME COLORS")).toBeInTheDocument();
  });

  it("renders chart palette section", () => {
    render(<PalettePage />);
    expect(screen.getByText("CHART PALETTE (24 COLORS)")).toBeInTheDocument();
  });

  it("renders alpha variations section", () => {
    render(<PalettePage />);
    expect(screen.getByText("ALPHA VARIATIONS")).toBeInTheDocument();
  });

  it("renders primary color value", () => {
    render(<PalettePage />);
    expect(screen.getByText("#00FF41")).toBeInTheDocument();
  });
});
