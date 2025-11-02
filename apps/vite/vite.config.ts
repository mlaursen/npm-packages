/// <reference types="vitest/config" />
import reactBabel from "@vitejs/plugin-react";
import reactSwc from "@vitejs/plugin-react-swc";
import { type Plugin, defineConfig } from "vite";
import tsconigPaths from "vite-tsconfig-paths";

import { materialSymbolPlugin } from "./materialSymbolPlugin";

let react: () => Plugin[];
if (process.env["REACT_COMPILER"] === "true") {
  react = () =>
    reactBabel({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    });
} else {
  react = () => reactSwc();
}

// https://vite.dev/config/
export default defineConfig({
  root: import.meta.dirname,
  // build: {
  //   minify: false,
  //   terserOptions: {
  //     // @ts-expect-error boop boop mcscoop
  //     compress: false,
  //     mangle: false,
  //   },
  // },
  plugins: [tsconigPaths(), react(), materialSymbolPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    // I do not like having tests in the same folders as the rest of the files
    include: ["**/__tests__/*.{ts,tsx,js,jsx}"],
    coverage: {
      include: ["src/**/*.{ts,tsx,js.jsx}"],
    },
  },
});
