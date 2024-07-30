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
        //@ts-ignore
        testMail: process.env.EMAIL_TEST_MAIL,
      },
      openpay: {
        url:
          process.env.OPENPAY_PRODUCTION === "true"
            ? process.env.OPENPAY_URL
            : process.env.OPENPAY_DEV_URL,
        barcodeUrl:
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
      paypal: {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.PAYPAL_URL
            : process.env.PAYPAL_DEV_URL,
        client:
          process.env.NODE_ENV === "production"
            ? process.env.PAYPAL_CLIENT
            : process.env.PAYPAL_DEV_CLIENT,
        secret:
          process.env.NODE_ENV === "production"
            ? process.env.PAYPAL_SECRET
            : process.env.PAYPAL_DEV_SECRET,
      },
      vps: process.env.IS_VPS === "true",
    },
  },
  devtools: { enabled: true },
  components: {
    global: true,
    dirs: ["~/components"],
  },
  modules: [
    "sr-content-2",
    "@vueuse/nuxt",
    "nuxt-swiper",
    "@nuxtjs/eslint-module",
    // "@productdevbook/chatwoot",
  ],
  css: [
    "@/assets/scss/main.scss",
    "@/assets/scss/transitions/index.scss",
    "@/assets/scss/components.scss",
    "normalize.css/normalize.css",
  ],
  nitro: {
    plugins: ["@/server/DB.ts"],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ` 
            @import "sr-content-2/assets/scss/utilities/index.scss";
            @import "sr-content-2/assets/scss/main.scss";
            @import "@/assets/fonts/index.scss";
            @import "@/assets/scss/tokens.scss";`,
        },
      },
    },
  },
  //@ts-ignore
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
