# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-07-16

### Fixed

- **Command palette autofocus**: `ControlsPage` Cmd+K palette lost `autoFocus`
  during the biome migration and had no ref/effect replacement, so opening the
  palette left focus on the trigger. Added a ref + effect gated on
  `vm.commandOpen`, mirroring the same fix already applied to `SearchDialog`.
- **ActivityHeatmap keyboard access**: the scroll region's `tabIndex={0}` was
  stripped by biome's unsafe pass, breaking WCAG 2.1.1 for users without a
  scroll wheel. Restored `tabIndex`, added an `onKeyDown` handler that maps
  Arrow / Page / Home / End to horizontal scroll, and added a `biome-ignore`
  for the intentional `noNoninteractiveTabindex` exemption.
- **Avatar fallback stuck after URL swap**: `IdentityCard`'s reset effect had
  its dep array emptied by an autofix; feeding a new avatar URL after a
  failure kept showing the fallback `MatrixAvatar`. Restored `[safeAvatarUrl]`
  with an explicit `biome-ignore` so the intent survives future rewrites.
- **Vitest thresholds**: earlier release dropped all four metrics to 94, which
  masked 3.6–5.7 pp of headroom on statements/functions/lines. Tightened back
  to 95 across the board except `branches` (94, sitting ~1 pp under the actual
  95.2).

### Added

- Regression tests covering the three fixes above:
  * `DashboardLayout.test.tsx`: Cmd+K focuses the search input.
  * `VibeComponents.test.tsx`: swapping avatar URL after an image error
    remounts the `<img>` instead of sticking on the fallback.
  * `DataVizComponents.test.tsx`: ActivityHeatmap exposes `role="region"` +
    `tabIndex="0"` and survives Arrow/Page/Home/End/Tab keys without throwing.
  * `ControlsPage.command-palette.test.tsx`: the palette input receives focus
    when `vm.commandOpen` flips true.

### Changed

- `README.md`: hooks table + feature bullet now reflect actual pre-commit
  (typecheck + lint + test + gitleaks) and pre-push (build + coverage + lint
  + osv-scanner) gates instead of the truncated `test` / `test + lint`
  description; dropped stale test counts and non-existent `models/` /
  `viewmodels/` / `pages/` test subdirectories from the tree diagram and
  Test Structure table; tech-stack table now advertises TypeScript 7 / Vite 8;
  "Run tests" snippets use `bun run test` instead of a bare `vitest run`.
- `CLAUDE.md`: hooks description synced with the actual scripts; release-
  checklist verification uses `bun run test`.
- `osv-scanner.toml`: dropped ignored-vuln entries referencing the deleted
  ESLint toolchain.
- `react-i18next` 17.0.9 → 17.0.10 (dependabot, merged from `main`).

## [1.2.1] - 2026-07-15

### Changed

- **Toolchain**: Replaced ESLint + `typescript-eslint` with [Biome](https://biomejs.dev) 2.5.3
  as the single tool for lint, format and import sorting. `eslint.config.js` is deleted;
  `biome.json` at repo root holds all rules (`recommended` preset plus tightened
  `noUnusedImports`, `noUnusedVariables`, `noNonNullAssertion`, `useConst`,
  `noDangerouslySetInnerHtml`). `src/test/**` overrides relax `noNonNullAssertion` and
  `noNonNullAssertedOptionalChain` — the only rule relaxations, all others enforced.
- **TypeScript**: Bumped `typescript` 6.0 → 7.0.2.
- **Coverage buffer**: Vitest thresholds moved from 95 → 94 across statements/branches/
  functions/lines so the ≥0.5 pp buffer over actual coverage (currently 97.6/95.2/99.7/99.4)
  survives small future regressions without spurious flips.

### Removed

- `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
  `typescript-eslint`, `globals` — full ESLint toolchain.

### Fixed

- `src/main.tsx`: guarded lookup of `#root` (removes `noNonNullAssertion` violation).
- Extracted the `scan-x` keyframe animation from an inline `dangerouslySetInnerHTML`
  `<style>` block in `DataVizComponents.tsx` to `src/index.css` (removes
  `noDangerouslySetInnerHtml` violation).
- Every raw `<button>` in `src/` now carries an explicit `type` attribute (a11y).
- Decorative SVGs (avatars, sparklines, trend charts, GitHub icon) now use
  `aria-hidden="true"` + `focusable="false"` so `noSvgWithoutTitle` is satisfied
  without polluting the accessibility tree with generic titles.
- `<label>` elements in `VibeComponents` and `OverlaysPage` now wrap their controls
  (`noLabelWithoutControl` a11y).
- Six `forEach((cb) => cb(t*50))` callbacks in `MatrixExtras.test.tsx` were rewritten
  with block bodies (`useIterableCallbackReturn`).
- Restored the missing `location.pathname` dep on the mobile-sidebar-close effect in
  `DashboardLayout.tsx` — a prior autofix had emptied the deps array, silently breaking
  the mobile-drawer route-change test.
- Applied Biome import ordering, tab-indent formatting, and `node:` protocol prefix
  across the codebase (~90 files).

## [1.1.1] - 2026-06-11

### Changed

- **Dependency upgrades** — bumped 9 packages across the toolchain
  - `vite` 8.0.10 → 8.0.16
  - `eslint-plugin-react-refresh` 0.4.26 → 0.5.2
  - `lucide-react` 0.563.0 → 1.17.0 (extracted `Github` icon to local component since brand icons were removed in v1)
  - `eslint` 9.39.4 → 10.4.1, `@eslint/js` 9.39.4 → 10.0.1, `eslint-plugin-react-hooks` 5.2.0 → 7.1.1
  - `typescript` 5.9.3 → 6.0.3 (removed deprecated `baseUrl` from tsconfigs)
  - `i18next` 25.10.10 → 26.3.1, `react-i18next` 16.6.6 → 17.0.8
  - `tailwind-merge` 2.6.1 → 3.6.0
  - `@types/node` 22 → 25.9.3
- Dropped the `brace-expansion` override (CVE GHSA-jxxr-4gwj-5jf2 is now fixed in the transitive resolution)

### Fixed

- Fixed malformed CHANGELOG entry for 1.1.0 (literal `n` characters instead of newlines)

## [1.1.0] - 2026-05-01

### Changed

- Minor version bump to validate CI/CD pipeline

## [1.0.0] - 2026-02-23

### Added

- **i18n internationalization** — full English and Chinese language support via `i18next` + `react-i18next`
  - Language toggle button in the dashboard header (terminal-styled, cycles EN / 中)
  - Translation files: `src/i18n/locales/en.json`, `src/i18n/locales/zh.json`
  - Browser language auto-detection via `i18next-browser-languagedetector`
- **Version management** — single source of truth from `package.json`
  - `__APP_VERSION__` global injected via Vite `define` (available in both app and tests)
  - `/api/live` dev-server endpoint returning `{ status, version }`
  - Version badge displayed in sidebar and MatrixShell footer
  - TypeScript declaration in `src/vite-env.d.ts`
- **Internationalized UI framework text** across all pages and shell components:
  - DashboardLayout (nav groups, search dialog, skip link, aria-labels)
  - MatrixShell (header, footer, system status)
  - BootScreen (loading text, skip prompt)
  - SettingsPage, HelpPage, NotFound, LoginPage, StaticPage, InteractionShowcasePage
