# Matrix — Project Intelligence

## Project Identity
- **Type**: Template site / UI kit showcase
- **Stack**: React 19 + Tailwind CSS v4 + TypeScript 5.9 + Vite 7 + Bun
- **Architecture**: MVVM (Model → ViewModel → Page)
- **Theme**: Cyberpunk / Matrix green-on-black, maximalist (极繁主义)

## Testing Strategy
This is a **template site**, not a production application. Testing strategy reflects that:

- **DO test**: UI components (`src/components/ui/`) and utility functions (`src/lib/`). These are the template's core reusable value — the component library and shared utilities.
- **DO NOT test**: Data models (`src/models/`), viewmodels (`src/viewmodels/`), pages (`src/pages/`), or route smoke tests. These are template scaffolding, not shipped logic.
- **No global coverage threshold**. Coverage is enforced only for `src/components/ui/` and `src/lib/` at 90%.
- Pre-commit hook runs `vitest run`. Pre-push runs `vitest run && eslint .`.

## Strict Mode Policy
- TypeScript: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`
- ESLint: zero errors, zero warnings. All unused vars must be prefixed with `_`.
- No `any` types unless absolutely unavoidable (and documented with `// eslint-disable-next-line` + reason).

## Design Constraints
- **No rounded corners** on any rectangular UI element. Only `rounded-full` on true circular elements (dots, spinners, circular avatars).
- **No grayscale hint colors** — all placeholder/hint/muted text uses green-shade Matrix colors.
- **No light mode** — single dark theme only.
- **No cross-color mixing** — themed dialogs stay mono-color (red stays all-red, etc.).
- **No native `<select>`** — use `MatrixSelect` everywhere.
- Sidebar background: `bg.jpg` at `opacity-[0.07]`, `backgroundSize: "240px auto"`, `backgroundRepeat: "repeat"`.

## Component Library Notes
- `MatrixButton` uses `forwardRef`. Sizes: `"default" | "header" | "small"` (NOT `"sm"`).
- `MatrixSelect` / `FloatingPortal` use `createPortal` to `document.body` with `getBoundingClientRect` positioning.
- When mocking animated components in tests (ScrambleText, DecodingText, TypewriterText, MatrixRain), mock them to render static text.
- Slider thumbs: `border-radius: 0` for square thumbs. Two variants: `.matrix-slider` (green) and `.matrix-slider-warning` (yellow).
- Toggle switches: track `w-9 h-5`, knob `w-3 h-3`.
- Radio buttons are square (not circles).
- Spinners are square (no `rounded-full`).

## Tailwind v4
- No `tailwind.config.ts` — uses `@tailwindcss/vite` plugin with `@theme {}` directive in `index.css`.
- Colors: `matrix-primary`, `matrix-bright`, `matrix-muted`, `matrix-dim`, `matrix-ghost`, `matrix-panel`, `matrix-panel-strong`, `matrix-dark`, `matrix-bg`.

## Version Management

### Single Source of Truth

The **canonical version** lives in `package.json` → `"version"`. All other
consumers derive from it at build time:

| Consumer | Mechanism |
|---|---|
| Sidebar badge (`v1.0.0`) | `__APP_VERSION__` global, injected via `vite.config.ts` → `define` |
| MatrixShell footer | `__APP_VERSION__` global |
| `/api/live` endpoint | Vite dev-server plugin reads `package.json` at request time |
| `vitest.config.ts` | Same `define` pattern for test environment |
| TypeScript | Declared in `src/vite-env.d.ts` as `declare const __APP_VERSION__: string` |

**Never hardcode a version string anywhere.** Always read from `package.json`.

### Versioning Rules (SemVer)

- **MAJOR** — breaking changes to public API, routes, or data models
- **MINOR** — new features, pages, or components (backward-compatible)
- **PATCH** — bug fixes, styling tweaks, dependency bumps

### Release Checklist

1. **Bump version** in `package.json`
2. **Update `CHANGELOG.md`** — add a new `## [x.y.z] - YYYY-MM-DD` section
3. **Run full verification**: `bunx eslint . && bun run build && bunx vitest run`
4. **Commit**: `chore: release vX.Y.Z`
5. **Tag**: `git tag -a vX.Y.Z -m "vX.Y.Z"`
6. **Push**: `git push && git push --tags`
7. **GitHub Release**: `gh release create vX.Y.Z --title "vX.Y.Z" --notes-from-tag`

## Retrospective
(Record mistakes and lessons learned here)
