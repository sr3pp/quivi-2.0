import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const linkSchema = z
  .object({
    label: z.string(),
    to: z.string()
  })
  .partial();

const imageSchema = z
  .object({
    src: z.string(),
    alt: z.string(),
    title: z.string(),
    primary: z.string(),
    secondary: z.string(),
  })
  .partial();

const carouselSliceSchema = z.object({
  type: z.literal("carrousel"),
  autoplay: z.boolean().optional(),
  arrows: z.boolean().optional(),
  dots: z.boolean().optional(),
}).passthrough();

const welcomeSliceSchema = z.object({
  type: z.literal("welcome"),
  title: z.string().optional(),
  description: z.string().optional(),
  images: imageSchema.optional(),
}).passthrough();

const showcaseSliceSchema = z.object({
  type: z.literal("showcase"),
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .optional(),
}).passthrough();

const brandsSliceSchema = z.object({
  type: z.literal("brand-list"),
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        image: imageSchema.optional(),
      }),
    )
    .optional(),
}).passthrough();

const headingSliceSchema = z.object({
  type: z.literal("heading"),
  tag: z.string().optional(),
  text: z.string().optional(),
  highlight: z.string().optional(),
}).passthrough();

const brandDetailSliceSchema = z.object({
  type: z.literal("brand-detail"),
  title: z.string().optional(),
  description: z.string().optional(),
  backgroundImage: z.string().optional(),
  mainImage: imageSchema.optional(),
  cta: linkSchema.optional(),
}).passthrough();

const textDividerSliceSchema = z
  .object({
    type: z.literal("text-divider"),
    title: z.string().optional(),
    text: z.string().optional(),
    variant: z.enum(["default", "with-image"]).optional(),
    image: imageSchema.optional(),
    link: linkSchema.optional(),
  })
  .passthrough();

const heroWithColumnsSliceSchema = z
  .object({
    type: z.literal("hero-with-columns"),
    title: z.string().optional(),
    description: z.string().optional(),
    image: imageSchema.optional(),
    columns: z
      .array(
        z
          .object({
            icon: z.string().optional(),
            title: z.string().optional(),
            content: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough();

const siteSliceSchema = z.discriminatedUnion("type", [
  carouselSliceSchema,
  welcomeSliceSchema,
  showcaseSliceSchema,
  brandsSliceSchema,
  headingSliceSchema,
  brandDetailSliceSchema,
  textDividerSliceSchema,
  heroWithColumnsSliceSchema,
]);

const pageSchema = z
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
    slices: z.array(siteSliceSchema).optional(),

    // Legacy aliases kept for backward compatibility with old frontmatter.
    carrousel: carouselSliceSchema.omit({ type: true }).optional(),
    welcome: welcomeSliceSchema.omit({ type: true }).optional(),
    showcase: showcaseSliceSchema.omit({ type: true }).optional(),
    brands: brandsSliceSchema.omit({ type: true }).optional(),
    heading: headingSliceSchema.omit({ type: true }).optional(),
    brandDetail: brandDetailSliceSchema.omit({ type: true }).optional(),
  })
  .passthrough();

const configSchema = z
  .object({
    content: z.unknown().optional(),
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
      schema: z.object({
        title: z.string().optional(),
        items: z.array(
          z.object({
            label: z.string().optional(),
            url: z.string().optional(),
          }),
        ).optional(),
      }).passthrough(),
    }),
  },
});
