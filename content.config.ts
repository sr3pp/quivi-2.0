import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const linkSchema = z
  .object({
    label: z.string(),
    to: z.string()
  })
  .partial();

const configSchema = z
  .object({
    content: z.unknown().optional(),
  })
  .passthrough();

const downloadItemSchema = z
  .object({
    label: z.string().optional(),
    url: z.string(),
  })
  .passthrough();

const downloadSchema = z
  .object({
    label: z.string(),
    items: z.array(downloadItemSchema).default([]),
  })
  .passthrough();

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: "page",
      source: {
        include: "pages/**/*.md",
        prefix: "/"
      },
      schema: z.object({
        order: z.number().optional(),
      }),
    }),
    sliders: defineCollection({
      type: "data",
      source: "sliders/**/*.json",
      schema: z.object({
        autoplay: z.boolean().optional(),
        arrows: z.boolean().optional(),
        dots: z.boolean().optional(),
        slides: z.array(z.object({
          eyebrow: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          image: z.object({
            src: z.object({
              sm: z.string(),
              md: z.string(),
              lg: z.string(),
            }),
            alt: z.string()
          }),
          cta: linkSchema.optional(),
        }))
      })
    }),
    config: defineCollection({
      type: "data",
      source: "config/**/*.json",
      schema: configSchema,
    }),
    downloads: defineCollection({
      type: "data",
      source: "downloads/**/*.json",
      schema: downloadSchema,
    }),
  },
});
