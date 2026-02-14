import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingPage from "@/pages/LoadingPage";

vi.mock("@/components/ui/MatrixExtras", () => ({
  BootScreen: () => (
    <div>
      <div className="animate-pulse">INITIALIZING NEURAL INTERFACE...</div>
    </div>
  ),
}));

describe("LoadingPage", () => {
  it("renders the boot screen", () => {
    render(<LoadingPage />);
    expect(screen.getByText("INITIALIZING NEURAL INTERFACE...")).toBeInTheDocument();
  });

  it("renders inside a full-screen container", () => {
    const { container } = render(<LoadingPage />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("min-h-screen");
  });
});
