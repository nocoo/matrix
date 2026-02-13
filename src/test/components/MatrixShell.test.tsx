import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatrixShell } from "@/components/ui/MatrixShell";

// Mock MatrixRain and MatrixAvatar since MatrixRain uses canvas
vi.mock("@/components/ui/MatrixExtras", () => ({
  MatrixRain: () => <div data-testid="matrix-rain" />,
  MatrixAvatar: ({ name }: { name: string }) => <div data-testid="matrix-avatar">{name}</div>,
}));

describe("MatrixShell", () => {
  it("renders children", () => {
    render(<MatrixShell>Hello World</MatrixShell>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders default title 'Matrix'", () => {
    render(<MatrixShell>content</MatrixShell>);
    expect(screen.getByText("Matrix")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<MatrixShell title="Custom Title">content</MatrixShell>);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders Dashboard text in header", () => {
    render(<MatrixShell>content</MatrixShell>);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders default System Online status", () => {
    render(<MatrixShell>content</MatrixShell>);
    expect(screen.getByText("System Online")).toBeInTheDocument();
  });

  it("renders custom header status", () => {
    render(<MatrixShell headerStatus={<span>Custom Status</span>}>content</MatrixShell>);
    expect(screen.getByText("Custom Status")).toBeInTheDocument();
    expect(screen.queryByText("System Online")).not.toBeInTheDocument();
  });

  it("renders headerRight when provided", () => {
    render(<MatrixShell headerRight={<span>Right Content</span>}>content</MatrixShell>);
    expect(screen.getByText("Right Content")).toBeInTheDocument();
  });

  it("hides header when hideHeader is true", () => {
    render(<MatrixShell hideHeader>content</MatrixShell>);
    expect(screen.queryByText("System Online")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("renders MatrixRain when showRain is true", () => {
    render(<MatrixShell showRain>content</MatrixShell>);
    expect(screen.getByTestId("matrix-rain")).toBeInTheDocument();
  });

  it("does not render MatrixRain by default", () => {
    render(<MatrixShell>content</MatrixShell>);
    expect(screen.queryByTestId("matrix-rain")).not.toBeInTheDocument();
  });

  it("renders MatrixAvatar when showAvatar is true", () => {
    render(<MatrixShell showAvatar avatarName="test-user">content</MatrixShell>);
    expect(screen.getByTestId("matrix-avatar")).toBeInTheDocument();
    expect(screen.getByText("test-user")).toBeInTheDocument();
  });

  it("renders default footer text", () => {
    render(<MatrixShell>content</MatrixShell>);
    expect(screen.getByText("Matrix Dashboard v1.0")).toBeInTheDocument();
    expect(screen.getByText("matrix + opencode")).toBeInTheDocument();
  });

  it("renders custom footer content", () => {
    render(
      <MatrixShell footerLeft={<span>Left</span>} footerRight={<span>Right</span>}>
        content
      </MatrixShell>,
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
    expect(screen.queryByText("Matrix Dashboard v1.0")).not.toBeInTheDocument();
  });
});
