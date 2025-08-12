import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      watch: false,
      globals: true,
      environment: "jsdom",
      setupFiles: ["node_modules/@testing-library/jest-dom/vitest"],
      server: {
        deps: {
          inline: ["@solidjs/testing-library", "@solidjs/router"],
        },
      },
    },
  })
);
