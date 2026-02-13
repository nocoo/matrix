import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StaticPage from "@/pages/StaticPage";

describe("StaticPage", () => {
  it("renders the terms of service title", () => {
    render(<StaticPage />);
    expect(screen.getByText("TERMS OF SERVICE")).toBeInTheDocument();
  });

  it("renders the last updated date", () => {
    render(<StaticPage />);
    expect(screen.getByText("> last updated: 2026-02-13")).toBeInTheDocument();
  });

  it("renders end of document marker", () => {
    render(<StaticPage />);
    expect(screen.getByText("[END OF DOCUMENT]")).toBeInTheDocument();
  });

  it("renders return to dashboard link", () => {
    render(<StaticPage />);
    const link = screen.getByText("> return to dashboard");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/");
  });
});
