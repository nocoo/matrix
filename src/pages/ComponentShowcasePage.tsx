// ============================================
// Component Showcase Page
// Renders all ported UI components in organized sections.
// Pure view — all data and state from the viewmodel.
// ============================================

import {
  AsciiBox,
  MatrixButton,
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
  TrendMonitor,
  TrendChart,
  ActivityHeatmap,
  BackendStatus,
  SystemHeader,
  IdentityPanel,
  IdentityCard,
  TopModelsPanel,
  LeaderboardPanel,
  UsagePanel,
  NeuralAdaptiveFleet,
  NeuralDivergenceMap,
  GithubStar,
  UpgradeAlertModal,
  CostAnalysisModal,
  MatrixClock,
  TaskSchedule,
  RunHistory,
  RunHeatmap,
  RunnerTrendChart,
  UpcomingTasks,
  AddTaskModal,
  TaskDetailModal,
  RunDetailModal,
} from "@/components/ui";
import { useComponentShowcaseViewModel } from "@/viewmodels/useComponentShowcaseViewModel";

// ── Section header helper ───────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base uppercase font-bold text-matrix-bright mb-3 border-b border-matrix-primary/20 pb-2 font-mono tracking-wider">
      {children}
    </h2>
  );
}

// ── Main page ───────────────────────────────
export default function ComponentShowcasePage() {
  const vm = useComponentShowcaseViewModel();

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* FOUNDATION COMPONENTS                        */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Foundation Components</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* AsciiBox */}
          <AsciiBox title="AsciiBox" subtitle="container">
            <p className="text-matrix-muted mb-3 text-xs font-mono">
              The primary container component with ASCII art borders.
              Supports title, subtitle, and custom body content.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-matrix-panel-strong border border-matrix-primary/20 text-xs font-mono text-matrix-muted">
                Nested content
              </span>
            </div>
          </AsciiBox>

          {/* MatrixButton */}
          <AsciiBox title="MatrixButton" subtitle="actions">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <MatrixButton>Default</MatrixButton>
                <MatrixButton primary>Primary</MatrixButton>
                <MatrixButton size="small">Small</MatrixButton>
                <MatrixButton disabled>Disabled</MatrixButton>
                <MatrixButton loading>Loading</MatrixButton>
              </div>
              <p className="text-xs font-mono text-matrix-dim">
                Variants: default, primary, small, disabled, loading
              </p>
            </div>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* MATRIX CLOCK                                 */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Matrix Clock</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="matrix-panel p-6 flex justify-center relative overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(0, 255, 65, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 255, 65, 0.02) 0%, transparent 50%)
              `,
            }}
          >
            <MatrixClock />
          </div>
          <div className="lg:col-span-2">
            <AsciiBox title="Clock" subtitle="live">
              <p className="text-matrix-muted text-xs font-mono">
                Real-time digital clock with Matrix styling. Features white glowing digits,
                flip animation effect, and scanline texture overlay.
              </p>
            </AsciiBox>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DATA VISUALIZATION                           */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Data Visualization</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RunHeatmap data={vm.heatmap} />
          <RunnerTrendChart data={vm.trend} />
        </div>
      </section>

      {/* ============================================ */}
      {/* TABLES & LISTS                               */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Tables & Lists</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <TaskSchedule
              tasks={vm.tasks}
              loading={false}
              onTrigger={() => {}}
              triggerLoading={false}
            />
          </div>
          <div className="lg:col-span-7">
            <RunHistory
              runs={vm.runs}
              loading={false}
              page={vm.runPage}
              totalPages={vm.totalRunPages}
              onPageChange={vm.setRunPage}
              onSelectRun={vm.handleSelectRun}
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* UPCOMING TASKS                               */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Upcoming Tasks</SectionTitle>
        <UpcomingTasks items={vm.upcomingTasks} count={8} />
      </section>

      {/* ============================================ */}
      {/* COLORS & TYPOGRAPHY                          */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Colors & Typography</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AsciiBox title="Colors" subtitle="palette">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-matrix-primary" />
                  <span className="text-xs font-mono text-matrix-muted">Primary #00FF41</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-matrix-bright" />
                  <span className="text-xs font-mono text-matrix-muted">Bright #B0FFB0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-matrix-muted" />
                  <span className="text-xs font-mono text-matrix-muted">Muted #00CC33</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-matrix-dim" />
                  <span className="text-xs font-mono text-matrix-muted">Dim #008822</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500" />
                  <span className="text-xs font-mono text-matrix-muted">Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500" />
                  <span className="text-xs font-mono text-matrix-muted">Error</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500" />
                  <span className="text-xs font-mono text-matrix-muted">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-matrix-panel border border-matrix-primary/20" />
                  <span className="text-xs font-mono text-matrix-muted">Panel</span>
                </div>
              </div>
            </div>
          </AsciiBox>

          <AsciiBox title="Typography" subtitle="text styles">
            <div className="space-y-2">
              <p className="text-xl text-matrix-bright font-mono">Heading Large</p>
              <p className="text-base text-matrix-primary font-mono">Heading Default</p>
              <p className="text-sm text-matrix-primary font-mono">Body Text</p>
              <p className="text-xs text-matrix-muted uppercase font-mono">Caption Uppercase</p>
              <p className="text-xs text-matrix-dim font-mono">Caption Dim</p>
              <p className="font-mono text-xs text-matrix-primary">Monospace: 0123456789</p>
            </div>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATUS INDICATORS                            */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Status Indicators</SectionTitle>
        <AsciiBox title="Status" subtitle="states">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs uppercase font-mono text-matrix-muted">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-xs uppercase font-mono text-matrix-muted">Error</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-xs uppercase font-mono text-matrix-muted">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-matrix-dim rounded-full" />
              <span className="text-xs uppercase font-mono text-matrix-muted">Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="animate-pulse text-matrix-primary font-mono">{"\u25CF"}</span>
              <span className="text-xs uppercase font-mono text-matrix-muted">Loading</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-mono">{"\u2713"}</span>
              <span className="text-xs uppercase font-mono text-matrix-muted">Success</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-mono">{"\u2717"}</span>
              <span className="text-xs uppercase font-mono text-matrix-muted">Failed</span>
            </div>
          </div>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* MATRIX AVATARS                               */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Matrix Avatars</SectionTitle>
        <AsciiBox title="MatrixAvatar" subtitle="procedural">
          <div className="flex flex-wrap gap-4 items-end">
            {[
              { name: "neo", label: "Normal", size: 48 },
              { name: "morpheus", label: "morpheus", size: 48 },
              { name: "trinity", label: "trinity", size: 48 },
              { name: undefined, label: "Anonymous", size: 48, isAnon: true },
              { name: "the_one", label: "The One", size: 48, isTheOne: true },
              { name: "agent_smith", label: "32px", size: 32 },
              { name: "oracle", label: "64px", size: 64 },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1">
                <MatrixAvatar
                  name={a.name}
                  size={a.size}
                  isAnon={a.isAnon}
                  isTheOne={a.isTheOne}
                />
                <span className="text-xs font-mono text-matrix-dim">{a.label}</span>
              </div>
            ))}
          </div>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* TEXT ANIMATIONS                              */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Text Animations</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AsciiBox title="ScrambleText" subtitle="effect">
            <div className="text-matrix-primary text-base font-mono mb-2">
              <ScrambleText text="SYSTEM ONLINE" durationMs={1500} loop loopDelayMs={3000} />
            </div>
            <p className="text-xs font-mono text-matrix-dim">
              Scrambles characters and reveals text progressively
            </p>
          </AsciiBox>

          <AsciiBox title="DecodingText" subtitle="effect">
            <div className="text-matrix-primary text-base font-mono mb-2">
              <DecodingText text="ACCESS GRANTED" />
            </div>
            <p className="text-xs font-mono text-matrix-dim">
              Simpler decode effect with random characters
            </p>
          </AsciiBox>

          <AsciiBox title="TypewriterText" subtitle="effect">
            <div className="text-matrix-primary text-base font-mono mb-2">
              <TypewriterText text="WAKE UP, NEO..." speedMs={80} loop loopDelayMs={2000} />
            </div>
            <p className="text-xs font-mono text-matrix-dim">
              Classic typewriter effect with cursor
            </p>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONTAINERS & INPUTS                          */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Containers & Inputs</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SignalBox title="TRANSMISSION">
            <p className="text-matrix-muted text-xs font-mono mb-3">
              SignalBox is an alternative container with a decode title effect and dashed line decoration.
            </p>
            <div className="flex gap-2">
              <MatrixButton size="small">Accept</MatrixButton>
              <MatrixButton size="small">Decline</MatrixButton>
            </div>
          </SignalBox>

          <AsciiBox title="MatrixInput" subtitle="form">
            <div className="space-y-3">
              <MatrixInput label="Username" placeholder="Enter your alias..." />
              <MatrixInput label="Access Code" type="password" placeholder="********" />
              <p className="text-xs font-mono text-matrix-dim">
                Styled input fields with labels
              </p>
            </div>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONNECTION STATUS                            */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Connection Status</SectionTitle>
        <AsciiBox title="ConnectionStatus" subtitle="indicator">
          <div className="flex flex-wrap gap-6">
            {(["STABLE", "UNSTABLE", "LOST"] as const).map((status) => (
              <div key={status} className="flex flex-col items-center gap-1">
                <ConnectionStatus status={status} />
                <span className="text-xs font-mono text-matrix-dim">{status}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-matrix-dim mt-3">
            Binary indicator [0]/[1] for stable, [!] for unstable, [x] for lost
          </p>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* DATA DISPLAY                                 */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Data Display</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AsciiBox title="DataRow" subtitle="key-value">
            <div className="space-y-0">
              <DataRow label="Total Runs" value="1,247" />
              <DataRow label="Success Rate" value="94.2%" valueClassName="text-green-500" />
              <DataRow label="Avg Duration" value="45s" subValue="+/-12s" />
              <DataRow label="Failed Today" value="3" valueClassName="text-red-500" />
            </div>
          </AsciiBox>

          <AsciiBox title="Sparkline" subtitle="mini chart">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-matrix-dim w-16">7 days:</span>
                <Sparkline values={[12, 19, 15, 25, 22, 30, 28]} width={200} height={40} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-matrix-dim w-16">Volatile:</span>
                <Sparkline values={[5, 45, 12, 38, 8, 42, 15, 35]} width={200} height={40} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-matrix-dim w-16">Trending:</span>
                <Sparkline values={[10, 15, 18, 25, 30, 38, 45, 52]} width={200} height={40} />
              </div>
            </div>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* LEADERBOARD                                  */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Leaderboard</SectionTitle>
        <AsciiBox title="LeaderboardRow" subtitle="ranking">
          <div className="space-y-0">
            <LeaderboardRow rank={1} name="NEO" value={9999} isTheOne />
            <LeaderboardRow rank={2} name="MORPHEUS" value={8750} />
            <LeaderboardRow rank={3} name="TRINITY" value={8200} />
            <LeaderboardRow rank={4} name="TANK" value={6540} isSelf />
            <LeaderboardRow rank={5} name="UNKNOWN" value={5000} isAnon />
          </div>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* LIVE SNIFFER                                 */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Live Sniffer</SectionTitle>
        <AsciiBox title="LiveSniffer" subtitle="log stream">
          <div className="h-36">
            <LiveSniffer />
          </div>
          <p className="text-xs font-mono text-matrix-dim mt-3">
            Animated log stream with rotating messages
          </p>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* MATRIX RAIN                                  */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Matrix Rain</SectionTitle>
        <AsciiBox title="MatrixRain" subtitle="background">
          <div className="relative h-40 overflow-hidden border border-matrix-primary/20 bg-black">
            <MatrixRain />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-matrix-bright text-base font-mono bg-black/80 px-3 py-1.5">
                CANVAS BACKGROUND EFFECT
              </span>
            </div>
          </div>
          <p className="text-xs font-mono text-matrix-dim mt-3">
            Falling digital rain effect rendered on canvas. Use as background overlay.
          </p>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* BOOT SCREEN                                  */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Boot Screen</SectionTitle>
        <AsciiBox title="BootScreen" subtitle="loading">
          <div className="h-56 overflow-hidden border border-matrix-primary/20">
            <BootScreen />
          </div>
          <p className="text-xs font-mono text-matrix-dim mt-3">
            Full-screen boot/loading animation with ASCII art logo
          </p>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* BACKEND STATUS                               */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Backend Status</SectionTitle>
        <AsciiBox title="BackendStatus" subtitle="indicator">
          <div className="flex flex-wrap gap-6">
            {(["active", "checking", "down"] as const).map((status) => (
              <div key={status} className="flex flex-col items-center gap-1">
                <BackendStatus status={status} />
                <span className="text-xs font-mono text-matrix-dim uppercase">{status}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-matrix-dim mt-3">
            Backend health indicator with color-coded status
          </p>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* SYSTEM HEADER                                */}
      {/* ============================================ */}

      <section>
        <SectionTitle>System Header</SectionTitle>
        <AsciiBox title="SystemHeader" subtitle="layout">
          <div className="border border-matrix-primary/20 p-3">
            <SystemHeader
              title="NEURAL MATRIX"
              signalLabel="v2.0.1"
              time="09:41:23"
            />
          </div>
          <p className="text-xs font-mono text-matrix-dim mt-3">
            System header with title, signal label, and time display
          </p>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* IDENTITY COMPONENTS                          */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Identity Components</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AsciiBox title="IdentityPanel" subtitle="full">
            <IdentityPanel
              name="NEO"
              streakDays={42}
              rankLabel="#7"
            />
          </AsciiBox>

          <AsciiBox title="IdentityCard" subtitle="compact">
            <div className="space-y-3">
              <IdentityCard name="MORPHEUS" subtitle="Operator" isPublic />
              <IdentityCard name="TRINITY" subtitle="Pilot" isPublic />
              <IdentityCard name="NEO" subtitle="The One" isPublic />
            </div>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* TOP MODELS PANEL                             */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Top Models Panel</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopModelsPanel rows={vm.topModelRows} />
          <AsciiBox title="Usage" subtitle="info">
            <p className="text-matrix-muted text-xs font-mono">
              Displays AI model usage rankings with cost breakdown and percentage bars.
              Perfect for showing which models consume the most resources.
            </p>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* LEADERBOARD PANEL                            */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Leaderboard Panel</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LeaderboardPanel
            title="TOP OPERATORS"
            rows={vm.leaderboard}
          />
          <AsciiBox title="Features" subtitle="info">
            <ul className="space-y-1.5 text-matrix-muted text-xs font-mono">
              <li>- Rank medals for top 3 positions</li>
              <li>- &quot;The One&quot; special styling</li>
              <li>- Self-highlight for current user</li>
              <li>- Anonymous user display</li>
            </ul>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* USAGE PANEL                                  */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Usage Panel</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <UsagePanel
              title="USAGE STATS"
              summaryLabel="TOTAL COST"
              summaryValue="$279.80"
              useSummaryLayout
            />
          </div>
          <AsciiBox title="Stats" subtitle="metrics">
            <p className="text-matrix-muted text-xs font-mono">
              Displays key usage metrics: cost, tokens, requests, and latency.
            </p>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* NEURAL FLEET VISUALIZATION                   */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Neural Fleet Visualization</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AsciiBox title="NeuralAdaptiveFleet" subtitle="bar chart">
            <NeuralAdaptiveFleet
              label={vm.neuralFleetData[0].label}
              totalPercent={vm.neuralFleetData[0].totalPercent}
              usage={vm.neuralFleetData[0].usage}
              models={vm.neuralFleetData[0].models}
            />
          </AsciiBox>
          <NeuralDivergenceMap fleetData={vm.neuralFleetData} />
        </div>
      </section>

      {/* ============================================ */}
      {/* TREND MONITOR                                */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Trend Monitor</SectionTitle>
        <TrendMonitor label="DAILY OPERATIONS" data={vm.trendMonitorData} />
      </section>

      {/* ============================================ */}
      {/* ACTIVITY HEATMAP                             */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Activity Heatmap</SectionTitle>
        <AsciiBox title="ActivityHeatmap" subtitle="yearly">
          <ActivityHeatmap heatmap={vm.activityHeatmap} />
          <p className="text-xs font-mono text-matrix-dim mt-3">
            GitHub-style yearly activity heatmap (52 weeks x 7 days)
          </p>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* MISC COMPONENTS                              */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Misc Components</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AsciiBox title="GithubStar" subtitle="button">
            <div className="flex justify-center py-3">
              <GithubStar repo="anomalyco/runner" />
            </div>
          </AsciiBox>
          <div className="lg:col-span-2">
            <AsciiBox title="UpgradeAlertModal" subtitle="banner">
              <UpgradeAlertModal
                requiredVersion="2.1.0"
                installCommand="npm install -g runner@latest"
                onClose={() => {}}
              />
            </AsciiBox>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* COST ANALYSIS MODAL                          */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Cost Analysis Modal</SectionTitle>
        <AsciiBox title="CostAnalysisModal" subtitle="breakdown">
          <div className="space-y-3">
            <p className="text-matrix-muted text-xs font-mono">
              Modal for displaying detailed cost breakdown by category.
            </p>
            <MatrixButton onClick={vm.handleOpenCostModal}>
              Open Cost Analysis
            </MatrixButton>
          </div>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* SIMPLE TREND CHART (BAR)                     */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Trend Chart (Simple Bar)</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AsciiBox title="TrendChart" subtitle="bar chart">
              <TrendChart
                data={vm.simpleTrendData}
                unitLabel="tokens"
                leftLabel="12 DAYS AGO"
                rightLabel="TODAY"
              />
            </AsciiBox>
          </div>
          <AsciiBox title="Usage" subtitle="info">
            <p className="text-matrix-muted text-xs font-mono">
              Simple bar chart for trend visualization. Shows values over time with peak detection.
            </p>
          </AsciiBox>
        </div>
      </section>

      {/* ============================================ */}
      {/* SUMMARY STATISTICS                           */}
      {/* ============================================ */}

      <section>
        <SectionTitle>Summary Statistics</SectionTitle>
        <AsciiBox title="Showcase Stats" subtitle="computed from model">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-mono text-matrix-primary">{vm.tasks.length}</div>
              <div className="text-xs font-mono text-matrix-dim">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-mono text-matrix-primary">{vm.totalSchedules}</div>
              <div className="text-xs font-mono text-matrix-dim">Schedules</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-mono text-matrix-primary">{vm.allRuns.length}</div>
              <div className="text-xs font-mono text-matrix-dim">Total Runs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-mono text-green-500">
                {(vm.successRate * 100).toFixed(0)}%
              </div>
              <div className="text-xs font-mono text-matrix-dim">Success Rate</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-matrix-primary/10">
            <p className="text-xs font-mono text-matrix-dim">
              Executors: {Object.entries(vm.executorCounts).map(([k, v]) => `${k}(${v})`).join(", ")}
            </p>
          </div>
        </AsciiBox>
      </section>

      {/* ============================================ */}
      {/* MODALS (rendered at bottom, visibility from vm) */}
      {/* ============================================ */}

      <RunDetailModal
        run={vm.selectedRun}
        loading={false}
        output={vm.selectedRun ? vm.runOutput : null}
        outputLoading={false}
        outputError={null}
        onClose={vm.handleCloseRunDetail}
      />

      <TaskDetailModal
        task={vm.selectedTask}
        onClose={vm.handleCloseTaskDetail}
      />

      <AddTaskModal
        open={vm.showAddTask}
        onClose={vm.handleCloseAddTask}
      />

      <CostAnalysisModal
        isOpen={vm.showCostModal}
        onClose={vm.handleCloseCostModal}
        fleetData={vm.fleetData}
      />
    </div>
  );
}
