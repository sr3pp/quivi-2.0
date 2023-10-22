import { describe, test, expect } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";
describe("Product endpoint", async () => {
  await setup({});

  test("There must be Highlighted products", async () => {
    const products = await $fetch("/api/product/hightlights");
    expect(products.length).toBeGreaterThan(0);
  });
});
