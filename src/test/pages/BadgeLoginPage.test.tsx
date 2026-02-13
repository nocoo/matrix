import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BadgeLoginPage from "@/pages/BadgeLoginPage";

describe("BadgeLoginPage", () => {
  it("renders the badge authentication title", () => {
    render(<BadgeLoginPage />);
    expect(screen.getByText("BADGE AUTHENTICATION")).toBeInTheDocument();
  });

  it("renders badge id input", () => {
    render(<BadgeLoginPage />);
    expect(screen.getByPlaceholderText("XXXX-XXXX-XXXX")).toBeInTheDocument();
  });

  it("renders verify button", () => {
    render(<BadgeLoginPage />);
    expect(screen.getByText("[VERIFY]")).toBeInTheDocument();
  });

  it("renders email login link", () => {
    render(<BadgeLoginPage />);
    expect(screen.getByText("> use email login instead")).toBeInTheDocument();
  });
});
