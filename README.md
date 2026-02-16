# Matrix

**The fine-grained substrate for your digital reality.**

A cyberpunk dashboard UI kit with 40+ components, 27 pages, and a strict MVVM architecture — built with React 19, Tailwind CSS v4, and TypeScript.

> Green-on-black. ASCII borders. Scanlines. Monospace everything. If _The Matrix_ had a SaaS dashboard, it would look like this.

![Matrix Dashboard](https://s.zhe.to/dcd0e6e42358/20260214/e292e1e7-55c4-42f7-8c07-83356c7ed20b.jpg)

---

## Features

- **40+ UI Components** — AsciiBox, MatrixButton, MatrixShell, MatrixRain, BootScreen, Sparkline, TrendMonitor, ActivityHeatmap, NeuralDivergenceMap, IdentityCard, MatrixClock, and more
- **Strict MVVM Architecture** — Models (pure logic, zero React), ViewModels (hooks), Pages (pure UI)
- **27 Pages** — Dashboard, 9 Controls pages, Accounts, Cards, Records, Life.ai, Component Showcase, and more
- **Matrix Design System** — Custom Tailwind v4 theme with `matrix-primary`, `matrix-bright`, `matrix-muted`, `matrix-dim`, panel tokens, and glow effects
- **768 Tests** — 56 test files covering every model, viewmodel, page, and component
- **Quality Gates** — Husky pre-commit (tests) and pre-push (tests + lint) hooks
- **Single Dark Theme** — No light mode. Sharp corners only. Maximalist cyberpunk aesthetic

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) |
| Framework | [React 19](https://react.dev) |
| Routing | [React Router v7](https://reactrouter.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org) (strict mode) |
| Bundler | [Vite 7](https://vite.dev) |
| Testing | [Vitest 4](https://vitest.dev) + Testing Library |
| Linting | [ESLint 9](https://eslint.org) (flat config) |
| Hooks | [Husky 9](https://typicode.github.io/husky) |
| Icons | [Lucide React](https://lucide.dev) |

## Quick Start

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

## Project Structure

```
src/
├── components/
│   ├── ui/                  # 40+ reusable UI components
│   │   ├── AsciiBox.tsx         # Box-drawing container
│   │   ├── MatrixButton.tsx     # Polymorphic button (3 sizes, primary, loading)
│   │   ├── MatrixShell.tsx      # Page shell with MatrixRain background
│   │   ├── MatrixExtras.tsx     # 13 components (Avatar, Scramble, Sparkline...)
│   │   ├── DataVizComponents.tsx # TrendMonitor, ActivityHeatmap, TrendChart
│   │   ├── VibeComponents.tsx   # 12 business panels (Identity, Fleet, Leaderboard...)
│   │   ├── RunnerComponents.tsx # 9 task runner components (Clock, Schedule, Heatmap...)
│   │   └── Toast.tsx            # Toast notification
│   └── DashboardLayout.tsx  # Sidebar nav + header + Outlet
├── models/                  # Pure functions & types (zero React)
├── viewmodels/              # React hooks composing models + state
├── pages/                   # 27 page components (pure UI)
│   └── controls/            # 9 Controls pages (Controls, Buttons, Feedback...)
├── data/
│   └── mock.ts              # Centralized mock data
├── lib/
│   ├── utils.ts             # cn() utility
│   ├── palette.ts           # Chart color palette
│   ├── date.ts              # Date utilities
│   └── format.ts            # Formatting utilities
└── test/
    ├── models/              # 15 test files
    ├── viewmodels/          # 12 test files
    ├── pages/               # 18 test files
    ├── components/          # 7 test files
    └── lib/                 # 3 test files
```

## Architecture

Matrix follows a strict **MVVM (Model-View-ViewModel)** pattern:

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    Model      │────>│    ViewModel     │────>│     Page     │
│  (pure logic) │     │  (React hooks)   │     │  (pure UI)   │
│  zero React   │     │  useMemo, state  │     │  consumes VM │
└──────────────┘     └──────────────────┘     └──────────────┘
```

- **Models** — Pure TypeScript functions and types. No React imports. Testable in isolation.
- **ViewModels** — React hooks that compose models with `useMemo`, `useState`, `useCallback`. One hook per page.
- **Pages** — Pure rendering. All data and callbacks come from the viewmodel. Zero business logic.

## Component Library

### Foundation
| Component | Description |
|-----------|-------------|
| `AsciiBox` | Box-drawing container with title/subtitle/headerRight |
| `MatrixButton` | Polymorphic button — 3 sizes, primary variant, loading state |
| `MatrixShell` | Full-page shell with MatrixRain background and scanlines |
| `MatrixInput` | Styled input field with label |
| `MatrixSelect` | Portal-based custom dropdown (no native select) |
| `SignalBox` | Alternative container with decode title effect |
| `FloatingPortal` | Portal-based floating panel for dropdowns/popovers |

### Data Display
| Component | Description |
|-----------|-------------|
| `DataRow` | Key-value row with optional sub-value |
| `Sparkline` | Inline SVG mini chart |
| `TrendMonitor` | Smooth curve chart with tooltip |
| `TrendChart` | Simple bar chart with peak detection |
| `ActivityHeatmap` | GitHub-style yearly heatmap |
| `RunHeatmap` | 30-day x 8-slot execution heatmap |

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
| `IdentityPanel` / `IdentityCard` | User identity display with rank and stats |
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

## Pages

### Sidebar Navigation

The sidebar is organized into 5 groups with 27 items:

**BLOCKS** — Dashboard, Accounts, Cards, Records, Progress, Life.ai, Components

**CONTROLS** — Controls, Buttons, Feedback, Overlays, Data, Navigation, Forms, Tables, Pills

**CHARTS** — Stats, Flows, Portfolio

**PAGES** — Login, Static, Loading, 404

**SYSTEM** — Help, Palette, Interactions, Settings

### Route Map

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | System status, clock, identity, signal monitor, pixel heatmap, targets, accounts, budget, trend, cash flow, activity |
| `/accounts` | Accounts | Account balances and changes |
| `/card-showcase` | Cards | Credit card display with flip animations |
| `/records` | Records | Transaction list with filtering |
| `/progress-tracking` | Progress | Budget progress bars |
| `/stats` | Stats | Statistical charts and breakdowns |
| `/flow-comparison` | Flows | Income vs expense comparison |
| `/portfolio` | Portfolio | Investment allocation |
| `/life-ai` | Life.ai | Health tracking with heatmap |
| `/component-showcase` | Components | Every UI component demonstrated |
| `/controls` | Controls | Master controls overview |
| `/buttons` | Buttons | Button variants and states |
| `/feedback` | Feedback | Alerts, toasts, progress indicators |
| `/overlays` | Overlays | Modals, popovers, dropdowns |
| `/data-display` | Data | Badges, avatars, lists, tables |
| `/navigation` | Navigation | Tabs, breadcrumbs, pagination, menus |
| `/forms` | Forms | Inputs, selects, checkboxes, sliders, toggles |
| `/tables` | Tables | Data tables with sorting and selection |
| `/pills` | Pills | Tags, badges, status pills |
| `/help` | Help | FAQ accordion |
| `/palette` | Palette | Design token reference |
| `/interactions` | Interactions | Toast and dialog demos |
| `/settings` | Settings | User preferences |
| `/login` | Login | Maximalist cyberpunk login with MatrixRain background |
| `/static-page` | Static | Static content template |
| `/loading` | Loading | Loading state template |
| `*` | 404 | Not found |

## Testing

### Running Tests

```bash
# Run all 768 tests
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
| `test/models/` | 15 | Pure function tests — no DOM, no React |
| `test/viewmodels/` | 12 | Hook tests using `renderHook` |
| `test/pages/` | 18 | Page smoke tests with mocked viewmodels |
| `test/components/` | 7 | Component rendering and interaction tests |
| `test/lib/` | 3 | Utility function tests (date, format, matrix-utils) |

### Git Hooks (Husky 9)

| Hook | Runs | Purpose |
|------|------|---------|
| **pre-commit** | `bun run test` | All unit tests must pass before committing |
| **pre-push** | `bun run test && bun run lint` | Full test suite + ESLint must pass before pushing |

### Writing Tests

Page tests mock the corresponding viewmodel using `vi.hoisted()` for mutable state:

```tsx
const mockState = vi.hoisted(() => ({
  items: [{ id: 1, name: "test" }],
}));

vi.mock("@/viewmodels/useFooViewModel", () => ({
  useFooViewModel: () => mockState,
}));

beforeEach(() => {
  mockState.items = [{ id: 1, name: "reset" }];
});
```

> **Why `vi.hoisted()`?** — `vi.mock` factories are hoisted at compile time. Regular variables declared after the mock are not yet initialized when the factory runs. `vi.hoisted()` creates a reference available at hoist time that can be mutated in `beforeEach`.

## Design Tokens

Matrix uses a custom Tailwind v4 theme with CSS custom properties:

```css
--matrix-primary:      #00FF41   /* The green */
--matrix-bright:       #B0FFB0   /* High emphasis */
--matrix-muted:        #00CC33   /* Body text */
--matrix-dim:          #008822   /* Subtle text */
--matrix-bg:           #050505   /* Background */
--matrix-panel:        rgba(0, 255, 65, 0.03)
--matrix-panel-strong: rgba(0, 255, 65, 0.06)
```

Use them in Tailwind classes: `text-matrix-primary`, `bg-matrix-panel`, `border-matrix-dim`, etc.

## Acknowledgments

This project is inspired by and built upon the **Matrix-A Design System** from [VibeUsage](https://github.com/victorGPT/vibeusage) by [@victorGPT](https://github.com/victorGPT). The cyberpunk dashboard aesthetic, component patterns, and design language owe a great deal to their pioneering work. Thank you to the open-source community for making projects like this possible.

## License

[MIT](./LICENSE) © 2026 Zheng Li
