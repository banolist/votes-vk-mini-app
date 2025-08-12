/// <reference types="vitest/config" />
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import path from "path";

export default defineConfig({
  plugins: [
    Icons({ compiler: "solid", jsx: "preact", autoInstall: true }),
    solidPlugin(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  },
  build: {
    // target: "esnext",
  },
  resolve: {
    conditions: ["development", "browser"],
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // exclude: ["@iconify-icon", "@id/~icons", "@id/~icons/mdi"],
  },
  // test: {
  //   environment: "jsdom",
  //   globals: true,
  //   transformMode: { web: [/\.[jt]sx?$/] },
  //   deps: {
  //     // позволяет Vite самому резолвить зависимости без node‑loader
  //     registerNodeLoader: false,
  //     // чтобы Kobalte/Solid‑store не резолвились в разные (SSR) сборки
  //     inline: ["@kobalte/core", "solid-js", "solid-js/store"],
  //   },
  // },
});
