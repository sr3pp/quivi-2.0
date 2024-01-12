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
          additionalData: `@import "sr-content-2/assets/scss/utilities/index.scss"; 
            @import "sr-content-2/assets/scss/main.scss";
            @import "@/assets/fonts/index.scss";
            @import "@/assets/scss/tokens.scss";`,
        },
      },
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
