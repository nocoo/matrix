import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StaticPage from "@/pages/StaticPage";

// Mock animated DecodingText
vi.mock("@/components/ui/MatrixExtras", () => ({
  DecodingText: ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>{text}</span>
  ),
}));

describe("StaticPage", () => {
  it("renders the terms of service title", () => {
    render(<StaticPage />);
    expect(screen.getByText("TERMS OF SERVICE")).toBeInTheDocument();
  });

  it("renders the last updated date via DecodingText", () => {
    render(<StaticPage />);
    expect(screen.getByText("> last updated: 2026-02-13")).toBeInTheDocument();
  });

  it("renders end of document marker", () => {
    render(<StaticPage />);
    expect(screen.getByText("[END OF DOCUMENT]")).toBeInTheDocument();
  });

  it("renders return to dashboard button", () => {
    render(<StaticPage />);
    expect(screen.getByText("> return to dashboard")).toBeInTheDocument();
  });
});
