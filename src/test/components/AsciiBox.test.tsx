import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AsciiBox, ASCII_CHARS } from "@/components/ui/AsciiBox";

// ============================================
// AsciiBox
// ============================================

describe("AsciiBox", () => {
  it("renders with title and children", () => {
    render(
      <AsciiBox title="TEST BOX">
        <p>Hello content</p>
      </AsciiBox>,
    );
    expect(screen.getByText("TEST BOX")).toBeInTheDocument();
    expect(screen.getByText("Hello content")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <AsciiBox title="MAIN" subtitle="secondary">
        <span>Content</span>
      </AsciiBox>,
    );
    expect(screen.getByText("[secondary]")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    const { container } = render(
      <AsciiBox title="MAIN">
        <span>Content</span>
      </AsciiBox>,
    );
    // No element containing brackets for subtitle
    expect(container.textContent).not.toContain("[");
  });

  it("renders headerRight when provided", () => {
    render(
      <AsciiBox title="HEADER" headerRight={<button>Action</button>}>
        <span>Body</span>
      </AsciiBox>,
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("does not render headerRight container when not provided", () => {
    const { container } = render(
      <AsciiBox title="HEADER">
        <span>Body</span>
      </AsciiBox>,
    );
    // The shrink-0 ml-2 mr-3 span should not exist
    const headerRightSpan = container.querySelector("span.shrink-0.ml-2.mr-3");
    expect(headerRightSpan).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AsciiBox title="STYLED" className="custom-class">
        <span>Content</span>
      </AsciiBox>,
    );
    expect(container.firstElementChild?.className).toContain("custom-class");
  });

  it("applies bodyClassName to body section", () => {
    const { container } = render(
      <AsciiBox title="BODY" bodyClassName="body-style">
        <span>Content</span>
      </AsciiBox>,
    );
    // The body section contains the children
    const bodySection = container.querySelector(".body-style");
    expect(bodySection).toBeInTheDocument();
    expect(bodySection?.textContent).toContain("Content");
  });

  it("renders ASCII border characters", () => {
    const { container } = render(
      <AsciiBox title="BORDER">
        <span>Content</span>
      </AsciiBox>,
    );
    expect(container.textContent).toContain(ASCII_CHARS.TOP_LEFT);
    expect(container.textContent).toContain(ASCII_CHARS.TOP_RIGHT);
    expect(container.textContent).toContain(ASCII_CHARS.BOTTOM_LEFT);
    expect(container.textContent).toContain(ASCII_CHARS.BOTTOM_RIGHT);
    expect(container.textContent).toContain(ASCII_CHARS.HORIZONTAL);
    expect(container.textContent).toContain(ASCII_CHARS.VERTICAL);
  });

  it("renders ReactNode as title", () => {
    render(
      <AsciiBox title={<span data-testid="custom-title">Custom</span>}>
        <span>Content</span>
      </AsciiBox>,
    );
    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
  });

  it("renders with both subtitle and headerRight", () => {
    render(
      <AsciiBox title="FULL" subtitle="sub" headerRight={<span>Right</span>}>
        <span>Body</span>
      </AsciiBox>,
    );
    expect(screen.getByText("[sub]")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });
});
