import type { Reporter, TestModule } from "vitest/node";

export default class SelectedRunReporter implements Reporter {
	onTestRunEnd(modules: readonly TestModule[]) {
		let skipped = 0;
		for (const mod of modules) {
			for (const test of mod.children.allTests()) {
				const state = test.result().state;
				const mode = test.options.mode;
				if (state === "skipped" || mode === "skip" || mode === "todo") skipped += 1;
			}
		}
		if (skipped > 0) throw new Error(`Vitest skipped ${skipped} tests`);
	}
}
