# Matrix

Green-on-black React component and dashboard-template showcase with synthetic data (static SPA + Cloudflare health/asset Worker, `ts-worker-web`).
Docs: [README.md](README.md) · [Design & Release Contract](docs/01-design-contract.md) · [Quality Gates](docs/02-quality-gates.md) · [Retrospective](Retrospective.md)

## Commands

Run from root with Bun (`packageManager` 1.3.6; CI 1.4.2; Node 24+ recommended). Stack: React 19, Tailwind v4, Vite 8/SWC, React Router, TypeScript 7 strict, Biome, Vitest/jsdom, Cloudflare asset Worker (`worker.ts`, `wrangler.toml`, `dist/`). Layout: `src/components/ui/`, `src/lib/`, `src/models/`, `src/viewmodels/`, `src/pages/`. No backend accounts or env vars needed.

```sh
bun install --frozen-lockfile
bun run dev                 # http://localhost:7013 (https://matrix.dev.hexly.ai)
bun run typecheck           # S1
bun run lint                # S2 check-only, 0 warnings (biome)
bun run test                # unit tests; focused: bun run test src/test/lib/format.test.ts
bun run test:coverage       # L1 >= 80% on src/lib/** + matrix-utils.ts
bun run test:e2e            # L4 Playwright Chromium smoke suite against dist/
bun run gate:l1-self-test   # L1 pre-commit hook probe suite (temp worktree)
bun run build               # B1 emits dist/ (does not deploy)
bun run preview             # preview built dist/
```

Mock animated text/rain (`ScrambleText`, `DecodingText`, `TypewriterText`, `MatrixRain`) to stable text in unit tests.

## Invariants

- Static mock-data template only: login, finance, health, and task pages never authenticate users or touch real accounts; never introduce real financial/health accounts as fixtures.
- Preserve MVVM: keep `src/models/` and `src/viewmodels/` independent of Views/DOM; concentrate reusable code in `src/components/ui/` and `src/lib/` and test real logic added elsewhere.
- Enforce Matrix green-on-black dark-only UI: no grayscale hint text or cross-color dialog mixing; keep rectangles, radios, spinners, and slider thumbs square (`rounded-full` for true circles only).
- Use `MatrixSelect` (never native `<select>`); preserve portal positioning, `MatrixButton` `forwardRef`, and `default/header/small` sizes ([design contract](docs/01-design-contract.md)).
- Tailwind v4 uses `@tailwindcss/vite` and `@theme` in `src/index.css` (no `tailwind.config.ts`); preserve named Matrix tokens and sidebar background treatment.
- Never hardcode displayed versions: root `package.json` is canonical via `__APP_VERSION__` (`vite.config.ts`, mirrored in `vitest.config.ts`).
- Health endpoint & Worker: Vite serves `/api/live` in dev and emits `dist/api/live`; `worker.ts` serves it with JSON + `no-store` headers and preserves SPA fallback (`wrangler.toml`).
- Raise enforcement to match requirements; never bypass hooks or lower the four-metric 80% coverage contract to mask regressions, and preserve visual constraints when adding coverage.
- Authorized releases only: sync `package.json`/`CHANGELOG.md`, tag `vX.Y.Z`, and release per [design contract](docs/01-design-contract.md); verify homepage/assets, SPA routes, and `/api/live` (`no-store`).

## Quality & Local Gates

Follows `system1-quality`; CI slot definitions and pinned `base-ci` revision live in `.github/workflows/quality-slots.yml` (invoked via `.github/workflows/ci.yml`; `quality / Z1: Gate` required on `main`). Status vocabulary: `enforced`, `planned`, `manual`, `N/A`.

- **Exceptions / gaps**: `L2 Runtime` is `N/A` (static Cloudflare asset Worker); `L3 Integration` (`planned`, no Worker HTTP E2E); `L4 E2E` (`enforced` / `impl`, Playwright Chromium smoke suite in `tests/e2e/` against built `dist/`); `P1 Package` (`enforced` / `impl`, `wrangler deploy --dry-run` against built `dist/`).
- **L1 scope**: `vitest.config.ts` enforces 80/80/80/80 thresholds on `src/lib/**` and `src/components/ui/matrix-utils.ts` (UI components excluded); `bun run gate:l1-self-test` remains local-only.
- **Pre-commit**: installed via `bun run prepare` (`.husky/pre-commit`); checks staged index (`G1` `gitleaks`, then `S1`/`S2`/`L1` + non-empty `coverage/lcov.info`, `L1_PRECOMMIT_TIMEOUT_SEC` default `30`s).
- **Pre-push**: `.husky/pre-push` runs `build`/`test:coverage`/`lint` then `osv-scanner` (`G2`), without `set -e` (OSV can mask prior failures); see [quality gates](docs/02-quality-gates.md).

## Resources & Isolation

| Lane  | Endpoint / State                                            | Boundary                                                                 |
| ----- | ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| Dev   | `http://localhost:7013` (`https://matrix.dev.hexly.ai`)     | Synthetic state only; no backend credentials or env vars                 |
| Tests | Future L3/L4 local Worker & browser profile                 | Separate port and per-run isolated state; no remote test Workers or DBs  |
| Prod  | `https://matrix.hexly.ai` (`theme-matrix` Worker + `dist/`) | Health/assets only; read-only checks unless release/deploy is authorized |

## Retrospective

Record incident narratives in [Retrospective.md](Retrospective.md); promote recurring project constraints to `Invariants` above and deterministic safeguards to tests/hooks.
