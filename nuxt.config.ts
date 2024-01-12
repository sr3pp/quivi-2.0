// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  runtimeConfig: {
    public: {
      sae: {
        url: process.env.SAE_URL,
      },
      jwt: {
        secret: process.env.JWT_SECRET,
      },
      mongo: {
        url: process.env.MONGO_URL,
      },
      email: {
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      openpay: {
        url:
          process.env.OPENPAY_PRODUCTION === "true"
            ? process.env.OPENPAY_URL
            : process.env.OPENPAY_DEV_URL,
        barcode_url:
          process.env.OPENPAY_PRODUCTION === "true"
            ? process.env.OPENPAY_BARCODE_URL
            : process.env.OPENPAY_BARCODE_DEV_URL,
        key:
          process.env.OPENPAY_PRODUCTION === "true"
            ? process.env.OPENPAY_KEY
            : process.env.OPENPAY_DEV_KEY,
        merchantId:
          process.env.OPENPAY_PRODUCTION === "true"
            ? process.env.OPENPAY_MERCHANT_ID
            : process.env.OPENPAY_DEV_MERCHANT_ID,
        production: process.env.OPENPAY_PRODUCTION === "true",
      },
    },
  },
  devtools: { enabled: true },
  components: {
    global: true,
    dirs: ["~/components"],
  },
  modules: [
    "sr-content",
    "@nuxtjs/eslint-module",
    "nuxt-swiper",
    "@vueuse/nuxt",
    "@productdevbook/chatwoot",
  ],
  css: [
    "@/assets/scss/main.scss",
    "@/assets/scss/transitions/index.scss",
    "@/assets/scss/components.scss",
  ],
  nitro: {
    plugins: ["@/server/DB.ts"],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "sr-content/assets/scss/utilities/index.scss";
            @import "@/assets/fonts/index.scss";
            @import "@/assets/scss/tokens.scss";
          `,
        },
      },
    },
  },
  build: {
    rollupOptions: {
      external: ["sr-content"],
    },
  },
  chatwoot: {
    init: {
      websiteToken: process.env.CHATWOOT_WEBSITE_TOKEN,
    },
    settings: {
      locale: "es",
      position: "right",
      launcherTitle: "Ayuda",
      // ... and more settings
    },
    // If this is loaded you can make it true, https://github.com/nuxt-modules/partytown
    partytown: false,
  },
});
