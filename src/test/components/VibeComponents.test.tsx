import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  BackendStatus,
  SystemHeader,
  IdentityPanel,
  IdentityCard,
  TopModelsPanel,
  LeaderboardPanel,
  UsagePanel,
  NeuralAdaptiveFleet,
  NeuralDivergenceMap,
  LandingExtras,
  GithubStar,
  UpgradeAlertModal,
  CostAnalysisModal,
} from "@/components/ui/VibeComponents";

// ---------------------------------------------------------------------------
// Global mocks for requestAnimationFrame (used by ScrambleText dependency)
// ---------------------------------------------------------------------------

let rafCallbacks: Array<(time: number) => void> = [];
let rafIdCounter = 1;

beforeEach(() => {
  rafCallbacks = [];
  rafIdCounter = 1;

  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    const id = rafIdCounter++;
    rafCallbacks.push(cb);
    return id;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** Flush pending rAF callbacks */
function _flushRAF(time = 16000) {
  const toRun = [...rafCallbacks];
  rafCallbacks = [];
  toRun.forEach((cb) => cb(time));
}

// ============================================
// BackendStatus
// ============================================

describe("BackendStatus", () => {
  it("renders with default active status", () => {
    const { container } = render(<BackendStatus />);
    expect(container.querySelector("[title]")).toHaveAttribute("title", "status=active");
  });

  it("renders with status=active and maps to STABLE", () => {
    const { container } = render(<BackendStatus status="active" />);
    expect(container.querySelector("[title]")).toHaveAttribute("title", "status=active");
  });

  it("renders with status=down and maps to LOST", () => {
    const { container } = render(<BackendStatus status="down" />);
    const el = container.querySelector("[title]");
    expect(el).toHaveAttribute("title", "status=down");
    // LOST indicator is "×"
    expect(el?.textContent).toContain("×");
  });

  it("renders with status=checking and maps to UNSTABLE", () => {
    const { container } = render(<BackendStatus status="checking" />);
    const el = container.querySelector("[title]");
    expect(el).toHaveAttribute("title", "status=checking");
    // UNSTABLE indicator is "!"
    expect(el?.textContent).toContain("!");
  });

  it("includes host in title when provided", () => {
    const { container } = render(<BackendStatus status="active" host="localhost" />);
    const el = container.querySelector("[title]");
    expect(el).toHaveAttribute("title", "status=active • host=localhost");
  });

  it("applies className", () => {
    const { container } = render(<BackendStatus className="extra-class" />);
    const el = container.querySelector("[title]");
    expect(el?.className).toContain("extra-class");
  });
});

// ============================================
// SystemHeader
// ============================================

describe("SystemHeader", () => {
  it("renders default title 'SYSTEM'", () => {
    render(<SystemHeader />);
    expect(screen.getByText("SYSTEM")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<SystemHeader title="DASHBOARD" />);
    expect(screen.getByText("DASHBOARD")).toBeInTheDocument();
  });

  it("shows signalLabel when provided", () => {
    render(<SystemHeader signalLabel="SYNCED" />);
    expect(screen.getByText("SYNCED")).toBeInTheDocument();
  });

  it("does not show signalLabel when not provided", () => {
    const { container } = render(<SystemHeader />);
    const animatedSpans = container.querySelectorAll("span.animate-pulse");
    expect(animatedSpans.length).toBe(0);
  });

  it("shows time when provided", () => {
    render(<SystemHeader time="12:34:56" />);
    expect(screen.getByText("12:34:56")).toBeInTheDocument();
  });

  it("does not show time when not provided", () => {
    const { container } = render(<SystemHeader />);
    // No time div should be rendered
    const timeDivs = container.querySelectorAll(".tracking-widest");
    expect(timeDivs.length).toBe(0);
  });

  it("applies className", () => {
    const { container } = render(<SystemHeader className="test-class" />);
    expect(container.querySelector("header")?.className).toContain("test-class");
  });
});

// ============================================
// IdentityPanel
// ============================================

describe("IdentityPanel", () => {
  it("renders with default values", () => {
    render(<IdentityPanel />);
    // default name "UNKNOWN" doesn't contain "@" so it stays, but special chars replaced
    expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
    expect(screen.getByText("RANK")).toBeInTheDocument();
    expect(screen.getByText("STREAK")).toBeInTheDocument();
    // default rankLabel is "—"
    expect(screen.getByText("\u2014")).toBeInTheDocument();
    // default streak "0d"
    expect(screen.getByText("0d")).toBeInTheDocument();
  });

  it("renders handle from name", () => {
    render(<IdentityPanel name="Neo" />);
    expect(screen.getByText("Neo")).toBeInTheDocument();
  });

  it("replaces special chars in name with underscore", () => {
    render(<IdentityPanel name="h@cker!!" />);
    // name contains "@" so it becomes "USER"
    expect(screen.getByText("USER")).toBeInTheDocument();
  });

  it("replaces non-alphanumeric chars with underscore", () => {
    render(<IdentityPanel name="Hello World" />);
    // space is replaced with underscore
    expect(screen.getByText("Hello_World")).toBeInTheDocument();
  });

  it("renders streak display", () => {
    render(<IdentityPanel streakDays={42} />);
    expect(screen.getByText("42d")).toBeInTheDocument();
  });

  it("renders rank display", () => {
    render(<IdentityPanel rankLabel="GOLD" />);
    expect(screen.getByText("GOLD")).toBeInTheDocument();
  });
});

// ============================================
// IdentityCard
// ============================================

describe("IdentityCard", () => {
  it("renders name when public", () => {
    render(<IdentityCard name="Neo" isPublic animate={false} animateTitle={false} />);
    expect(screen.getByText("Neo")).toBeInTheDocument();
  });

  it('shows "??????" when not public', () => {
    render(<IdentityCard name="Neo" isPublic={false} animate={false} animateTitle={false} />);
    expect(screen.getByText("??????")).toBeInTheDocument();
  });

  it("shows decrypt button when not public and onDecrypt provided", () => {
    const onDecrypt = vi.fn();
    render(
      <IdentityCard
        name="Neo"
        isPublic={false}
        onDecrypt={onDecrypt}
        animate={false}
        animateTitle={false}
      />,
    );
    const btn = screen.getByText("DECRYPT");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onDecrypt).toHaveBeenCalledTimes(1);
  });

  it("does not show decrypt button when public", () => {
    render(
      <IdentityCard name="Neo" isPublic onDecrypt={() => {}} animate={false} animateTitle={false} />,
    );
    expect(screen.queryByText("DECRYPT")).not.toBeInTheDocument();
  });

  it("renders img avatar when public + avatarUrl", () => {
    render(
      <IdentityCard
        name="Neo"
        isPublic
        avatarUrl="https://example.com/avatar.png"
        animate={false}
        animateTitle={false}
      />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
    expect(img).toHaveAttribute("alt", "Neo");
  });

  it("renders MatrixAvatar when no avatarUrl", () => {
    const { container } = render(
      <IdentityCard name="Neo" isPublic animate={false} animateTitle={false} />,
    );
    // MatrixAvatar renders an SVG inside a div
    expect(container.querySelector("svg")).toBeInTheDocument();
    // No img tag
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("falls back to MatrixAvatar on img error", () => {
    const { container } = render(
      <IdentityCard
        name="Neo"
        isPublic
        avatarUrl="https://example.com/bad.png"
        animate={false}
        animateTitle={false}
      />,
    );
    const img = screen.getByRole("img");
    fireEvent.error(img);
    // After error, img should be gone and MatrixAvatar rendered
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("shows stats when showStats=true with rank and streak", () => {
    render(
      <IdentityCard
        name="Neo"
        isPublic
        showStats
        rankLabel="GOLD"
        streakDays={5}
        animate={false}
        animateTitle={false}
      />,
    );
    expect(screen.getByText("RANK")).toBeInTheDocument();
    expect(screen.getByText("GOLD")).toBeInTheDocument();
    expect(screen.getByText("STREAK")).toBeInTheDocument();
    expect(screen.getByText("5d")).toBeInTheDocument();
  });

  it("does not show stats when showStats=false", () => {
    render(
      <IdentityCard
        name="Neo"
        isPublic
        showStats={false}
        rankLabel="GOLD"
        streakDays={5}
        animate={false}
        animateTitle={false}
      />,
    );
    expect(screen.queryByText("RANK")).not.toBeInTheDocument();
    expect(screen.queryByText("STREAK")).not.toBeInTheDocument();
  });

  it("does not show stats when no rankLabel and no streakDays", () => {
    render(
      <IdentityCard name="Neo" isPublic showStats animate={false} animateTitle={false} />,
    );
    // shouldShowStats = showStats && (rankLabel !== undefined || streakDays !== undefined)
    // both undefined -> no stats
    expect(screen.queryByText("RANK")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <IdentityCard className="custom-card" animate={false} animateTitle={false} />,
    );
    expect(container.innerHTML).toContain("custom-card");
  });
});

// ============================================
// TopModelsPanel
// ============================================

describe("TopModelsPanel", () => {
  it("renders 3 rows and fills empty slots", () => {
    render(<TopModelsPanel />);
    // Should have rank labels 01, 02, 03
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("shows model names and percentages", () => {
    render(
      <TopModelsPanel
        rows={[
          { name: "GPT-4", percent: "45" },
          { name: "Claude", percent: "35" },
          { name: "Gemini", percent: "20" },
        ]}
      />,
    );
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Claude")).toBeInTheDocument();
    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.getByText("Gemini")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    // percent symbols for non-empty rows
    expect(screen.getAllByText("%").length).toBe(3);
  });

  it("shows empty rows when no data", () => {
    render(<TopModelsPanel rows={[]} />);
    // All 3 rows should be empty - no model names, no % symbols
    expect(screen.queryAllByText("%").length).toBe(0);
    // Still has rank labels
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("fills remaining slots when fewer than 3 rows provided", () => {
    render(
      <TopModelsPanel
        rows={[{ name: "GPT-4", percent: "100" }]}
      />,
    );
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    // Only 1 % symbol for the non-empty row
    expect(screen.getAllByText("%").length).toBe(1);
  });
});

// ============================================
// LeaderboardPanel
// ============================================

describe("LeaderboardPanel", () => {
  const sampleRows = [
    { rank: 1, name: "Alice", value: 1000 },
    { rank: 2, name: "Bob", value: 800 },
    { rank: 3, name: "Charlie", value: 600 },
  ];

  it("renders rows with rank, name, and value", () => {
    render(<LeaderboardPanel rows={sampleRows} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("800")).toBeInTheDocument();
  });

  it("renders period tabs and clicking changes period", () => {
    const onPeriodChange = vi.fn();
    render(
      <LeaderboardPanel
        rows={sampleRows}
        period="ALL"
        periods={[
          { key: "24H", label: "24H" },
          { key: "ALL", label: "ALL TIME" },
        ]}
        onPeriodChange={onPeriodChange}
      />,
    );
    const btn24h = screen.getByText("24H");
    expect(btn24h).toBeInTheDocument();
    expect(screen.getByText("ALL TIME")).toBeInTheDocument();

    fireEvent.click(btn24h);
    expect(onPeriodChange).toHaveBeenCalledWith("24H");
  });

  it("shows summary view when period matches summaryPeriod", () => {
    const summary = {
      totalLabel: "TOTAL TOKENS",
      totalValue: "100,000",
      sinceLabel: "Since Jan 2026",
      stats: [
        { label: "Requests", value: "500" },
        { label: "Models", value: "3" },
      ],
    };
    render(
      <LeaderboardPanel
        rows={sampleRows}
        period="ALL"
        summaryPeriod="ALL"
        summary={summary}
      />,
    );
    expect(screen.getByText("TOTAL TOKENS")).toBeInTheDocument();
    expect(screen.getByText("100,000")).toBeInTheDocument();
    expect(screen.getByText("Since Jan 2026")).toBeInTheDocument();
    expect(screen.getByText("Requests")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("shows load more button", () => {
    const onLoadMore = vi.fn();
    render(
      <LeaderboardPanel
        rows={sampleRows}
        period="24H"
        summaryPeriod="ALL"
        loadMoreLabel="Show more"
        onLoadMore={onLoadMore}
      />,
    );
    const btn = screen.getByText("Show more");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('shows "No data" when rows are empty', () => {
    render(<LeaderboardPanel rows={[]} period="24H" summaryPeriod="ALL" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("does not show load more when rows are empty", () => {
    render(
      <LeaderboardPanel
        rows={[]}
        period="24H"
        summaryPeriod="ALL"
        loadMoreLabel="Show more"
        onLoadMore={() => {}}
      />,
    );
    expect(screen.queryByText("Show more")).not.toBeInTheDocument();
  });

  it("renders default title LEADERBOARD", () => {
    render(<LeaderboardPanel />);
    expect(screen.getByText("LEADERBOARD")).toBeInTheDocument();
  });

  it("renders string value as-is", () => {
    render(
      <LeaderboardPanel
        rows={[{ rank: 1, name: "X", value: "$500" }]}
        period="24H"
        summaryPeriod="ALL"
      />,
    );
    expect(screen.getByText("$500")).toBeInTheDocument();
  });
});

// ============================================
// UsagePanel
// ============================================

describe("UsagePanel", () => {
  it("renders metrics array", () => {
    render(
      <UsagePanel
        metrics={[
          { label: "Tokens", value: "12,345" },
          { label: "Requests", value: "42", subValue: "avg 293/day" },
        ]}
      />,
    );
    expect(screen.getByText("Tokens")).toBeInTheDocument();
    expect(screen.getByText("12,345")).toBeInTheDocument();
    expect(screen.getByText("Requests")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("avg 293/day")).toBeInTheDocument();
  });

  it("renders summary view when showSummary=true", () => {
    render(
      <UsagePanel
        showSummary
        summaryLabel="TOTAL OUTPUT"
        summaryValue="1,234,567"
        summaryAnimate={false}
      />,
    );
    expect(screen.getByText("TOTAL OUTPUT")).toBeInTheDocument();
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("renders cost value and cost info button", () => {
    const onCostInfo = vi.fn();
    render(
      <UsagePanel
        showSummary
        summaryCostValue="$12.50"
        onCostInfo={onCostInfo}
        summaryAnimate={false}
      />,
    );
    expect(screen.getByText("$12.50")).toBeInTheDocument();
    const btn = screen.getByTitle("Cost details");
    fireEvent.click(btn);
    expect(onCostInfo).toHaveBeenCalledTimes(1);
  });

  it("renders breakdown rows when not collapsed", () => {
    render(
      <UsagePanel
        showSummary
        summaryAnimate={false}
        breakdown={[
          { label: "Input", value: "500K" },
          { label: "Output", value: "800K" },
        ]}
        breakdownCollapsed={false}
      />,
    );
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("500K")).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();
    expect(screen.getByText("800K")).toBeInTheDocument();
  });

  it("hides breakdown rows when collapsed", () => {
    render(
      <UsagePanel
        showSummary
        summaryAnimate={false}
        breakdown={[
          { label: "Input", value: "500K" },
          { label: "Output", value: "800K" },
        ]}
        breakdownCollapsed
      />,
    );
    expect(screen.queryByText("Input")).not.toBeInTheDocument();
    expect(screen.queryByText("Output")).not.toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<UsagePanel error="Something went wrong" />);
    expect(screen.getByText("Error: Something went wrong")).toBeInTheDocument();
  });

  it("renders refresh button and calls onRefresh", () => {
    const onRefresh = vi.fn();
    render(<UsagePanel onRefresh={onRefresh} />);
    const btn = screen.getByText("Refresh");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("shows Loading... when loading", () => {
    render(<UsagePanel onRefresh={() => {}} loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders period tabs and calls onPeriodChange", () => {
    const onPeriodChange = vi.fn();
    render(
      <UsagePanel
        period="7D"
        periods={[
          { key: "24H", label: "24H" },
          { key: "7D", label: "7 DAYS" },
        ]}
        onPeriodChange={onPeriodChange}
        onRefresh={() => {}}
      />,
    );
    const btn = screen.getByText("24H");
    fireEvent.click(btn);
    expect(onPeriodChange).toHaveBeenCalledWith("24H");
  });

  it("hides header when hideHeader is true", () => {
    render(
      <UsagePanel
        hideHeader
        periods={[{ key: "24H", label: "24H" }]}
        onRefresh={() => {}}
      />,
    );
    expect(screen.queryByText("24H")).not.toBeInTheDocument();
    expect(screen.queryByText("Refresh")).not.toBeInTheDocument();
  });

  it("renders rangeLabel", () => {
    render(<UsagePanel rangeLabel="Jan 1 - Jan 31" rangeTimeZoneLabel="(UTC)" />);
    expect(screen.getByText("Jan 1 - Jan 31 (UTC)")).toBeInTheDocument();
  });

  it("renders statusLabel", () => {
    render(<UsagePanel statusLabel="LIVE" onRefresh={() => {}} />);
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("renders breakdown toggle button", () => {
    const onToggleBreakdown = vi.fn();
    render(
      <UsagePanel
        onRefresh={() => {}}
        onToggleBreakdown={onToggleBreakdown}
        breakdownCollapsed
        expandLabel="Show details"
        collapseLabel="Hide details"
      />,
    );
    const btn = screen.getByText("Show details");
    fireEvent.click(btn);
    expect(onToggleBreakdown).toHaveBeenCalledTimes(1);
  });

  it("renders summarySubLabel", () => {
    render(
      <UsagePanel
        showSummary
        summaryAnimate={false}
        summarySubLabel="last 30 days"
      />,
    );
    expect(screen.getByText("last 30 days")).toBeInTheDocument();
  });
});

// ============================================
// NeuralAdaptiveFleet
// ============================================

describe("NeuralAdaptiveFleet", () => {
  const sampleModels = [
    { name: "GPT-4", share: 50 },
    { name: "Claude", share: 30 },
    { name: "Gemini", share: 20 },
  ];

  it("renders label and percent", () => {
    render(<NeuralAdaptiveFleet label="CODING" totalPercent={75} />);
    expect(screen.getByText("CODING")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("renders model bars", () => {
    const { container } = render(
      <NeuralAdaptiveFleet label="CODING" totalPercent={100} models={sampleModels} />,
    );
    // Model bars are rendered in the h-1 container
    const barContainer = container.querySelector(".h-1.w-full");
    expect(barContainer?.children.length).toBe(3);
  });

  it("renders model legend items", () => {
    render(
      <NeuralAdaptiveFleet label="CODING" totalPercent={100} models={sampleModels} />,
    );
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("Claude")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("Gemini")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("formats usage with K suffix", () => {
    render(<NeuralAdaptiveFleet label="TEST" totalPercent={50} usage={1500} />);
    expect(screen.getByText("1.5K tokens")).toBeInTheDocument();
  });

  it("formats usage with M suffix", () => {
    render(<NeuralAdaptiveFleet label="TEST" totalPercent={50} usage={2500000} />);
    expect(screen.getByText("2.5M tokens")).toBeInTheDocument();
  });

  it("formats usage with B suffix", () => {
    render(<NeuralAdaptiveFleet label="TEST" totalPercent={50} usage={3000000000} />);
    expect(screen.getByText("3.0B tokens")).toBeInTheDocument();
  });

  it("formats small usage without suffix", () => {
    render(<NeuralAdaptiveFleet label="TEST" totalPercent={50} usage={42} />);
    expect(screen.getByText("42 tokens")).toBeInTheDocument();
  });

  it("formats zero usage", () => {
    render(<NeuralAdaptiveFleet label="TEST" totalPercent={50} usage={0} />);
    expect(screen.getByText("0 tokens")).toBeInTheDocument();
  });
});

// ============================================
// NeuralDivergenceMap
// ============================================

describe("NeuralDivergenceMap", () => {
  const sampleFleet = [
    {
      label: "CODING",
      totalPercent: 60,
      usage: 5000,
      models: [
        { name: "GPT-4", share: 40 },
        { name: "Claude", share: 60 },
      ],
    },
  ];

  it("renders default title", () => {
    render(<NeuralDivergenceMap />);
    expect(screen.getByText("MODEL BREAKDOWN")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<NeuralDivergenceMap title="FLEET STATUS" />);
    expect(screen.getByText("FLEET STATUS")).toBeInTheDocument();
  });

  it("renders fleets", () => {
    render(<NeuralDivergenceMap fleetData={sampleFleet} />);
    expect(screen.getByText("CODING")).toBeInTheDocument();
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("Claude")).toBeInTheDocument();
  });

  it("renders footer text", () => {
    render(<NeuralDivergenceMap footer="Custom footer text" />);
    expect(screen.getByText("Custom footer text")).toBeInTheDocument();
  });

  it("renders default footer", () => {
    render(<NeuralDivergenceMap />);
    expect(screen.getByText("Neural divergence patterns")).toBeInTheDocument();
  });

  it("renders with empty fleet data", () => {
    const { container } = render(<NeuralDivergenceMap fleetData={[]} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText("Neural divergence patterns")).toBeInTheDocument();
  });

  it("renders multiple fleets", () => {
    render(
      <NeuralDivergenceMap
        fleetData={[
          ...sampleFleet,
          {
            label: "CHAT",
            totalPercent: 40,
            models: [{ name: "Gemini", share: 100 }],
          },
        ]}
      />,
    );
    expect(screen.getByText("CODING")).toBeInTheDocument();
    expect(screen.getByText("CHAT")).toBeInTheDocument();
  });
});

// ============================================
// LandingExtras
// ============================================

describe("LandingExtras", () => {
  it("renders handle input with value", () => {
    render(<LandingExtras handle="Neo" />);
    const input = screen.getByDisplayValue("Neo");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("calls onHandleChange when input changes", () => {
    const onHandleChange = vi.fn();
    render(<LandingExtras handle="Neo" onHandleChange={onHandleChange} />);
    const input = screen.getByDisplayValue("Neo");
    fireEvent.change(input, { target: { value: "Trinity" } });
    expect(onHandleChange).toHaveBeenCalledTimes(1);
  });

  it("renders avatar (MatrixAvatar)", () => {
    const { container } = render(<LandingExtras handle="Neo" />);
    // MatrixAvatar renders an SVG
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders rankLabel", () => {
    render(<LandingExtras handle="Neo" rankLabel="GOLD RANK" />);
    expect(screen.getByText("GOLD RANK")).toBeInTheDocument();
  });

  it("renders LiveSniffer section", () => {
    render(<LandingExtras handle="Neo" />);
    // LiveSniffer starts with initial logs
    expect(screen.getByText("[SYSTEM] Live sniffer initialized")).toBeInTheDocument();
    expect(screen.getByText("[SOCKET] Connection established")).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(<LandingExtras handle="" handlePlaceholder="Enter handle..." />);
    const input = screen.getByPlaceholderText("Enter handle...");
    expect(input).toBeInTheDocument();
  });
});

// ============================================
// GithubStar
// ============================================

describe("GithubStar", () => {
  it("renders link to github", () => {
    render(<GithubStar repo="test/repo" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/test/repo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders STAR text", () => {
    render(<GithubStar />);
    expect(screen.getByText("STAR")).toBeInTheDocument();
  });

  it("shows --- before fetch completes", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ stargazers_count: 42 }), { status: 200 }),
    );
    render(<GithubStar repo="test/repo" />);
    expect(screen.getByText("---")).toBeInTheDocument();
  });

  it("fetches stars count on mount and displays it", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: () => Promise.resolve({ stargazers_count: 1234 }),
    } as Response);

    await act(async () => {
      render(<GithubStar repo="owner/repo" />);
    });

    // Wait for the fetch chain (.then .then) to settle
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(screen.getByText("1234")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith("https://api.github.com/repos/owner/repo");
  });

  it("handles fetch failure gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    render(<GithubStar repo="owner/repo" />);

    await act(async () => {
      // Wait for the rejected promise to be handled
      await new Promise((r) => setTimeout(r, 10));
    });

    // Should still show "---" (no crash)
    expect(screen.getByText("---")).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it("renders with default repo", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );
    render(<GithubStar />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/example/repo");
  });

  it("applies fixed positioning when isFixed=true", () => {
    render(<GithubStar isFixed />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("fixed");
  });

  it("applies relative positioning when isFixed=false", () => {
    render(<GithubStar isFixed={false} />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("relative");
  });
});

// ============================================
// UpgradeAlertModal
// ============================================

describe("UpgradeAlertModal", () => {
  it("renders version info when requiredVersion provided", () => {
    render(<UpgradeAlertModal requiredVersion="2.0.0" />);
    expect(screen.getByText("UPDATE AVAILABLE")).toBeInTheDocument();
    expect(screen.getByText("Version 2.0.0 required")).toBeInTheDocument();
  });

  it("renders generic message when no version", () => {
    render(<UpgradeAlertModal />);
    expect(screen.getByText("A new version is available")).toBeInTheDocument();
  });

  it("renders install command in input", () => {
    render(<UpgradeAlertModal installCommand="npm install -g foo@latest" />);
    expect(screen.getByDisplayValue("npm install -g foo@latest")).toBeInTheDocument();
  });

  it("copy button copies command to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    vi.useFakeTimers();

    render(<UpgradeAlertModal installCommand="npm install -g foo" />);
    const copyBtn = screen.getByText("COPY");

    await act(async () => {
      fireEvent.click(copyBtn);
      // Let the async handler resolve
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledWith("npm install -g foo");
    expect(screen.getByText("COPIED")).toBeInTheDocument();

    // After 2 seconds, it should revert to COPY
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("COPY")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("ignore button dismisses the banner", () => {
    const onClose = vi.fn();
    render(<UpgradeAlertModal onClose={onClose} />);

    const ignoreBtn = screen.getByText("IGNORE");
    fireEvent.click(ignoreBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
    // After dismiss, the banner is not visible
    expect(screen.queryByText("UPDATE AVAILABLE")).not.toBeInTheDocument();
  });

  it("is not visible after dismiss", () => {
    render(<UpgradeAlertModal />);
    fireEvent.click(screen.getByText("IGNORE"));
    expect(screen.queryByText("UPDATE AVAILABLE")).not.toBeInTheDocument();
    expect(screen.queryByText("IGNORE")).not.toBeInTheDocument();
  });
});

// ============================================
// CostAnalysisModal
// ============================================

describe("CostAnalysisModal", () => {
  const sampleFleetData = [
    {
      label: "CODING",
      usd: 5.5,
      models: [
        { name: "GPT-4", share: 60, calc: "usage" },
        { name: "Claude", share: 40, calc: "flat" },
      ],
    },
    {
      label: "CHAT",
      usd: 2.25,
      models: [{ name: "Gemini", share: 100 }],
    },
  ];

  it("is not rendered when isOpen=false", () => {
    render(<CostAnalysisModal isOpen={false} onClose={() => {}} fleetData={sampleFleetData} />);
    expect(screen.queryByText("COST BREAKDOWN")).not.toBeInTheDocument();
    expect(screen.queryByText("TOTAL COST")).not.toBeInTheDocument();
  });

  it("renders total cost", () => {
    render(<CostAnalysisModal isOpen onClose={() => {}} fleetData={sampleFleetData} />);
    expect(screen.getByText("TOTAL COST")).toBeInTheDocument();
    // 5.5 + 2.25 = 7.75
    expect(screen.getByText("$7.75")).toBeInTheDocument();
  });

  it("renders fleet breakdown", () => {
    render(<CostAnalysisModal isOpen onClose={() => {}} fleetData={sampleFleetData} />);
    expect(screen.getByText("CODING")).toBeInTheDocument();
    expect(screen.getByText("$5.50")).toBeInTheDocument();
    expect(screen.getByText("CHAT")).toBeInTheDocument();
    expect(screen.getByText("$2.25")).toBeInTheDocument();
  });

  it("renders model details with share and calc method", () => {
    render(<CostAnalysisModal isOpen onClose={() => {}} fleetData={sampleFleetData} />);
    expect(screen.getByText("GPT-4 (60%)")).toBeInTheDocument();
    expect(screen.getByText("via USAGE")).toBeInTheDocument();
    expect(screen.getByText("Claude (40%)")).toBeInTheDocument();
    expect(screen.getByText("via FLAT")).toBeInTheDocument();
    expect(screen.getByText("Gemini (100%)")).toBeInTheDocument();
    // No calc -> "DYNAMIC"
    expect(screen.getByText("via DYNAMIC")).toBeInTheDocument();
  });

  it("close button calls onClose", () => {
    const onClose = vi.fn();
    render(<CostAnalysisModal isOpen onClose={onClose} fleetData={sampleFleetData} />);
    const closeBtn = screen.getByText("CLOSE");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Escape key calls onClose", () => {
    const onClose = vi.fn();
    render(<CostAnalysisModal isOpen onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders with empty fleet data", () => {
    render(<CostAnalysisModal isOpen onClose={() => {}} fleetData={[]} />);
    expect(screen.getByText("TOTAL COST")).toBeInTheDocument();
    // Total of 0 -> $0.00
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("renders estimates footer text", () => {
    render(<CostAnalysisModal isOpen onClose={() => {}} />);
    expect(screen.getByText("Estimates based on API pricing")).toBeInTheDocument();
  });

  it("handles fleet with undefined usd (shows $0.00 for that fleet)", () => {
    render(
      <CostAnalysisModal
        isOpen
        onClose={() => {}}
        fleetData={[
          {
            label: "UNKNOWN",
            usd: undefined as unknown as number,
            models: [{ name: "Test", share: undefined as unknown as number }],
          },
        ]}
      />,
    );
    expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
    // undefined usd → treated as 0 → $0.00 appears for both total and fleet
    expect(screen.getAllByText("$0.00").length).toBeGreaterThanOrEqual(2);
    // undefined share → 0 → "0%"
    expect(screen.getByText(/Test \(0%\)/)).toBeInTheDocument();
  });
});
