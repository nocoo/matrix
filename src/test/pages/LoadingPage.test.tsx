import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import LoadingPage from "@/pages/LoadingPage";

describe("LoadingPage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the matrix header", () => {
    vi.useFakeTimers();
    render(<LoadingPage />);
    expect(screen.getByText("[MATRIX]")).toBeInTheDocument();
    expect(screen.getByText("system boot sequence")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows initial progress at 0%", () => {
    vi.useFakeTimers();
    render(<LoadingPage />);
    expect(screen.getByText("0%")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows boot messages after timer ticks", () => {
    vi.useFakeTimers();
    render(<LoadingPage />);

    // Advance past first message
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByText("initializing kernel...")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("completes boot sequence after all messages", () => {
    vi.useFakeTimers();
    render(<LoadingPage />);

    // Advance one tick at a time to allow React to batch properly
    for (let i = 0; i < 10; i++) {
      act(() => {
        vi.advanceTimersByTime(400);
      });
    }

    expect(screen.getByText("initializing kernel...")).toBeInTheDocument();
    expect(screen.getByText("system ready.")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    vi.useRealTimers();
  });
});
