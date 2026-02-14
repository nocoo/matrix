# 🟩 Matrix

**The fine-grained substrate for your digital reality.**

A sci-fi dashboard UI kit with 40+ components, 20 pages, and a strict MVVM architecture — built with React 19, Tailwind CSS v4, and TypeScript.

> Green-on-black. ASCII borders. Scanlines. Monospace everything. If _The Matrix_ had a SaaS dashboard, it would look like this.

![Matrix Dashboard Screenshot](./screenshot.png)
<!-- TODO: Replace with actual screenshot -->

---

## ✨ Features

- 🧩 **40+ UI Components** — AsciiBox, MatrixButton, MatrixShell, MatrixRain, BootScreen, Sparkline, TrendMonitor, ActivityHeatmap, NeuralDivergenceMap, and more
- 📐 **Strict MVVM Architecture** — Models (pure logic, zero React), ViewModels (hooks), Pages (pure UI)
- 📄 **20 Pages** — Dashboard, Accounts, Cards, Records, Progress Tracking, Targets, Stats, Portfolio, Life.ai, Component Showcase, and more
- 🎨 **Matrix Design System** — Custom Tailwind v4 theme with `matrix-primary`, `matrix-bright`, `matrix-muted`, `matrix-dim`, panel tokens, and glow effects
- 🧪 **749 Tests** — Unit tests for every model, viewmodel, page, and component with 90%+ coverage enforced
- 🔒 **Quality Gates** — Husky pre-commit (tests) and pre-push (tests + lint) hooks
- 📦 **~127KB gzipped** — Lean production bundle, no heavy charting libraries

## 🖼️ Screenshots

| Dashboard | Component Showcase | Life.ai |
|:---------:|:------------------:|:-------:|
| ![Dashboard](./screenshots/dashboard.png) | ![Showcase](./screenshots/showcase.png) | ![Life.ai](./screenshots/life-ai.png) |

<!-- TODO: Add actual screenshots -->

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚡ Runtime | [Bun](https://bun.sh) |
| ⚛️ Framework | [React 19](https://react.dev) |
| 🔀 Routing | [React Router v7](https://reactrouter.com) |
| 🎨 Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| 📝 Language | [TypeScript 5.9](https://www.typescriptlang.org) (strict mode) |
| 📦 Bundler | [Vite 7](https://vite.dev) |
| 🧪 Testing | [Vitest 4](https://vitest.dev) + Testing Library |
| 🔍 Linting | [ESLint 9](https://eslint.org) (flat config) |
| 🐶 Hooks | [Husky 9](https://typicode.github.io/husky) |
| 🎯 Icons | [Lucide React](https://lucide.dev) |

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/nocoo/matrix.git
cd matrix

# Install dependencies
bun install

# Start dev server (port 7019)
bun dev

# Run tests
bun test

# Build for production
bun run build

# Lint
bun run lint
```

Open [http://localhost:7019](http://localhost:7019) to see the dashboard.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                  # 🧩 40+ reusable UI components
│   │   ├── AsciiBox.tsx         # Box-drawing container
│   │   ├── MatrixButton.tsx     # Polymorphic button (3 sizes, primary, loading)
│   │   ├── MatrixShell.tsx      # Page shell with MatrixRain background
│   │   ├── MatrixExtras.tsx     # 13 components (Avatar, Scramble, Sparkline...)
│   │   ├── DataVizComponents.tsx # TrendMonitor, ActivityHeatmap, TrendChart
│   │   ├── VibeComponents.tsx   # 12 business panels (Identity, Fleet, Leaderboard...)
│   │   ├── RunnerComponents.tsx # 9 task runner components (Clock, Schedule, Heatmap...)
│   │   └── Toast.tsx            # Toast notification
│   └── DashboardLayout.tsx  # Sidebar nav + header + Outlet
├── models/                  # 📐 Pure functions & types (zero React)
├── viewmodels/              # 🔗 React hooks composing models + state
├── pages/                   # 📄 20 page components (pure UI)
├── data/
│   └── mock.ts              # 🗃️ Centralized mock data
├── lib/
│   ├── utils.ts             # cn() utility
│   ├── palette.ts           # Chart color palette
│   ├── date.ts              # Date utilities
│   └── format.ts            # Formatting utilities
└── test/
    ├── models/              # 15 test files
    ├── viewmodels/          # 12 test files
    └── pages/               # 15 test files
```

## 🏗️ Architecture

Matrix follows a strict **MVVM (Model-View-ViewModel)** pattern:

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    Model      │────▶│    ViewModel     │────▶│     Page     │
│  (pure logic) │     │  (React hooks)   │     │  (pure UI)   │
│  zero React   │     │  useMemo, state  │     │  consumes VM │
└──────────────┘     └──────────────────┘     └──────────────┘
```

- **Models** — Pure TypeScript functions and types. No React imports. Testable in isolation.
- **ViewModels** — React hooks that compose models with `useMemo`, `useState`, `useCallback`. One hook per page.
- **Pages** — Pure rendering. All data and callbacks come from the viewmodel. Zero business logic.

## 🧩 Component Library

### Foundation
| Component | Description |
|-----------|-------------|
| `AsciiBox` | Box-drawing container with title/subtitle/headerRight |
| `MatrixButton` | Polymorphic button — 3 sizes, primary variant, loading state |
| `MatrixShell` | Full-page shell with MatrixRain background and scanlines |
| `MatrixInput` | Styled input field with label |
| `SignalBox` | Alternative container with decode title effect |

### Data Display
| Component | Description |
|-----------|-------------|
| `DataRow` | Key-value row with optional sub-value |
| `Sparkline` | Inline SVG mini chart |
| `TrendMonitor` | Smooth curve chart with tooltip |
| `TrendChart` | Simple bar chart with peak detection |
| `ActivityHeatmap` | GitHub-style yearly heatmap |
| `RunHeatmap` | 30-day × 8-slot execution heatmap |

### Effects & Animation
| Component | Description |
|-----------|-------------|
| `MatrixRain` | Canvas-rendered falling digital rain |
| `BootScreen` | ASCII art boot/loading sequence |
| `ScrambleText` | Progressive character scramble reveal |
| `DecodingText` | Random character decode effect |
| `TypewriterText` | Classic typewriter with cursor |
| `LiveSniffer` | Animated log stream |

### Business Panels
| Component | Description |
|-----------|-------------|
| `IdentityPanel` / `IdentityCard` | User identity display |
| `TopModelsPanel` | AI model usage ranking |
| `LeaderboardPanel` / `LeaderboardRow` | Ranked leaderboard |
| `UsagePanel` | Usage statistics with summary layout |
| `NeuralAdaptiveFleet` | Provider usage bar chart |
| `NeuralDivergenceMap` | Multi-provider fleet comparison |
| `CostAnalysisModal` | Cost breakdown modal |

### Runner
| Component | Description |
|-----------|-------------|
| `MatrixClock` | Animated digital clock with flip effect |
| `TaskSchedule` | Cron task list with trigger buttons |
| `RunHistory` | Paginated run history table |
| `UpcomingTasks` | Countdown to next scheduled runs |
| `RunDetailModal` / `TaskDetailModal` | Detail modals |

## 📄 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Overview with stats, charts, recent activity |
| `/accounts` | Accounts | Account balances and changes |
| `/card-showcase` | Card Showcase | Credit card display with flip animations |
| `/records` | Records | Transaction list with filtering |
| `/progress-tracking` | Progress Tracking | Budget progress bars |
| `/targets` | Targets | Savings goals with progress |
| `/stats` | Stats Overview | Statistical charts and breakdowns |
| `/flow-comparison` | Flow Comparison | Income vs expense comparison |
| `/portfolio` | Portfolio | Investment allocation |
| `/life-ai` | Life.ai | Health tracking with heatmap |
| `/component-showcase` | Component Showcase | 📚 Every UI component demonstrated |
| `/help` | Help Center | FAQ accordion |
| `/palette` | Color Palette | Design token reference |
| `/interactions` | Interactions | Toast and dialog demos |
| `/settings` | Settings | User preferences |
| `/login` | Login | Standalone login page |
| `/static-page` | Static Page | Static content template |
| `/loading` | Loading | Loading state template |
| `*` | 404 | Not found |

## 🧪 Testing, Hooks & Coverage

### Running Tests

```bash
# Run all 749 tests
bun test

# Run with coverage report
bun run test:coverage

# Run a single file
bun run test src/test/pages/DashboardPage.test.tsx

# Lint
bun run lint
```

### Test Structure

Tests mirror the source directory layout under `src/test/`:

| Directory | Files | Description |
|-----------|-------|-------------|
| `test/models/` | 14 files | Pure function tests — no DOM, no React |
| `test/viewmodels/` | 12 files | Hook tests using `renderHook` |
| `test/pages/` | 15+ files | Page smoke tests with mocked viewmodels |
| `test/components/` | 6 files | Component rendering and interaction tests |
| `test/lib/` | 3 files | Utility function tests (date, format, matrix-utils) |

### Coverage

Coverage is enforced at **90%** for all four metrics via `vitest.config.ts`:

| Metric | Threshold | Current |
|--------|-----------|---------|
| Statements | 90% | 97.43% |
| Branches | 90% | 90.19% |
| Functions | 90% | 99.08% |
| Lines | 90% | 98.75% |

The coverage provider is **v8**. Reports are generated in `text`, `text-summary`, and `lcov` formats. The `coverage/` directory is gitignored.

Excluded from coverage: `src/test/**`, `src/main.tsx`, `*.d.ts`, `src/models/types.ts` (pure types, no runtime), `src/components/ui/index.ts` (barrel re-exports).

### Git Hooks (Husky 9)

Husky is configured to enforce quality gates automatically:

| Hook | Runs | Purpose |
|------|------|---------|
| **pre-commit** | `bun run test` | All unit tests must pass before committing |
| **pre-push** | `bun run test && bun run lint` | Full test suite + ESLint must pass before pushing |

Hooks are installed automatically via the `prepare` script when running `bun install`. The hook scripts live in `.husky/` and are checked into git so the entire team shares the same gates.

### Writing Tests

**Mocking viewmodels**: Page tests mock the corresponding viewmodel using `vi.hoisted()` for mutable state:

```tsx
const mockState = vi.hoisted(() => ({
  items: [{ id: 1, name: "test" }],
}));

vi.mock("@/viewmodels/useFooViewModel", () => ({
  useFooViewModel: () => mockState,
}));

// In beforeEach, mutate mockState to test different branches
beforeEach(() => {
  mockState.items = [{ id: 1, name: "reset" }];
});
```

> **Why `vi.hoisted()`?** — `vi.mock` factories are hoisted to the top of the file at compile time. Regular `let`/`const` variables declared after the mock are not yet initialized when the factory runs. `vi.hoisted()` creates a reference that is available at hoist time and can be mutated in `beforeEach` to test different code paths.

## 🎨 Design Tokens

Matrix uses a custom Tailwind v4 theme with CSS custom properties:

```css
--matrix-primary:  #00FF41   /* The green */
--matrix-bright:   #B0FFB0   /* High emphasis */
--matrix-muted:    #00CC33   /* Body text */
--matrix-dim:      #008822   /* Subtle text */
--matrix-bg:       #050505   /* Background */
--matrix-panel:    rgba(0, 255, 65, 0.03)
--matrix-panel-strong: rgba(0, 255, 65, 0.06)
```

Use them in Tailwind classes: `text-matrix-primary`, `bg-matrix-panel`, `border-matrix-dim`, etc.

## 📜 License

[MIT](./LICENSE) © 2026 Zheng Li
