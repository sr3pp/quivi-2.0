import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: "data",
      source: "**/*.json",
      schema: z.any(),
    }),
    config: defineCollection({
      type: "data",
      source: "_config/**/*.json",
      schema: z.any(),
    }),
  },
});
