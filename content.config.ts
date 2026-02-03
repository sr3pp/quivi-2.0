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
          navigation: z
            .object({
              title: z.string().optional(),
              description: z.string().optional(),
            })
            .optional(),
          order: z.number().optional(),
          carrousel: z
            .object({
              autoplay: z.boolean().optional(),
              arrows: z.boolean().optional(),
              dots: z.boolean().optional(),
            })
            .optional(),
          welcome: z
            .object({
              title: z.string().optional(),
              description: z.string().optional(),
              images: z
                .object({
                  primary: z.string().optional(),
                  secondary: z.string().optional(),
                })
                .optional(),
            })
            .optional(),
          showcase: z
            .object({
              title: z.string().optional(),
              items: z
                .array(
                  z.object({
                    title: z.string().optional(),
                    image: z.string().optional(),
                  }),
                )
                .optional(),
            })
            .optional(),
          brands: z.object({
            title: z.string().optional(),
            items: z.array(
              z.object({
                image: z
                  .object({
                    src: z.string().optional(),
                    alt: z.string().optional(),
                  })
                  .optional(),
              }),
            ),
          }),
          heading: z
            .object({
              tag: z.string().optional(),
              text: z.string().optional(),
              highlight: z.string().optional(),
            })
            .optional(),
          brandDetail: z
            .object({
              title: z.string().optional(),
              description: z.string().optional(),
              backgroundImage: z.string().optional(),
              mainImage: z
                .object({
                  src: z.string().optional(),
                  alt: z.string().optional(),
                })
                .optional(),
              cta: z
                .object({
                  text: z.string().optional(),
                  link: z.string().optional(),
                })
                .optional(),
            })
            .optional(),
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
