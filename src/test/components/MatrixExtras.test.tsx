import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  MatrixAvatar,
  ScrambleText,
  DecodingText,
  SignalBox,
  MatrixInput,
  TypewriterText,
  ConnectionStatus,
  DataRow,
  LeaderboardRow,
  LiveSniffer,
  Sparkline,
  MatrixRain,
  BootScreen,
} from "@/components/ui/MatrixExtras";

// ---------------------------------------------------------------------------
// MatrixAvatar
// ---------------------------------------------------------------------------
describe("MatrixAvatar", () => {
  it("renders with default props", () => {
    const { container } = render(<MatrixAvatar />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it('renders "?" for isAnon', () => {
    render(<MatrixAvatar isAnon />);
    expect(screen.getByText("?")).toBeInTheDocument();
    // Should NOT render an SVG when anonymous
    expect(screen.queryByText("?")!.closest("div")!.querySelector("svg")).toBeNull();
  });

  it("renders gold styling for isTheOne", () => {
    const { container } = render(<MatrixAvatar isTheOne />);
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toContain("border-yellow");
    // Should have the pulse overlay div
    const pulseDiv = container.querySelector(".animate-pulse");
    expect(pulseDiv).toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(<MatrixAvatar size={128} />);
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.style.width).toBe("128px");
    expect(outer.style.height).toBe("128px");
  });

  it("generates different grid for different names", () => {
    const { container: c1 } = render(<MatrixAvatar name="alice" />);
    const { container: c2 } = render(<MatrixAvatar name="bob" />);
    const rects1 = c1.querySelectorAll("rect");
    const rects2 = c2.querySelectorAll("rect");
    const serialize = (rects: NodeListOf<Element>) =>
      Array.from(rects)
        .map((r) => `${r.getAttribute("x")},${r.getAttribute("y")}`)
        .join("|");
    expect(serialize(rects1)).not.toEqual(serialize(rects2));
  });

  it("applies custom className", () => {
    const { container } = render(<MatrixAvatar className="my-custom" />);
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toContain("my-custom");
  });

  it("isAnon applies custom size correctly", () => {
    const { container } = render(<MatrixAvatar isAnon size={48} />);
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.style.width).toBe("48px");
    expect(outer.style.height).toBe("48px");
  });
});

// ---------------------------------------------------------------------------
// ScrambleText
// ---------------------------------------------------------------------------
describe("ScrambleText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders exact text when active=false", () => {
    render(<ScrambleText text="Hello" active={false} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders scrambled then resolves to final text", () => {
    // Mock requestAnimationFrame to call callback with increasing timestamps
    let rafCallbacks: Array<(time: number) => void> = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    render(<ScrambleText text="Hello" durationMs={100} />);

    // Flush all raf callbacks with a timestamp well past the duration
    act(() => {
      // Process up to 50 raf frames, advancing time
      for (let t = 0; t < 50 && rafCallbacks.length > 0; t++) {
        const cbs = [...rafCallbacks];
        rafCallbacks = [];
        cbs.forEach((cb) => cb(t * 50)); // Each frame 50ms apart
      }
    });

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("handles startScrambled=true with active", () => {
    let rafCallbacks: Array<(time: number) => void> = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    const { container } = render(
      <ScrambleText text="ABCDEFGHIJ" durationMs={100} startScrambled active />,
    );

    // Before processing any raf — display should be scrambled (set in initial state + effect)
    const span = container.querySelector("span")!;
    expect(span.textContent!.length).toBe(10);

    // Now resolve fully
    act(() => {
      for (let t = 0; t < 50 && rafCallbacks.length > 0; t++) {
        const cbs = [...rafCallbacks];
        rafCallbacks = [];
        cbs.forEach((cb) => cb(t * 50));
      }
    });
    expect(span.textContent).toBe("ABCDEFGHIJ");
  });

  it("handles empty text", () => {
    const { container } = render(<ScrambleText text="" />);
    const span = container.querySelector("span")!;
    expect(span.textContent).toBe("");
  });

  it("applies className", () => {
    const { container } = render(<ScrambleText text="X" className="my-cls" active={false} />);
    expect(container.querySelector(".my-cls")).toBeInTheDocument();
  });

  it("handles loop with loopDelayMs", () => {
    let rafCallbacks: Array<(time: number) => void> = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    render(<ScrambleText text="Loop" durationMs={50} loop loopDelayMs={500} />);

    // Resolve animation completely
    act(() => {
      for (let t = 0; t < 20 && rafCallbacks.length > 0; t++) {
        const cbs = [...rafCallbacks];
        rafCallbacks = [];
        cbs.forEach((cb) => cb(t * 100));
      }
    });

    expect(screen.getByText("Loop")).toBeInTheDocument();

    // Now advance past loopDelayMs to trigger the restart setTimeout
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Process newly queued raf callbacks from the loop restart
    act(() => {
      for (let t = 0; t < 20 && rafCallbacks.length > 0; t++) {
        const cbs = [...rafCallbacks];
        rafCallbacks = [];
        cbs.forEach((cb) => cb(t * 100));
      }
    });

    // Should still resolve to the text after looping
    expect(screen.getByText("Loop")).toBeInTheDocument();
  });

  it("cleans up on unmount", () => {
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((_cb) => {
      return 42;
    });

    const { unmount } = render(<ScrambleText text="Cleanup" durationMs={1000} />);
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// DecodingText
// ---------------------------------------------------------------------------
describe("DecodingText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("eventually shows final text", () => {
    render(<DecodingText text="Matrix" />);
    // step = max(1, ceil(6/12)) = 1, needs ~6 intervals of 24ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText("Matrix")).toBeInTheDocument();
  });

  it("handles empty text", () => {
    const { container } = render(<DecodingText text="" />);
    const span = container.querySelector("span")!;
    expect(span.textContent).toBe("");
  });

  it("applies className", () => {
    const { container } = render(<DecodingText text="Hi" className="decode-cls" />);
    expect(container.querySelector(".decode-cls")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SignalBox
// ---------------------------------------------------------------------------
describe("SignalBox", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders default title SIGNAL and children", () => {
    render(
      <SignalBox>
        <p>Hello child</p>
      </SignalBox>,
    );
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText("SIGNAL")).toBeInTheDocument();
    expect(screen.getByText("Hello child")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(
      <SignalBox title="CUSTOM">
        <span>Content</span>
      </SignalBox>,
    );
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText("CUSTOM")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SignalBox className="extra-cls">
        <span />
      </SignalBox>,
    );
    expect(container.firstElementChild!.className).toContain("extra-cls");
  });

  it("renders decorative corner elements", () => {
    const { container } = render(
      <SignalBox>
        <span>test</span>
      </SignalBox>,
    );
    // Two corner dots
    const cornerDots = container.querySelectorAll(".bg-matrix-primary.opacity-60");
    expect(cornerDots.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// MatrixInput
// ---------------------------------------------------------------------------
describe("MatrixInput", () => {
  it("renders label and input", () => {
    render(<MatrixInput label="Username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("onChange works", () => {
    const onChange = vi.fn();
    render(<MatrixInput label="Email" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a@b.com" } });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("forwards HTML attributes", () => {
    render(<MatrixInput label="Password" type="password" placeholder="Enter..." />);
    const input = screen.getByPlaceholderText("Enter...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  it("applies custom className", () => {
    const { container } = render(<MatrixInput label="X" className="inp-cls" />);
    const label = container.querySelector("label")!;
    expect(label.className).toContain("inp-cls");
  });
});

// ---------------------------------------------------------------------------
// TypewriterText
// ---------------------------------------------------------------------------
describe("TypewriterText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows full text immediately when active=false", () => {
    render(<TypewriterText text="Full text" active={false} />);
    expect(screen.getByText("Full text", { selector: '[aria-hidden="true"]' })).toBeInTheDocument();
  });

  it("cursor is visible by default", () => {
    render(<TypewriterText text="Hi" active={false} />);
    expect(screen.getByText("|")).toBeInTheDocument();
  });

  it("cursor hidden when cursor=false", () => {
    render(<TypewriterText text="Hi" active={false} cursor={false} />);
    expect(screen.queryByText("|")).not.toBeInTheDocument();
  });

  it("has sr-only text for accessibility", () => {
    render(<TypewriterText text="Secret" active={false} />);
    const srOnly = screen.getByText("Secret", { selector: ".sr-only" });
    expect(srOnly).toBeInTheDocument();
  });

  it("types text character by character", () => {
    render(<TypewriterText text="ABC" speedMs={50} startDelayMs={0} />);

    // startDelayMs=0 → setTimeout(() => step(1), 0) fires immediately on advance
    // step(1): setCount(1) → "A", then setTimeout(() => step(2), 50)
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // After the initial setTimeout(0), step(1) runs → count=1 → "A"
    // But step(1) also schedules step(2) at 50ms
    // The effect also sets count to 0 first, then setTimeout(..., 0) runs step(1)
    // Let's advance by 1ms to flush the 0-delay timer
    act(() => {
      vi.advanceTimersByTime(1);
    });

    const visibleSpan = document.querySelector('[aria-hidden="true"].whitespace-pre')!;
    expect(visibleSpan.textContent).toBe("A");

    // Advance 50ms → step(2) → "AB"
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(visibleSpan.textContent).toBe("AB");

    // Advance 50ms → step(3) → "ABC"
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(visibleSpan.textContent).toBe("ABC");
  });

  it("handles startDelayMs", () => {
    render(<TypewriterText text="Delay" speedMs={10} startDelayMs={200} />);
    const visibleSpan = document.querySelector('[aria-hidden="true"].whitespace-pre')!;

    // After 100ms (less than delay), still empty
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(visibleSpan.textContent).toBe("");

    // After the delay fires (200ms total) + enough for all chars (5 * 10ms = 50ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(visibleSpan.textContent!.length).toBeGreaterThan(0);
  });

  it("loops when loop=true", () => {
    render(<TypewriterText text="AB" speedMs={10} startDelayMs={0} loop loopDelayMs={100} />);
    const visibleSpan = document.querySelector('[aria-hidden="true"].whitespace-pre')!;

    // Type all chars: setTimeout(0) → step(1), setTimeout(10) → step(2)
    act(() => {
      vi.advanceTimersByTime(1); // flush 0-delay
    });
    act(() => {
      vi.advanceTimersByTime(10); // step(2) → count=2 → "AB"
    });
    expect(visibleSpan.textContent).toBe("AB");

    // After step(2), since loop=true, setTimeout(() => step(0), 100) is scheduled
    act(() => {
      vi.advanceTimersByTime(100); // fires step(0) → count=0 → ""
    });
    expect(visibleSpan.textContent).toBe("");
  });

  it("handles empty text", () => {
    const { container } = render(<TypewriterText text="" />);
    const spans = container.querySelectorAll("span");
    expect(spans.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// ConnectionStatus
// ---------------------------------------------------------------------------
describe("ConnectionStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders with STABLE (default) — shows 0 or 1", () => {
    render(<ConnectionStatus />);
    expect(screen.getAllByText("[").length).toBeGreaterThan(0);
    expect(screen.getAllByText("]").length).toBeGreaterThan(0);
    const indicator = screen.getByText(/^[01]$/);
    expect(indicator).toBeInTheDocument();
  });

  it("UNSTABLE shows '!'", () => {
    render(<ConnectionStatus status="UNSTABLE" />);
    expect(screen.getByText("!")).toBeInTheDocument();
  });

  it("LOST shows '×'", () => {
    render(<ConnectionStatus status="LOST" />);
    expect(screen.getByText("×")).toBeInTheDocument();
  });

  it("passes title through", () => {
    const { container } = render(<ConnectionStatus title="Status tip" />);
    const outer = container.firstElementChild as HTMLElement;
    expect(outer).toHaveAttribute("title", "Status tip");
  });

  it("STABLE bit toggles over time", () => {
    // Mock Math.random before rendering so initial state uses it
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.9);

    render(<ConnectionStatus status="STABLE" />);

    // The initial state is "0" (from useState("0")). The interval fires every 150ms.
    // First interval tick with random=0.9 (>0.5) → "1"
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByText("1")).toBeInTheDocument();

    // Now mock to return 0.1 → "0"
    randomSpy.mockReturnValue(0.1);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ConnectionStatus className="conn-cls" />);
    expect(container.firstElementChild!.className).toContain("conn-cls");
  });

  it("does not start interval for non-STABLE status", () => {
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    render(<ConnectionStatus status="LOST" />);
    // setInterval should not have been called for this render
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// DataRow
// ---------------------------------------------------------------------------
describe("DataRow", () => {
  it("renders label and value", () => {
    render(<DataRow label="Status" value="Active" />);
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders subValue when provided", () => {
    render(<DataRow label="Speed" value="100" subValue="mbps" />);
    expect(screen.getByText("mbps")).toBeInTheDocument();
  });

  it("does not render subValue span when not provided", () => {
    const { container } = render(<DataRow label="Speed" value="100" />);
    expect(container.querySelector(".italic")).not.toBeInTheDocument();
  });

  it("applies custom valueClassName", () => {
    render(<DataRow label="X" value="Y" valueClassName="val-cls" />);
    const valueEl = screen.getByText("Y");
    expect(valueEl.className).toContain("val-cls");
  });

  it("renders numeric value", () => {
    render(<DataRow label="Count" value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// LeaderboardRow
// ---------------------------------------------------------------------------
describe("LeaderboardRow", () => {
  it("renders rank, name, and value", () => {
    render(<LeaderboardRow rank={1} name="Alice" value="1000" />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("formats rank with leading zero", () => {
    render(<LeaderboardRow rank={5} name="Bob" value="500" />);
    expect(screen.getByText("05")).toBeInTheDocument();
  });

  it("isSelf adds highlight class", () => {
    const { container } = render(<LeaderboardRow rank={2} name="Me" value="900" isSelf />);
    const row = container.firstElementChild as HTMLElement;
    expect(row.className).toContain("border-l-matrix-primary");
  });

  it("isAnon adds blur class", () => {
    render(<LeaderboardRow rank={3} name="????" value="800" isAnon />);
    const nameSpan = screen.getByText("????");
    expect(nameSpan.className).toContain("blur");
  });

  it("numeric value gets formatted with toLocaleString", () => {
    render(<LeaderboardRow rank={1} name="Big" value={1234567} />);
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <LeaderboardRow rank={1} name="X" value="1" className="lb-cls" />,
    );
    expect(container.firstElementChild!.className).toContain("lb-cls");
  });

  it("rank=1 defaults to gold (isTheOne)", () => {
    const { container } = render(<LeaderboardRow rank={1} name="Champ" value="999" />);
    const yellowBorder = container.querySelector('[class*="border-yellow"]');
    expect(yellowBorder).toBeInTheDocument();
  });

  it("rank > 1 without isTheOne does not show gold", () => {
    const { container } = render(<LeaderboardRow rank={5} name="Norm" value="100" />);
    const yellowBorder = container.querySelector('[class*="border-yellow"]');
    expect(yellowBorder).not.toBeInTheDocument();
  });

  it("double-digit rank does not pad", () => {
    render(<LeaderboardRow rank={12} name="X" value="1" />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// LiveSniffer
// ---------------------------------------------------------------------------
describe("LiveSniffer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders initial logs", () => {
    render(<LiveSniffer />);
    expect(screen.getByText("[SYSTEM] Live sniffer initialized")).toBeInTheDocument();
    expect(screen.getByText("[SOCKET] Connection established")).toBeInTheDocument();
  });

  it("logs rotate after timer advance", () => {
    const { container } = render(<LiveSniffer />);

    const getLogTexts = () =>
      Array.from(container.querySelectorAll(".animate-pulse")).map((el) => el.textContent);

    const initialLogs = getLogTexts();
    expect(initialLogs).toHaveLength(2);

    // First interval tick adds events[0]
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText(">> INTERCEPTING DATA STREAM...")).toBeInTheDocument();

    // Keep advancing — new events should appear
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    const laterLogs = getLogTexts();
    // Should have accumulated more logs (up to 5)
    expect(laterLogs.length).toBeGreaterThan(2);
    // At least one log from the events array should be present
    const hasEvent = laterLogs.some((t) => t?.startsWith(">>"));
    expect(hasEvent).toBe(true);
  });

  it("keeps only last 5 logs after many ticks", () => {
    const { container } = render(<LiveSniffer />);
    // Advance enough ticks to exceed 5 entries
    // Each tick does: prev.slice(-4) + new = max 5 entries
    act(() => {
      vi.advanceTimersByTime(1500 * 10);
    });
    const logDivs = container.querySelectorAll(".animate-pulse");
    expect(logDivs.length).toBeLessThanOrEqual(5);
  });
});

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------
describe("Sparkline", () => {
  it("renders SVG with valid data via values prop", () => {
    const { container } = render(<Sparkline values={[10, 20, 30, 40]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg!.querySelector("path")).toBeInTheDocument();
  });

  it("renders SVG with valid data via data prop", () => {
    const { container } = render(<Sparkline data={[5, 15, 25]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("returns null for insufficient data (less than 2 points)", () => {
    const { container } = render(<Sparkline values={[42]} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when no data provided", () => {
    const { container } = render(<Sparkline />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null for empty array", () => {
    const { container } = render(<Sparkline values={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("applies custom dimensions", () => {
    const { container } = render(<Sparkline values={[1, 2, 3]} width={300} height={60} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("300");
    expect(svg.getAttribute("height")).toBe("60");
    expect(svg.getAttribute("viewBox")).toBe("0 0 300 60");
  });

  it("applies custom color", () => {
    const { container } = render(<Sparkline values={[1, 2]} color="#FF0000" />);
    const path = container.querySelector("path")!;
    expect(path.getAttribute("stroke")).toBe("#FF0000");
  });

  it("values prop takes precedence over data prop", () => {
    const { container } = render(<Sparkline values={[1, 2]} data={[10, 20, 30]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const path = svg!.querySelector("path")!;
    const d = path.getAttribute("d")!;
    // 2 points = M + L (2 segments)
    const commands = d.split(/(?=[ML])/);
    expect(commands.length).toBe(2);
  });

  it("handles all-same values (span = 0 edge case)", () => {
    const { container } = render(<Sparkline values={[5, 5, 5]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// MatrixRain
// ---------------------------------------------------------------------------
describe("MatrixRain", () => {
  let rafCallbacks: Array<(time: number) => void>;
  let fakeCtx: Record<string, unknown>;

  beforeEach(() => {
    rafCallbacks = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

    // Provide a fake 2d context so the effect doesn't bail out
    fakeCtx = {
      fillStyle: "",
      font: "",
      textBaseline: "",
      imageSmoothingEnabled: false,
      fillRect: vi.fn(),
      fillText: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(fakeCtx as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a canvas element", () => {
    const { container } = render(<MatrixRain />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas!.className).toContain("absolute");
  });

  it("sets up animation and processes frames", () => {
    vi.spyOn(performance, "now").mockReturnValue(0);

    const { container } = render(<MatrixRain />);
    expect(container.querySelector("canvas")).toBeInTheDocument();

    // The effect calls resize() then start() which sets lastFrameTime=0 (from perf.now mock)
    // and schedules requestAnimationFrame(loop).
    // fps=8 → frameInterval = 125ms. We need time >= 125 to trigger drawFrame.
    act(() => {
      if (rafCallbacks.length > 0) {
        const cbs = [...rafCallbacks];
        rafCallbacks = [];
        cbs.forEach((cb) => cb(200)); // 200ms > 125ms frameInterval
      }
    });

    // drawFrame should have been called — fillRect is invoked inside it
    expect(fakeCtx.fillRect).toHaveBeenCalled();
  });

  it("cleans up on unmount — removes event listeners", () => {
    const removeWindowSpy = vi.spyOn(window, "removeEventListener");
    const removeDocSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(<MatrixRain />);
    unmount();

    expect(removeWindowSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(removeDocSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
  });

  it("handles resize event", () => {
    render(<MatrixRain />);

    // Trigger resize
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // handleResize schedules a raf for resize — process it
    act(() => {
      if (rafCallbacks.length > 0) {
        const cbs = [...rafCallbacks];
        rafCallbacks = [];
        cbs.forEach((cb) => cb(0));
      }
    });

    // No crash = success, resize ran
    expect(fakeCtx.font).toMatch(/\d+px monospace/);
  });

  it("handles visibility change — pause and resume", () => {
    render(<MatrixRain />);

    // Simulate going hidden
    Object.defineProperty(document, "visibilityState", {
      value: "hidden",
      writable: true,
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // cancelAnimationFrame should have been called (stop)
    expect(window.cancelAnimationFrame).toHaveBeenCalled();

    // Simulate coming visible again
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      writable: true,
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // New raf should be scheduled (start)
    expect(rafCallbacks.length).toBeGreaterThan(0);
  });

  it("canvas has proper styling", () => {
    const { container } = render(<MatrixRain />);
    const canvas = container.querySelector("canvas")!;
    expect(canvas.style.width).toBe("100%");
    expect(canvas.style.height).toBe("100%");
    expect(canvas.className).toContain("pointer-events-none");
  });
});

// ---------------------------------------------------------------------------
// BootScreen
// ---------------------------------------------------------------------------
describe("BootScreen", () => {
  it("renders ASCII art and loading text", () => {
    render(<BootScreen />);
    const pre = document.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre!.textContent).toContain("███");
    expect(screen.getByText("INITIALIZING NEURAL INTERFACE...")).toBeInTheDocument();
  });

  it('shows "Click to skip" when onSkip provided', () => {
    render(<BootScreen onSkip={() => {}} />);
    expect(screen.getByText("Click to skip")).toBeInTheDocument();
  });

  it('does not show "Click to skip" when no onSkip', () => {
    render(<BootScreen />);
    expect(screen.queryByText("Click to skip")).not.toBeInTheDocument();
  });

  it("click calls onSkip", () => {
    const onSkip = vi.fn();
    render(<BootScreen onSkip={onSkip} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it("has button role when onSkip provided", () => {
    render(<BootScreen onSkip={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not have button role when no onSkip", () => {
    render(<BootScreen />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("has loading bar", () => {
    const { container } = render(<BootScreen />);
    // The progress bar container
    const bar = container.querySelector(".bg-matrix-panel-strong");
    expect(bar).toBeInTheDocument();
  });

  it("has cursor-pointer class when skippable", () => {
    const { container } = render(<BootScreen onSkip={() => {}} />);
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toContain("cursor-pointer");
  });

  it("does not have cursor-pointer class when not skippable", () => {
    const { container } = render(<BootScreen />);
    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).not.toContain("cursor-pointer");
  });
});
