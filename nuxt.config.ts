// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    [
      "@nuxtjs/eslint-module",
      {
        fix: true,
        cache: false,
        include: ["/**/*.{js,jsx,ts,tsx,vue}"],
        extends: ["plugin:prettier/recommended"],
        plugins: ["prettier"],
        rules: {
          "prettier/prettier": "error",
        },
      },
    ],
  ],
  css: ["@/assets/scss/main.scss"],
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
});
