import { describe, test, expect } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";
describe("Content endpoint", async () => {
  await setup({});

  test("Retrive the content navigation", async () => {
    const navigation = await $fetch("/api/content/navigation");
    expect(navigation.length).toBeGreaterThan(0);

    test("Check item structure", async () => {
      const item = navigation[0];
      expect(item.name).toBeDefined();
      expect(item.url).toBeDefined();
      expect(item.order).toBeDefined();
    });
  });
});
