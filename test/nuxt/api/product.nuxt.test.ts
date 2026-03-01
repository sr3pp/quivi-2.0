import { describe, expect, test } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils/e2e";

await setup({ port: 3711 });

describe("Product endpoint", () => {
  test("There must be Highlighted products", async () => {
    const products = await $fetch("/api/product/hightlights", {
      baseURL: "http://127.0.0.1:3711",
      method: "POST",
      body: { codes: [] },
    });
    expect(Array.isArray(products)).toBe(true);
  });
});
