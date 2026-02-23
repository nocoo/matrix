# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
