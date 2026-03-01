import { defineConfig, defineProject } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    projects: [
      defineProject({
        test: {
          name: "unit",
          environment: "node",
          include: ["test/unit/**/*.test.ts", "test/unit/**/*.spec.ts"],
          exclude: ["tests/**"],
        },
      }),
      defineProject({
        test: {
          name: "nuxt",
          environment: "node",
          include: ["test/nuxt/api/**/*.nuxt.test.ts", "test/nuxt/pages/**/*.nuxt.test.ts"],
          exclude: ["tests/**"],
          fileParallelism: false,
          maxWorkers: 1,
          pool: "forks",
          poolOptions: {
            forks: {
              singleFork: true,
            },
          },
        },
      }),
    ],
  },
});
