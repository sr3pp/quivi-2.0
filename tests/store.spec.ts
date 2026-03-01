import { expect, test } from "@playwright/test";

test("store page title render", async ({ page }) => {
  await page.goto("/tienda");
  await page.waitForSelector(".test");
  await expect(page.locator(".test")).toContainText("Encuentra lo que necesitas.");
});
