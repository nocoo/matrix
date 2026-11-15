# Matrix

Green-on-black React component and dashboard-template showcase with synthetic data.
Profile: ts-worker-web (static SPA with a health/asset Worker).
Direction: [README.md](README.md), [design contract](docs/01-design-contract.md).

## Scope and instruction sources

- This file is the only project handbook; nested files do not compete with it. Do not create a `CLAUDE.md` alias or copy.
- This file is the contract; hooks, CI and config enforce it. Raise enforcement to match requirements, never lower the contract to a weaker threshold. Frameworks must not rewrite this file.
- Human docs: [README.md](README.md) and the [design contract](docs/01-design-contract.md). Version: root `package.json`; Vite `__APP_VERSION__`, mirrored in the Vitest config. Enforcement: `.husky/`, `.github/workflows/ci.yml`, `vitest.config.ts`. Environment: no backend credentials needed. Accidents: [Retrospective.md](Retrospective.md).

## Project invariants

- This is a static template using mock data. Login, finance, health and task pages do not authenticate users or operate real accounts.
- Preserve MVVM: models and ViewModels stay independent of Views/DOM. Reusable value is concentrated in `src/components/ui/` and `src/lib/`; test real logic introduced elsewhere rather than hiding it as scaffolding.
- Keep maximalist Matrix green-on-black, one dark theme, no grayscale hint text or cross-color dialog mixing. Rectangles, radios, spinners and slider thumbs stay square; only true circles use `rounded-full`.
- Use `MatrixSelect`, never native select. Preserve portal positioning, button `forwardRef` and `default/header/small` sizes; design specifics live in the linked contract.
- Tailwind v4 uses `@tailwindcss/vite` and `@theme` in `src/index.css`; no `tailwind.config.ts`. Preserve named Matrix tokens and sidebar background treatment.
- Never hardcode a displayed version. Vite serves `/api/live` in dev and emits versioned `dist/api/live`; production `worker.ts` serves this asset with JSON/no-store headers and preserves SPA fallback.

## Setup and commands

React 19, Tailwind v4, Vite 8/SWC, React Router; Cloudflare asset Worker in `worker.ts`, `wrangler.toml` and `dist/`; TypeScript 7 strict with unused/fallthrough checks; Bun (manifest 1.3.6; current CI 1.4.2), Biome, Vitest/jsdom. Layout: `src/components/ui/`, `src/lib/`, `src/models/`, `src/viewmodels/`, `src/pages/`.

Run from root; README recommends Node 24+. Dev needs no accounts or secret variables.

```sh
bun install --frozen-lockfile
bun run dev
bun run typecheck
bun run lint
bun run build
bun run preview
bun run test
bun run test:coverage
bun run gate:l1-self-test
```

Run a focused file with `bun run test src/test/components/MatrixButton.test.tsx`. Mock animated text/rain to stable text in unit tests. Build emits `dist/`; it does not deploy.

## Testing and quality contract

Quality follows System1 v1.3.0 Native Mode (`nocoo/base-ci v2026.15`) in `.github/workflows/quality-slots.yml` and `.github/workflows/ci.yml`. Statuses: `enforced`, `planned`, `manual`, `N/A`.

| Slot              | Status   | Evidence                                                                               |
| ----------------- | -------- | -------------------------------------------------------------------------------------- |
| `S1` Types        | enforced | `bun run typecheck` (pre-commit + CI)                                                  |
| `S2` Lint         | enforced | `bun run lint` (`biome check --error-on-warnings`, pre-commit + CI)                    |
| `S3` Workflow     | enforced | SHA-pinned workflow action check in CI                                                 |
| `G1` Secrets      | enforced | `gitleaks` (`.gitleaks.toml`) in pre-commit + CI                                       |
| `G2` Dependencies | enforced | `osv-scanner` (`osv-scanner.toml`, `bun.lock`) in pre-push + CI                        |
| `B1` Build        | enforced | `bun run build` in CI                                                                  |
| `L1` Unit         | enforced | `bun run test:coverage` (95/95/95/95) + `bun run gate:l1-self-test` in pre-commit + CI |
| `L2` Runtime      | N/A      | Static assets deployed to Cloudflare Worker                                            |
| `L3` Integration  | planned  | No local Worker HTTP E2E wired yet                                                     |
| `L4` E2E          | planned  | No Playwright E2E suite yet                                                            |
| `P1` Package      | N/A      | Private repo, not published to npm                                                     |
| `Z1` Gate         | enforced | `quality / Z1: Gate` required status check on `main`                                   |

### L1 pre-commit gate (index snapshot)

Hook chain: **Husky → gitleaks (staged) → index snapshot →** `bun run typecheck` **→** `bun run lint` (`biome check --error-on-warnings`) **→** `bun run test:coverage` (Vitest thresholds 95/95/95/95 on selected UI + `src/lib`) **→** require non-empty `coverage/lcov.info`. Overrides: `L1_PRECOMMIT_TIMEOUT_SEC` (default 30).

`bun run gate:l1-self-test` builds a temporary worktree, runs the same hook per scenario, and cleans up. Negative probes must exit non-zero; a clean index must pass.

| Scenario                                                       | Expected |
| -------------------------------------------------------------- | -------- |
| Healthy index snapshot                                         | accept   |
| Unit test failure                                              | reject   |
| Coverage threshold miss (any metric, including functions-only) | reject   |
| Biome error                                                    | reject   |
| Biome warning only (`@ts-ignore`; TypeScript still clean)      | reject   |
| Type error                                                     | reject   |
| `it.only` / `it.skip`                                          | reject   |
| Staged bad / worktree good (index-only gate)                   | reject   |
| `L1_PRECOMMIT_TIMEOUT_SEC` exceeded                            | reject   |
| Missing `bun` or `gitleaks`                                    | reject   |
| Tests pass but coverage artifact missing                       | reject   |

Pre-push attempts working-tree build, coverage, lint and OSV, but build or coverage failure can be masked by a successful OSV scan because the commands are in an `&&` chain. Target: check-only unified L1 on the index <30s, stdin pushed-ref L2/G2 <3min. Never bypass commit/branch-push hooks or silence a coverage regression.

## Resources and isolation

| Purpose      | Resource                                       | Policy                                            |
| ------------ | ---------------------------------------------- | ------------------------------------------------- |
| Dev          | `http://localhost:7013`                        | Synthetic application state                       |
| Production   | `https://matrix.hexly.ai`, Worker plus `dist/` | Health/assets only; no business database/auth API |
| Future L2/L3 | Test-owned local Worker/browser profile        | Separate port and per-run state required          |

Do not introduce real financial/health accounts as fixtures. A static Cloudflare asset deployment does not justify remote test Workers or databases.

## Operations / release

For an authorized release synchronize package version/CHANGELOG, verify, create an immutable annotated `vX.Y.Z` tag and GitHub Release per the [release contract](docs/01-design-contract.md). `wrangler.toml` defines the asset Worker. Verify homepage/assets, SPA routes and `/api/live` JSON version with no-store caching.

## Retrospective

Record narratives in [Retrospective.md](Retrospective.md). Keep recurring project rules brief; cross-project lessons go to global rules/nmem, deterministic checks to hooks/tests.

- Preserve the template's strict visual constraints while adding component coverage; do not lower the four-metric contract to match momentary coverage dips.
