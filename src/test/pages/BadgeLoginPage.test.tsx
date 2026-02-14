import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BadgeLoginPage from "@/pages/BadgeLoginPage";

vi.mock("@/components/ui/MatrixExtras", () => ({
  TypewriterText: ({ text, className }: { text: string; className?: string }) => (
    <span className={className}>{text}</span>
  ),
  MatrixInput: ({
    label,
    className = "",
    ...props
  }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className={className}>
      <span>{label}</span>
      <input {...props} />
    </label>
  ),
}));

describe("BadgeLoginPage", () => {
  it("renders the badge authentication title", () => {
    render(<BadgeLoginPage />);
    expect(screen.getByText("BADGE AUTHENTICATION")).toBeInTheDocument();
  });

  it("renders instruction text via TypewriterText", () => {
    render(<BadgeLoginPage />);
    expect(screen.getByText("scan your badge or enter ID")).toBeInTheDocument();
  });

  it("renders badge id input via MatrixInput", () => {
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
