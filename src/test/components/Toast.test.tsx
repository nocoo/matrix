import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toast } from "@/components/ui/Toast";

describe("Toast", () => {
  it("renders success toast with message", () => {
    render(<Toast tone="success" message="Operation complete" onClose={() => {}} />);
    expect(screen.getByText("Operation complete")).toBeInTheDocument();
  });

  it("renders error toast with message", () => {
    render(<Toast tone="error" message="Something failed" onClose={() => {}} />);
    expect(screen.getByText("Something failed")).toBeInTheDocument();
  });

  it("renders detail text when provided", () => {
    render(<Toast tone="success" message="Done" detail="Extra info" onClose={() => {}} />);
    expect(screen.getByText("Extra info")).toBeInTheDocument();
  });

  it("does not render detail when null", () => {
    render(<Toast tone="success" message="Done" detail={null} onClose={() => {}} />);
    expect(screen.queryByText("Extra info")).not.toBeInTheDocument();
  });

  it("calls onClose when clicked", () => {
    const onClose = vi.fn();
    render(<Toast tone="success" message="Done" onClose={onClose} />);
    fireEvent.click(screen.getByText("Done").closest("div.fixed")!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("auto-closes after durationMs", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast tone="success" message="Done" onClose={onClose} durationMs={3000} />);

    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(onClose).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it("does not auto-close when durationMs is not set", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast tone="success" message="Done" onClose={onClose} />);

    vi.advanceTimersByTime(10000);
    expect(onClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Toast tone="success" message="Done" onClose={() => {}} className="custom-class" />,
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});
