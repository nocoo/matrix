# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
