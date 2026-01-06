import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: "page",
      source: "**/*.md",
      schema: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          carrousel: z
            .object({
              autoplay: z.boolean().optional(),
              arrows: z.boolean().optional(),
              dots: z.boolean().optional(),
            })
            .optional(),
            welcome: z.object({
              title: z.string().optional(),
              description: z.string().optional(),
              images: z.object({
                primary: z.string().optional(),
                secondary: z.string().optional(),
              }).optional(),
            }).optional(),
        })
        .passthrough(),
    }),
    config: defineCollection({
      type: "data",
      source: "_config/**/*.json",
      schema: z.any(),
    }),
  },
});
