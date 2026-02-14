import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/pages/NotFound";

// Mock animated components and MatrixRain (canvas)
vi.mock("@/components/ui/MatrixExtras", () => ({
  MatrixRain: () => <div data-testid="matrix-rain" />,
  ScrambleText: ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>{text}</span>
  ),
  TypewriterText: ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>{text}</span>
  ),
}));

describe("NotFound", () => {
  it("renders 404 text via ScrambleText", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders error message via TypewriterText", () => {
    render(<NotFound />);
    expect(screen.getByText("> ERROR: node not found in the matrix")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<NotFound />);
    expect(screen.getByText("the requested path does not exist in this reality")).toBeInTheDocument();
  });

  it("renders return to base button", () => {
    render(<NotFound />);
    expect(screen.getByText("[RETURN TO BASE]")).toBeInTheDocument();
  });

  it("renders MatrixRain background", () => {
    render(<NotFound />);
    expect(screen.getByTestId("matrix-rain")).toBeInTheDocument();
  });
});
