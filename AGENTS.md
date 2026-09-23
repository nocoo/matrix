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
```

Run a focused file with `bun run test src/test/components/MatrixButton.test.tsx`. Mock animated text/rain to stable text in unit tests. Build emits `dist/`; it does not deploy.

## Testing and quality contract

6DQ keeps its name with unified L1, L2/L3, G2 and D1; the owner merged former G1 into L1 on 2026-09-21. Statuses: `enforced`, `planned`, `manual`, `N/A`. No skipped/focused tests; unified L1 requires statements/branches/functions/lines each ≥95% plus strict types and check-only lint with zero errors/warnings across shipped code.

| Piece | Requirement and current reality | Status | Evidence |
| --- | --- | --- | --- |
| L1 | Four-metric ≥95% on reusable components/utilities and Worker logic plus strict types/lint across shipped code | planned | Vitest/pre-push/CI enforce 95/94/95/95 on selected UI files; Worker coverage is missing. Pre-commit runs two type configs that omit `worker.ts` and CI typecheck is disabled, so strict static subchecks are incomplete; gates run on the working tree |
| L2 | Real HTTP for `/api/live`, asset headers and SPA routing in local Worker | planned | No HTTP suite; production Worker serves health/assets but has no business database |
| L3 | Real component, navigation and responsive UI workflows | planned | No browser runner; template status does not make UI flows inapplicable |
| G2 | Required gitleaks and OSV | enforced | Staged secrets in pre-commit; Bun lock OSV pre-push and shared CI |
| D1 | Synthetic fixture data independent of daily-dev/user state | planned | Unit DOM state exists; browser/HTTP per-run harness and cleanup guards missing |
| Build | Vite SPA output | enforced | Pre-push and CI preparation |
| Docs | Preserve design contract and measured checks | manual | Review linked document and CHANGELOG |

Current hooks check the working tree; pre-commit runs types/lint/unit/staged secrets, pre-push build/coverage/lint/OSV. Target: check-only unified L1 on the index <30s, stdin pushed-ref L2/G2 <3min. Never bypass commit/branch-push hooks or silence a coverage regression.

## Resources and isolation

| Purpose | Resource | Policy |
| --- | --- | --- |
| Dev | `http://localhost:7013` | Synthetic application state |
| Production | `https://matrix.hexly.ai`, Worker plus `dist/` | Health/assets only; no business database/auth API |
| Future L2/L3 | Test-owned local Worker/browser profile | Separate port and per-run state required |

Do not introduce real financial/health accounts as fixtures. A static Cloudflare asset deployment does not justify remote test Workers or databases.

## Operations / release

For an authorized release synchronize package version/CHANGELOG, verify, create an immutable annotated `vX.Y.Z` tag and GitHub Release per the [release contract](docs/01-design-contract.md). `wrangler.toml` defines the asset Worker. Verify homepage/assets, SPA routes and `/api/live` JSON version with no-store caching.

## Retrospective

Record narratives in [Retrospective.md](Retrospective.md). Keep recurring project rules brief; cross-project lessons go to global rules/nmem, deterministic checks to hooks/tests.

- Preserve the template's strict visual constraints while adding component coverage; do not lower the four-metric contract to match the current 94% branch gate.
