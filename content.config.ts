import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const linkSchema = z
  .object({
    label: z.string(),
    to: z.string()
  })
  .partial();

const satOptionSchema = z
  .object({
    name: z.string(),
    value: z.string(),
  })
  .passthrough();

const businessSchema = z
  .object({
    address: z.object({
      street: z.string(),
      number: z.string(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      zip: z.string(),
    }),
    bank_accounts: z.array(
      z
        .object({
          account_number: z.string(),
          CLABE: z.string().optional(),
          bank_name: z.string(),
        })
        .passthrough(),
    ),
    social: z.array(
      z
        .object({
          label: z.string(),
          url: z.string(),
          icon: z.string().optional(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const mainBrandsSchema = z
  .object({
    brands: z.array(
      z.object({
          name: z.string(),
          logo: z.object({
            src: z.string(),
            alt: z.string(),
          }),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const comerciosSchema = z
  .object({
    content: z.array(
      z
        .object({
          name: z.string(),
          logo: z.string(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const contactSchema = z
  .object({
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    whatsapp: z.string().optional(),
    shchedule: z.string().optional(),
    schedule: z.string().optional(),
  })
  .passthrough();

const distribuidoresSchema = z
  .object({
    distribuidores: z.array(
      z
        .object({
          id: z.number(),
          name: z.string(),
          logo: z.string(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const estadosSchema = z.record(z.string(), z.array(z.string()));

const faqsSchema = z
  .object({
    faqs: z.array(
      z
        .object({
          question: z.string(),
          answer: z.string(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const promotionsSchema = z
  .object({
    promotions: z.array(
      z
        .object({
          name: z.string(),
          code: z.string(),
          category: z.string(),
          status: z.boolean(),
          percent: z.number().optional(),
          options: z.array(z.number()).optional(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

const shippingSchema = z
  .object({
    limite: z.union([z.number(), z.string()]).optional(),
    costo: z.union([z.number(), z.string()]).optional(),
    clave: z.string().optional(),
  })
  .passthrough();

const shippingConfigSchema = z
  .object({
    shipping: shippingSchema,
  })
  .passthrough();

const satSchema = z
  .object({
    usos: z.array(satOptionSchema),
    regimenes: z.array(satOptionSchema),
  })
  .passthrough();

const termsSchema = z
  .object({
    title: z.string(),
    fecha: z.string(),
    sections: z
      .array(
        z
          .object({
            orden: z.union([z.string(), z.number()]).optional(),
            title: z.string(),
            content: z.string(),
          })
          .passthrough(),
      )
      .default([]),
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
    configBusiness: defineCollection({
      type: "data",
      source: "config/business.json",
      schema: businessSchema,
    }),
    configMainBrands: defineCollection({
      type: "data",
      source: "config/main-brands.json",
      schema: mainBrandsSchema,
    }),
    configComercios: defineCollection({
      type: "data",
      source: "config/comercios.json",
      schema: comerciosSchema,
    }),
    configContact: defineCollection({
      type: "data",
      source: "config/contact.json",
      schema: contactSchema,
    }),
    configDistribuidores: defineCollection({
      type: "data",
      source: "config/distribuidores.json",
      schema: distribuidoresSchema,
    }),
    configEstados: defineCollection({
      type: "data",
      source: "config/estados.json",
      schema: estadosSchema,
    }),
    configFaqs: defineCollection({
      type: "data",
      source: "config/faqs.json",
      schema: faqsSchema,
    }),
    configPromotions: defineCollection({
      type: "data",
      source: "config/promotions.json",
      schema: promotionsSchema,
    }),
    configSat: defineCollection({
      type: "data",
      source: "config/sat.json",
      schema: satSchema,
    }),
    configShipping: defineCollection({
      type: "data",
      source: "config/shipping.json",
      schema: shippingConfigSchema,
    }),
    configTerms: defineCollection({
      type: "data",
      source: "config/terms.json",
      schema: termsSchema,
    }),
    downloads: defineCollection({
      type: "data",
      source: "downloads/**/*.json",
      schema: downloadSchema,
    }),
  },
});
