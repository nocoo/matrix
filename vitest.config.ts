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
		allowOnly: false,
		passWithNoTests: false,
		reporters: ["default", "./src/test/selected-run.ts"],
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
				// Floors sit below actual coverage (97.6/95.2/99.7/99.4) so a small
				// regression trips the gate before it can mask a real drop.
				statements: 95,
				branches: 95,
				functions: 95,
				lines: 95,
			},
		},
	},
	resolve: {
		alias: { "@": path.resolve(__dirname, "./src") },
	},
});
