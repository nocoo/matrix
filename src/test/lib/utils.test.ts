import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
	it("merges class names and resolves Tailwind conflicts", () => {
		expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
	});

	it("handles falsy and conditional values", () => {
		expect(cn("base", false && "hidden", undefined, null, "active")).toBe("base active");
	});
});
