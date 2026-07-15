import { readFileSync } from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		coverage: {
			provider: "v8",
			// AST-aware remapping is built into vitest v4+; no opt-in needed.
			reporter: ["text", "text-summary", "lcov"],
			include: ["src/components/ui/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
			exclude: [
				// Test setup and helpers are not production code.
				"src/test/**",
				// Type-only declaration files contain no executable code.
				"src/**/*.d.ts",
				// Barrel re-exports have no logic to cover.
				"src/components/ui/index.ts",
			],
			thresholds: {
				// Floors sit ~0.5–1 pp below actual coverage so a small regression trips
				// the gate before it can mask a real drop. Only `branches` is relaxed —
				// the other three run high enough that keeping them at 95 leaves plenty
				// of headroom (97.6/99.7/99.4 for statements/functions/lines).
				statements: 95,
				branches: 94,
				functions: 95,
				lines: 95,
			},
		},
	},
	resolve: {
		alias: { "@": path.resolve(__dirname, "./src") },
	},
});
