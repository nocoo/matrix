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
		environment: "node",
		globals: true,
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules/**", "dist/**", "tests/e2e/**"],
		allowOnly: false,
		passWithNoTests: false,
		reporters: ["default", "./src/test/selected-run.ts"],
		coverage: {
			provider: "v8",
			// AST-aware remapping is built into vitest v4+; no opt-in needed.
			reporter: ["text", "text-summary", "lcov"],
			include: ["src/lib/**/*.{ts,tsx}", "src/models/**/*.ts", "src/components/ui/matrix-utils.ts"],
			exclude: [
				// Test setup and helpers are not production code.
				"src/test/**",
				// Type-only declaration files contain no executable code.
				"src/**/*.d.ts",
				// Type-only model definitions and static showcase mock fixtures.
				"src/models/types.ts",
				"src/models/component-showcase.ts",
				"src/models/controls.ts",
				// UI components are excluded from L1 coverage.
				"src/components/ui/**/*.tsx",
				// Barrel re-exports have no logic to cover.
				"src/components/ui/index.ts",
			],
			thresholds: {
				statements: 90,
				branches: 85,
				functions: 90,
				lines: 90,
			},
		},
	},
	resolve: {
		alias: { "@": path.resolve(__dirname, "./src") },
	},
});
