import { describe, expect } from "vitest";
import { setup, createPage } from "@nuxt/test-utils";

describe("Store Page Render Test", async () => {
  await setup({});

  test("Title Render", async () => {
    const page = await createPage("/tienda");

    const text = await page.$(".sr-text");
    expect(await text?.innerText()).toContain("Tienda");
  });
});
