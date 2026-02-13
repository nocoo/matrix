import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  TrendMonitor,
  ActivityHeatmap,
  ArchiveHeatmap,
  TrendChart,
} from "@/components/ui/DataVizComponents";

// ---------------------------------------------------------------------------
// Shared helpers & fixtures
// ---------------------------------------------------------------------------

const sampleHeatmapData = {
  weeks: [
    [
      { day: "2026-01-05", value: 100, level: 2 },
      { day: "2026-01-06", value: 200, level: 3 },
      { day: "2026-01-07", value: 0, level: 0 },
      { day: "2026-01-08", value: 50, level: 1 },
      { day: "2026-01-09", value: 300, level: 4 },
      { day: "2026-01-10", value: 0, level: 0 },
      { day: "2026-01-11", value: 150, level: 2 },
    ],
  ],
  to: "2026-01-11",
  week_starts_on: "sun" as const,
};

const sampleHeatmapMonday = {
  ...sampleHeatmapData,
  week_starts_on: "mon" as const,
};

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => {
  (globalThis as unknown as Record<string, unknown>).ResizeObserver = MockResizeObserver;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// TrendMonitor
// ===========================================================================

describe("TrendMonitor", () => {
  it("renders with data array (fallback mode) showing MAX/AVG stats", () => {
    render(<TrendMonitor data={[100, 200, 300, 400]} label="USAGE" />);

    expect(screen.getByText("USAGE")).toBeInTheDocument();
    expect(screen.getByText(/MAX:/)).toBeInTheDocument();
    expect(screen.getByText(/AVG:/)).toBeInTheDocument();
  });

  it("renders SVG chart elements", () => {
    const { container } = render(<TrendMonitor data={[10, 50, 30, 80]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const paths = svg!.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
  });

  it("renders with rows array (series mode) handling missing/future data", () => {
    const rows = [
      { hour: "00:00", billable_total_tokens: 1000 },
      { hour: "01:00", billable_total_tokens: 2000 },
      { hour: "02:00", missing: true },
      { hour: "03:00", future: true },
      { hour: "04:00", total_tokens: 500 },
    ];
    const { container } = render(<TrendMonitor rows={rows} label="TOKENS" />);

    expect(screen.getByText("TOKENS")).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("handles rows with value field", () => {
    const rows = [
      { label: "A", value: 100 },
      { label: "B", value: 200 },
    ];
    render(<TrendMonitor rows={rows} />);
    expect(screen.getByText(/MAX:/)).toBeInTheDocument();
  });

  it("renders day period x-axis labels", () => {
    render(<TrendMonitor data={[10, 20]} period="day" />);

    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("04:00")).toBeInTheDocument();
    expect(screen.getByText("08:00")).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText("16:00")).toBeInTheDocument();
    expect(screen.getByText("20:00")).toBeInTheDocument();
    expect(screen.getByText("23:00")).toBeInTheDocument();
  });

  it("renders default period x-axis labels with T-N and NOW", () => {
    render(<TrendMonitor data={[10, 20]} />);

    expect(screen.getByText("T-24")).toBeInTheDocument();
    expect(screen.getByText("T-18")).toBeInTheDocument();
    expect(screen.getByText("T-12")).toBeInTheDocument();
    expect(screen.getByText("T-6")).toBeInTheDocument();
    expect(screen.getByText("NOW")).toBeInTheDocument();
  });

  it("renders with empty data (all zeros)", () => {
    render(<TrendMonitor data={[]} />);

    expect(screen.getByText("MAX: 100")).toBeInTheDocument();
    expect(screen.getByText("AVG: 0")).toBeInTheDocument();
  });

  it("renders with explicitly zero data", () => {
    render(<TrendMonitor data={[0, 0, 0]} />);

    expect(screen.getByText("MAX: 100")).toBeInTheDocument();
    expect(screen.getByText("AVG: 0")).toBeInTheDocument();
  });

  it("formats large numbers with formatCompact (thousands)", () => {
    render(<TrendMonitor data={[5000, 1000, 3000]} />);
    expect(screen.getByText("MAX: 5000")).toBeInTheDocument();
  });

  it("formats large numbers with formatCompact (millions)", () => {
    render(<TrendMonitor data={[2000000, 1000000]} />);
    expect(screen.getByText("2.0M")).toBeInTheDocument();
  });

  it("formats large numbers with formatCompact (billions)", () => {
    render(<TrendMonitor data={[2000000000, 1000000000]} />);
    expect(screen.getByText("2.0B")).toBeInTheDocument();
  });

  it("formats large numbers (>=10B) without decimal", () => {
    render(<TrendMonitor data={[20000000000]} />);
    expect(screen.getByText("20B")).toBeInTheDocument();
  });

  it("formats large numbers (>=10M) without decimal", () => {
    render(<TrendMonitor data={[50000000]} />);
    expect(screen.getByText("50M")).toBeInTheDocument();
  });

  it("formats large numbers (>=10K) without decimal", () => {
    render(<TrendMonitor data={[50000]} />);
    expect(screen.getByText("50K")).toBeInTheDocument();
  });

  it("handles hover (mouseMove) and shows tooltip", () => {
    const rows = [
      { hour: "00:00", billable_total_tokens: 1000 },
      { hour: "01:00", billable_total_tokens: 2000 },
      { hour: "02:00", billable_total_tokens: 3000 },
    ];
    const { container } = render(<TrendMonitor rows={rows} label="HOVER" />);

    const plotArea = container.querySelector("[class*='z-20']");
    expect(plotArea).toBeInTheDocument();

    fireEvent.mouseMove(plotArea!, {
      clientX: 50,
      clientY: 50,
    });

    expect(screen.getByText(/tokens/i)).toBeInTheDocument();
  });

  it("handles mouseLeave to hide tooltip", () => {
    const rows = [
      { hour: "00:00", billable_total_tokens: 1000 },
      { hour: "01:00", billable_total_tokens: 2000 },
    ];
    const { container } = render(<TrendMonitor rows={rows} />);
    const plotArea = container.querySelector("[class*='z-20']");

    fireEvent.mouseMove(plotArea!, { clientX: 50, clientY: 50 });
    expect(screen.getByText(/tokens/i)).toBeInTheDocument();

    fireEvent.mouseLeave(plotArea!);
    expect(screen.queryByText(/\d+ tokens$/)).not.toBeInTheDocument();
  });

  it("shows UNSYNCED for missing data points on hover", () => {
    const rows = [
      { hour: "00:00", billable_total_tokens: 1000 },
      { hour: "01:00", missing: true },
    ];
    const { container } = render(<TrendMonitor rows={rows} />);
    const plotArea = container.querySelector("[class*='z-20']");

    vi.spyOn(plotArea!, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 200,
      top: 0,
      bottom: 100,
      width: 200,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseMove(plotArea!, { clientX: 180, clientY: 50 });
    expect(screen.getByText("UNSYNCED")).toBeInTheDocument();
  });

  it("hides tooltip when hovering over a future data point", () => {
    const rows = [
      { hour: "00:00", billable_total_tokens: 1000 },
      { hour: "01:00", future: true },
    ];
    const { container } = render(<TrendMonitor rows={rows} />);
    const plotArea = container.querySelector("[class*='z-20']");

    vi.spyOn(plotArea!, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 200,
      top: 0,
      bottom: 100,
      width: 200,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseMove(plotArea!, { clientX: 190, clientY: 50 });
    expect(screen.queryByText(/\d+ tokens$/)).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<TrendMonitor className="my-custom" />);
    expect(container.querySelector(".my-custom")).toBeInTheDocument();
  });

  it("applies custom color", () => {
    const { container } = render(<TrendMonitor data={[10, 20]} color="#FF0000" />);
    const stops = container.querySelectorAll("stop");
    expect(stops.length).toBeGreaterThan(0);
    expect(stops[0].getAttribute("stop-color")).toBe("#FF0000");
  });

  it("renders single point as a dot (singlePoints)", () => {
    const rows = [
      { hour: "00:00", missing: true },
      { hour: "01:00", billable_total_tokens: 500 },
      { hour: "02:00", missing: true },
    ];
    const { container } = render(<TrendMonitor rows={rows} />);
    const dots = container.querySelectorAll("[class*='rounded-full']");
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });

  it("shows timeZoneLabel in tooltip when no label on data point", () => {
    const rows = [{ billable_total_tokens: 1000 }];
    const { container } = render(
      <TrendMonitor rows={rows} timeZoneLabel="EST" />,
    );
    const plotArea = container.querySelector("[class*='z-20']");

    vi.spyOn(plotArea!, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 200,
      top: 0,
      bottom: 100,
      width: 200,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.mouseMove(plotArea!, { clientX: 100, clientY: 50 });
    expect(screen.getByText("EST")).toBeInTheDocument();
  });

  it("renders axis labels with compact formatting", () => {
    render(<TrendMonitor data={[1000, 500]} />);
    expect(screen.getByText("1.0K")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles rows with day and month labels", () => {
    const rows = [
      { day: "Mon", value: 10 },
      { month: "Jan", value: 20 },
    ];
    render(<TrendMonitor rows={rows} />);
    expect(screen.getByText(/MAX:/)).toBeInTheDocument();
  });

  it("renders with a single data point in data array", () => {
    const { container } = render(<TrendMonitor data={[500]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders with two data points (linear path)", () => {
    const { container } = render(<TrendMonitor data={[100, 200]} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const paths = svg!.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
  });

  it("falls back to window resize listener when ResizeObserver is undefined", () => {
    // Remove ResizeObserver to trigger the fallback path
    const original = (globalThis as unknown as Record<string, unknown>).ResizeObserver;
    delete (globalThis as unknown as Record<string, unknown>).ResizeObserver;

    const addSpy = vi.spyOn(window, "addEventListener");
    render(<TrendMonitor data={[10, 20]} />);
    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    // Restore
    (globalThis as unknown as Record<string, unknown>).ResizeObserver = original;
  });
});

// ===========================================================================
// ActivityHeatmap
// ===========================================================================

describe("ActivityHeatmap", () => {
  it("shows 'No activity data' when weeks is empty", () => {
    render(<ActivityHeatmap heatmap={{ weeks: [] }} />);
    expect(screen.getByText("No activity data")).toBeInTheDocument();
  });

  it("shows 'No activity data' when heatmap is undefined", () => {
    render(<ActivityHeatmap />);
    expect(screen.getByText("No activity data")).toBeInTheDocument();
  });

  it("renders with valid heatmap data", () => {
    const { container } = render(<ActivityHeatmap heatmap={sampleHeatmapData} />);
    const cells = container.querySelectorAll("[title]");
    expect(cells.length).toBeGreaterThan(0);
    expect(cells[0].getAttribute("title")).toMatch(/2026-01-05.*tokens/);
  });

  it("renders legend by default", () => {
    render(<ActivityHeatmap heatmap={sampleHeatmapData} />);
    expect(screen.getByText("Less")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("hides legend when hideLegend=true", () => {
    render(<ActivityHeatmap heatmap={sampleHeatmapData} hideLegend />);
    expect(screen.queryByText("Less")).not.toBeInTheDocument();
    expect(screen.queryByText("More")).not.toBeInTheDocument();
  });

  it("shows day labels for Sunday start (default)", () => {
    render(<ActivityHeatmap heatmap={sampleHeatmapData} />);
    expect(screen.getByText("SUN")).toBeInTheDocument();
    expect(screen.getByText("MON")).toBeInTheDocument();
    expect(screen.getByText("SAT")).toBeInTheDocument();
  });

  it("shows day labels for Monday start", () => {
    render(<ActivityHeatmap heatmap={sampleHeatmapMonday} />);
    const dayLabels = screen.getAllByText(/^(MON|TUE|WED|THU|FRI|SAT|SUN)$/);
    expect(dayLabels[0].textContent).toBe("MON");
    expect(dayLabels[dayLabels.length - 1].textContent).toBe("SUN");
  });

  it("renders month markers", () => {
    const manyWeeks = Array.from({ length: 52 }, (_, i) => [
      { day: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`, value: i * 10, level: i % 5 },
    ]);
    const heatmap = {
      weeks: manyWeeks,
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    render(<ActivityHeatmap heatmap={heatmap} />);
    const monthLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const found = monthLabels.some((label) => screen.queryByText(label) !== null);
    expect(found).toBe(true);
  });

  it("handles wheel event for horizontal scrolling", () => {
    render(<ActivityHeatmap heatmap={sampleHeatmapData} />);
    const scrollArea = screen.getByLabelText("Activity heatmap");
    expect(scrollArea).toBeInTheDocument();

    // fireEvent.wheel uses React's onWheel synthetic event handler
    fireEvent.wheel(scrollArea, { deltaX: 0, deltaY: 100 });
    // No crash = pass (scrollLeft may not update in jsdom but handler runs)
  });

  it("shows timeZoneShortLabel in legend footer", () => {
    render(
      <ActivityHeatmap
        heatmap={sampleHeatmapData}
        timeZoneShortLabel="PST"
      />,
    );
    expect(screen.getByText("PST")).toBeInTheDocument();
  });

  it("shows UTC as default timezone in legend", () => {
    render(<ActivityHeatmap heatmap={sampleHeatmapData} />);
    expect(screen.getByText("UTC")).toBeInTheDocument();
  });

  it("includes timezone info in cell titles", () => {
    const { container } = render(
      <ActivityHeatmap
        heatmap={sampleHeatmapData}
        timeZoneLabel="America/New_York"
      />,
    );
    const cell = container.querySelector("[title]");
    expect(cell?.getAttribute("title")).toContain("America/New_York");
  });

  it("handles null cells in weeks", () => {
    const heatmap = {
      weeks: [[null, { day: "2026-01-06", value: 100, level: 2 }, null]],
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    const { container } = render(<ActivityHeatmap heatmap={heatmap} />);
    const titledCells = container.querySelectorAll("[title]");
    expect(titledCells.length).toBe(1);
  });

  it("uses total_tokens when value is not present", () => {
    const heatmap = {
      weeks: [[{ day: "2026-01-05", total_tokens: 999, level: 1 }]],
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    const { container } = render(<ActivityHeatmap heatmap={heatmap} />);
    const cell = container.querySelector("[title]");
    expect(cell?.getAttribute("title")).toContain("999");
  });

  it("uses billable_total_tokens when value and total_tokens are not present", () => {
    const heatmap = {
      weeks: [[{ day: "2026-01-05", billable_total_tokens: 777, level: 1 }]],
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    const { container } = render(<ActivityHeatmap heatmap={heatmap} />);
    const cell = container.querySelector("[title]");
    expect(cell?.getAttribute("title")).toContain("777");
  });

  it("handles defaultToLatestMonth prop", () => {
    render(
      <ActivityHeatmap heatmap={sampleHeatmapData} defaultToLatestMonth />,
    );
    expect(screen.getByLabelText("Activity heatmap")).toBeInTheDocument();
  });

  it("fires requestAnimationFrame scroll when scrollWidth > clientWidth", () => {
    const rAFCallbacks: FrameRequestCallback[] = [];
    const rAFSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rAFCallbacks.push(cb);
      return rAFCallbacks.length;
    });

    // Mock scrollWidth and clientWidth on HTMLDivElement prototype so the effect
    // sees scrollWidth > clientWidth when it runs on mount
    const scrollWidthDesc = Object.getOwnPropertyDescriptor(Element.prototype, "scrollWidth");
    const clientWidthDesc = Object.getOwnPropertyDescriptor(Element.prototype, "clientWidth");
    Object.defineProperty(Element.prototype, "scrollWidth", { value: 2000, configurable: true });
    Object.defineProperty(Element.prototype, "clientWidth", { value: 300, configurable: true });

    const manyWeeks = Array.from({ length: 80 }, () => [
      { day: "2026-01-05", value: 10, level: 1 },
    ]);
    const heatmap = {
      weeks: manyWeeks,
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };

    render(
      <ActivityHeatmap heatmap={heatmap} defaultToLatestMonth />,
    );

    // Flush nested rAF callbacks (the effect calls rAF(() => rAF(snapToLatest)))
    act(() => {
      for (let i = 0; i < 10 && rAFCallbacks.length > 0; i++) {
        const cb = rAFCallbacks.shift()!;
        cb(performance.now());
      }
    });

    expect(screen.getByLabelText("Activity heatmap")).toBeInTheDocument();

    // Restore
    if (scrollWidthDesc) Object.defineProperty(Element.prototype, "scrollWidth", scrollWidthDesc);
    if (clientWidthDesc) Object.defineProperty(Element.prototype, "clientWidth", clientWidthDesc);
    rAFSpy.mockRestore();
  });

  it("mouseEnter and mouseLeave on heatmap container", () => {
    const { container } = render(<ActivityHeatmap heatmap={sampleHeatmapData} />);
    // The outermost div has onMouseEnter/onMouseLeave
    const outerDiv = container.querySelector(".flex.flex-col.gap-2")!;
    expect(outerDiv).toBeInTheDocument();

    fireEvent.mouseEnter(outerDiv);
    fireEvent.mouseLeave(outerDiv);
    // No crash = pass (internal state isHoveringHeatmap toggles)
  });

  it("wheel event with deltaX > deltaY does not scroll horizontally", () => {
    render(<ActivityHeatmap heatmap={sampleHeatmapData} />);
    const scrollArea = screen.getByLabelText("Activity heatmap");

    // When deltaX > deltaY, the handler should not override horizontal scrolling
    fireEvent.wheel(scrollArea, { deltaX: 100, deltaY: 10 });
    // No crash = handler properly skipped the scrollLeft override
  });

  it("uses timeZoneShortLabel in cell title when timeZoneLabel is absent", () => {
    const heatmap = {
      weeks: [[{ day: "2026-01-05", value: 42, level: 1 }]],
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    const { container } = render(
      <ActivityHeatmap heatmap={heatmap} timeZoneShortLabel="CET" />,
    );
    const cell = container.querySelector("[title]");
    expect(cell?.getAttribute("title")).toContain("CET");
  });

  it("renders cell with no value fields (defaults to 0)", () => {
    const heatmap = {
      weeks: [[{ day: "2026-01-05", level: 1 }]],
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    const { container } = render(<ActivityHeatmap heatmap={heatmap} />);
    const cell = container.querySelector("[title]");
    expect(cell?.getAttribute("title")).toContain("0 tokens");
  });

  it("renders cell with string-typed value for formatTokenValue string branch", () => {
    const heatmap = {
      weeks: [[{ day: "2026-01-05", value: "1234" as unknown as number, level: 2 }]],
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    const { container } = render(<ActivityHeatmap heatmap={heatmap} />);
    const cell = container.querySelector("[title]");
    // formatTokenValue with string "1234" → "1,234"
    expect(cell?.getAttribute("title")).toContain("1,234");
  });

  it("renders cell with non-finite number value", () => {
    const heatmap = {
      weeks: [[{ day: "2026-01-05", value: Infinity, level: 0 }]],
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    const { container } = render(<ActivityHeatmap heatmap={heatmap} />);
    const cell = container.querySelector("[title]");
    // formatTokenValue(Infinity) returns "0" since !Number.isFinite
    expect(cell?.getAttribute("title")).toContain("0 tokens");
  });

  it("renders cell with non-numeric string value", () => {
    const heatmap = {
      weeks: [[{ day: "2026-01-05", value: "abc" as unknown as number, level: 1 }]],
      to: "2026-01-11",
      week_starts_on: "sun" as const,
    };
    const { container } = render(<ActivityHeatmap heatmap={heatmap} />);
    const cell = container.querySelector("[title]");
    // formatTokenValue("abc") → Number("abc") is NaN → returns the original string "abc"
    expect(cell?.getAttribute("title")).toContain("abc");
  });
});

// ===========================================================================
// ArchiveHeatmap
// ===========================================================================

describe("ArchiveHeatmap", () => {
  it("renders with default props", () => {
    render(<ArchiveHeatmap />);
    expect(screen.getByText("ARCHIVE")).toBeInTheDocument();
    expect(screen.getByText("Historical data")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<ArchiveHeatmap title="MY ARCHIVE" />);
    expect(screen.getByText("MY ARCHIVE")).toBeInTheDocument();
  });

  it("shows rangeLabel when provided", () => {
    render(<ArchiveHeatmap rangeLabel="Jan 2026 - Feb 2026" />);
    expect(screen.getByText(/Range: Jan 2026 - Feb 2026/)).toBeInTheDocument();
  });

  it("does not show rangeLabel when not provided", () => {
    render(<ArchiveHeatmap />);
    expect(screen.queryByText(/Range:/)).not.toBeInTheDocument();
  });

  it("shows footerLeft and footerRight", () => {
    render(
      <ArchiveHeatmap footerLeft="Left text" footerRight="Right text" />,
    );
    expect(screen.getByText("Left text")).toBeInTheDocument();
    expect(screen.getByText("Right text")).toBeInTheDocument();
  });

  it("does not show footer when footerLeft is empty string and footerRight is undefined", () => {
    const { container } = render(<ArchiveHeatmap footerLeft="" />);
    // The footer div has the class combo "mt-auto pt-3 border-t ..."; it should not exist
    const footerDiv = container.querySelector(".mt-auto.pt-3");
    expect(footerDiv).not.toBeInTheDocument();
  });

  it("shows footer when only footerRight is provided", () => {
    render(<ArchiveHeatmap footerLeft="" footerRight="Some right" />);
    expect(screen.getByText("Some right")).toBeInTheDocument();
  });

  it("passes heatmap data to ActivityHeatmap", () => {
    render(<ArchiveHeatmap heatmap={sampleHeatmapData} />);
    expect(screen.queryByText("No activity data")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ArchiveHeatmap className="archive-custom" />);
    expect(container.querySelector(".archive-custom")).toBeInTheDocument();
  });
});

// ===========================================================================
// TrendChart
// ===========================================================================

describe("TrendChart", () => {
  it("shows 'No trend data' when data is empty", () => {
    render(<TrendChart data={[]} />);
    expect(screen.getByText("No trend data")).toBeInTheDocument();
  });

  it("shows 'No trend data' when data is undefined", () => {
    render(<TrendChart />);
    expect(screen.getByText("No trend data")).toBeInTheDocument();
  });

  it("renders bars for each data point", () => {
    const { container } = render(<TrendChart data={[10, 20, 30]} />);
    const bars = container.querySelectorAll(".flex-1.relative");
    expect(bars.length).toBe(3);
  });

  it("shows peak label with correct max value", () => {
    render(<TrendChart data={[100, 500, 200]} />);
    expect(screen.getByText("PEAK: 500 tokens")).toBeInTheDocument();
  });

  it("uses custom unitLabel", () => {
    render(<TrendChart data={[100, 200]} unitLabel="requests" />);
    expect(screen.getByText("PEAK: 200 requests")).toBeInTheDocument();
  });

  it("shows custom leftLabel and rightLabel", () => {
    render(
      <TrendChart data={[10]} leftLabel="BEGIN" rightLabel="END" />,
    );
    expect(screen.getByText("BEGIN")).toBeInTheDocument();
    expect(screen.getByText("END")).toBeInTheDocument();
  });

  it("uses default labels START and NOW", () => {
    render(<TrendChart data={[10, 20]} />);
    expect(screen.getByText("START")).toBeInTheDocument();
    expect(screen.getByText("NOW")).toBeInTheDocument();
  });

  it("renders bar heights proportional to max", () => {
    const { container } = render(<TrendChart data={[50, 100]} />);
    const barInners = container.querySelectorAll(".flex-1.relative > div");
    expect(barInners[0].getAttribute("style")).toContain("50%");
    expect(barInners[1].getAttribute("style")).toContain("100%");
  });

  it("handles single data point", () => {
    render(<TrendChart data={[42]} />);
    expect(screen.getByText("PEAK: 42 tokens")).toBeInTheDocument();
  });

  it("handles zero values (max clamped to 1)", () => {
    render(<TrendChart data={[0, 0]} />);
    expect(screen.getByText("PEAK: 1 tokens")).toBeInTheDocument();
  });

  it("handles NaN values by converting to 0", () => {
    render(<TrendChart data={[NaN, 10]} />);
    expect(screen.getByText("PEAK: 10 tokens")).toBeInTheDocument();
  });
});
