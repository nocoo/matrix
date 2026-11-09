# Retrospective

## 2026-10-04 — Remove obsolete dependency advisory exceptions

Fresh dependency discovery found ten current advisories in Miniflare's Undici 7.29.0 even though the root already used Undici 8.11.0. Updating the requested root to 8.11.2 and Wrangler to 4.145.0 naturally selects Miniflare's patched Undici 7.29.1 without a major override; the release CLI pin stays aligned. An isolated lockfile scan with no vulnerability exceptions confirmed zero findings. Remove all nine obsolete advisory ignores instead of retaining development-dependency waivers. Existing UI branch coverage and Worker/CI enforcement gaps remain documented; dependency validation does not certify the entire 6DQ contract.
