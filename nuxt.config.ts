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
});
