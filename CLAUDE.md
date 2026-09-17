# Matrix

Green-on-black React component and dashboard-template showcase with synthetic data.
Profile: ts-worker-web (static SPA).
Direction: [README.md](README.md), [design contract](docs/01-design-contract.md).

## Sources of Truth

This file is the contract; hooks, CI and config enforce it. Raise enforcement to match requirements, never lower the contract to a weaker threshold. Frameworks must not rewrite this file.

| Fact | Where |
| --- | --- |
| Human docs | [README.md](README.md), [design contract](docs/01-design-contract.md) |
| Version | Root `package.json`; Vite `__APP_VERSION__`, mirrored in Vitest config |
| Enforcement | `.husky/`, `.github/workflows/ci.yml`, `vitest.config.ts` |
| Environment | No backend credentials needed |
| Accidents | [Retrospective.md](Retrospective.md) |

## Project Invariants

- This is a static template using mock data. Login, finance, health and task pages do not authenticate users or operate real accounts.
- Preserve MVVM: models and ViewModels stay independent of Views/DOM. Reusable value is concentrated in `src/components/ui/` and `src/lib/`; test real logic introduced elsewhere rather than hiding it as scaffolding.
- Keep maximalist Matrix green-on-black, one dark theme, no grayscale hint text or cross-color dialog mixing. Rectangles, radios, spinners and slider thumbs stay square; only true circles use `rounded-full`.
- Use `MatrixSelect`, never native select. Preserve portal positioning, button `forwardRef` and `default/header/small` sizes; design specifics live in the linked contract.
- Tailwind v4 uses `@tailwindcss/vite` and `@theme` in `src/index.css`; no `tailwind.config.ts`. Preserve named Matrix tokens and sidebar background treatment.
- Never hardcode a displayed version. Production static routing needs SPA fallback; `/api/live` is a Vite dev-server helper, not a production API.

## Stack / Layout

| Component | Choice |
| --- | --- |
| UI | React 19, Tailwind v4, Vite 8/SWC, React Router |
| Language | TypeScript 7 strict with unused/fallthrough checks |
| Tooling | Bun (manifest 1.3.6; current CI 1.4.2), Biome, Vitest/jsdom |
| Layout | `src/components/ui/`, `src/lib/`, `src/models/`, `src/viewmodels/`, `src/pages/` |

## Commands

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
```

Run a focused file with `bun run test src/test/components/MatrixButton.test.tsx`. Mock animated text/rain to stable text in unit tests. Build emits `dist/`; it does not deploy.

## Verification

6DQ = L1/L2/L3 + G1/G2 + D1. Status: `enforced`, `planned`, `manual`, `N/A`. No skipped/focused tests; L1 statements/branches/functions/lines each ≥95%.

| Piece | Requirement and current reality | Status | Evidence |
| --- | --- | --- | --- |
| L1 | Four-metric ≥95% on reusable components/utilities and any new real logic | planned | Vitest/pre-push/CI currently enforce 95/94/95/95; branch floor is below contract |
| L2 | Real HTTP for the dev `/api/live` helper and preview routing | planned | No HTTP suite; no production business API exists |
| L3 | Real component, navigation and responsive UI workflows | planned | No browser runner; template status does not make UI flows inapplicable |
| G1 | Strict typecheck + Biome, zero errors/warnings | enforced | Pre-commit types/lint; CI's typecheck input is currently disabled |
| G2 | Required gitleaks and OSV | enforced | Staged secrets in pre-commit; Bun lock OSV pre-push and shared CI |
| D1 | Synthetic fixture data independent of daily-dev/user state | planned | Unit DOM state exists; browser/HTTP per-run harness and cleanup guards missing |
| Build | Vite SPA output | enforced | Pre-push and CI preparation |
| Docs | Preserve design contract and measured checks | manual | Review linked document and CHANGELOG |

Current hooks check the working tree; pre-commit runs types/lint/unit/staged secrets, pre-push build/coverage/lint/OSV. Target: check-only index L1/G1 <30s, stdin pushed-ref L2/G2 <3min. Never bypass commit/branch-push hooks or silence a coverage regression.

## Resources / Isolation

| Purpose | Resource | Policy |
| --- | --- | --- |
| Dev | `http://localhost:7013` | Synthetic application state |
| Production | `https://matrix.hexly.ai`, static `dist/` | No business database/auth API |
| Future L2/L3 | Test-owned preview server/browser profile | Separate port and per-run state required |

Do not introduce real financial/health accounts as fixtures. A static Cloudflare asset deployment does not justify remote test Workers or databases.

## Operations / Release

For an authorized release synchronize package version/CHANGELOG, verify, create an immutable annotated `vX.Y.Z` tag and GitHub Release per [release contract](docs/01-design-contract.md). `wrangler.toml` defines static hosting. Verify the deployed homepage/assets and SPA routes; production `/api/live` is not implemented.

## Retrospective

Record narratives in [Retrospective.md](Retrospective.md). Keep recurring project rules brief; cross-project lessons go to global rules/nmem, deterministic checks to hooks/tests.

- Preserve the template's strict visual constraints while adding component coverage; do not lower the four-metric contract to match the current 94% branch gate.
