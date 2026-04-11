import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MatrixButton } from "@/components/ui/MatrixButton";
import { createRef } from "react";

// ============================================
// MatrixButton
// ============================================

describe("MatrixButton", () => {
  // -------------------- Size variants --------------------

  it("renders with default size styling", () => {
    render(<MatrixButton>Default</MatrixButton>);
    const button = screen.getByRole("button", { name: "Default" });
    expect(button.className).toContain("px-3 py-2");
  });

  it("renders with header size styling", () => {
    render(<MatrixButton size="header">Header</MatrixButton>);
    const button = screen.getByRole("button", { name: "Header" });
    expect(button.className).toContain("matrix-header-chip");
    expect(button.className).toContain("matrix-header-action");
  });

  it("renders with small size styling", () => {
    render(<MatrixButton size="small">Small</MatrixButton>);
    const button = screen.getByRole("button", { name: "Small" });
    expect(button.className).toContain("px-2 py-1");
  });

  // -------------------- Variant styling --------------------

  it("renders with primary variant styling (default size)", () => {
    render(<MatrixButton primary>Primary</MatrixButton>);
    const button = screen.getByRole("button", { name: "Primary" });
    expect(button.className).toContain("bg-matrix-primary");
    expect(button.className).toContain("text-black");
  });

  it("renders with non-primary variant styling (default size)", () => {
    render(<MatrixButton primary={false}>Secondary</MatrixButton>);
    const button = screen.getByRole("button", { name: "Secondary" });
    expect(button.className).toContain("bg-matrix-panel");
    expect(button.className).toContain("text-matrix-primary");
  });

  it("renders with header size variant styling", () => {
    render(<MatrixButton size="header">Header Btn</MatrixButton>);
    const button = screen.getByRole("button", { name: "Header Btn" });
    // header variant always has text-matrix-primary regardless of primary prop
    expect(button.className).toContain("text-matrix-primary");
  });

  it("renders with header size primary true (still uses header variant)", () => {
    render(
      <MatrixButton size="header" primary>
        Header Primary
      </MatrixButton>,
    );
    const button = screen.getByRole("button", { name: "Header Primary" });
    // header variant styling takes precedence
    expect(button.className).toContain("text-matrix-primary");
  });

  // -------------------- Loading state --------------------

  it("shows loading indicator with pulse animation", () => {
    render(<MatrixButton loading>Submit</MatrixButton>);
    const button = screen.getByRole("button", { name: /Submit/ });
    // Loading adds a pulsing dot
    expect(button.querySelector(".animate-pulse")).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("disables button when loading", () => {
    render(<MatrixButton loading>Loading</MatrixButton>);
    const button = screen.getByRole("button", { name: /Loading/ });
    expect(button).toBeDisabled();
  });

  it("shows children alongside loading indicator", () => {
    render(<MatrixButton loading>Saving</MatrixButton>);
    expect(screen.getByText("Saving")).toBeInTheDocument();
    expect(screen.getByText("●")).toBeInTheDocument();
  });

  // -------------------- Disabled state --------------------

  it("can be disabled", () => {
    render(<MatrixButton disabled>Disabled</MatrixButton>);
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
  });

  it("applies disabled styling", () => {
    render(<MatrixButton disabled>Disabled</MatrixButton>);
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button.className).toContain("disabled:opacity-50");
  });

  // -------------------- Custom className --------------------

  it("applies custom className", () => {
    render(<MatrixButton className="custom-class">Styled</MatrixButton>);
    const button = screen.getByRole("button", { name: "Styled" });
    expect(button.className).toContain("custom-class");
  });

  // -------------------- Ref forwarding --------------------

  it("forwards ref to button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<MatrixButton ref={ref}>Ref Button</MatrixButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Ref Button");
  });

  // -------------------- Click handler --------------------

  it("calls onClick handler", () => {
    const onClick = vi.fn();
    render(<MatrixButton onClick={onClick}>Click Me</MatrixButton>);
    fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  // -------------------- as prop (polymorphic) --------------------

  it("renders as anchor when as='a' is provided", () => {
    render(
      <MatrixButton as="a" href="/link">
        Link
      </MatrixButton>,
    );
    const anchor = screen.getByRole("link", { name: "Link" });
    expect(anchor.tagName).toBe("A");
    expect(anchor).toHaveAttribute("href", "/link");
  });

  it("renders as button by default", () => {
    render(<MatrixButton>Button</MatrixButton>);
    const button = screen.getByRole("button", { name: "Button" });
    expect(button.tagName).toBe("BUTTON");
  });

  // -------------------- HTML attributes --------------------

  it("forwards HTML attributes like type", () => {
    render(<MatrixButton type="submit">Submit</MatrixButton>);
    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
  });

  it("forwards aria attributes", () => {
    render(<MatrixButton aria-label="Custom label">Icon</MatrixButton>);
    const button = screen.getByRole("button", { name: "Custom label" });
    expect(button).toBeInTheDocument();
  });
});
