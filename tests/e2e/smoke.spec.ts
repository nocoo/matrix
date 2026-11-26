import { expect, type Page, test } from "@playwright/test";

function trackErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on("pageerror", (err) => {
		errors.push(`pageerror: ${err.message}`);
	});
	page.on("console", (msg) => {
		if (msg.type() === "error") {
			errors.push(`console.error: ${msg.text()}`);
		}
	});
	return errors;
}

test.describe("Matrix smoke", () => {
	test("renders dashboard and serves health endpoint without errors", async ({ page, request }) => {
		const errors = trackErrors(page);

		await page.goto("/");

		await expect(page.getByText("[MATRIX]").first()).toBeVisible();
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(/dashboard/i);
		await expect(page.getByText("SYSTEM STATUS")).toBeVisible();
		await expect(page.getByText("CHRONOMETER")).toBeVisible();
		await expect(page.getByText("SIGNAL MONITOR")).toBeVisible();

		const liveRes = await request.get("/api/live");
		expect(liveRes.ok()).toBe(true);
		const liveJson = await liveRes.json();
		expect(liveJson).toMatchObject({ status: "ok", name: "matrix" });

		expect(errors).toEqual([]);
	});

	test("supports sidebar navigation, Cmd+K search dialog, and language toggle", async ({
		page,
	}) => {
		const errors = trackErrors(page);

		await page.goto("/");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(/dashboard/i);

		await page.locator("aside nav").getByRole("button", { name: "Palette" }).click();
		await expect(page).toHaveURL(/\/palette$/);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(/palette/i);
		await expect(page.getByText("MATRIX THEME COLORS")).toBeVisible();

		await page
			.locator("aside")
			.getByRole("button", { name: /search/i })
			.click();
		const searchInput = page.getByPlaceholder("search pages...");
		await expect(searchInput).toBeVisible();
		await searchInput.fill("Settings");
		await page.getByRole("button", { name: "Settings" }).last().click();

		await expect(page).toHaveURL(/\/settings$/);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(/settings/i);
		await expect(page.getByText("GENERAL")).toBeVisible();

		const langButton = page.getByRole("button", { name: "Switch to Chinese" });
		await langButton.click();
		await expect(page.getByRole("button", { name: "切换为英文" })).toBeVisible();
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("设置");

		expect(errors).toEqual([]);
	});
});
