import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/pages/NotFound";

// Mock MatrixRain since it uses canvas
vi.mock("@/components/ui/MatrixExtras", () => ({
  MatrixRain: () => <div data-testid="matrix-rain" />,
}));

describe("NotFound", () => {
  it("renders 404 text", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<NotFound />);
    expect(screen.getByText("> ERROR: node not found in the matrix")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<NotFound />);
    expect(screen.getByText("the requested path does not exist in this reality")).toBeInTheDocument();
  });

  it("renders return to base link", () => {
    render(<NotFound />);
    const link = screen.getByText("[RETURN TO BASE]");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });
});
