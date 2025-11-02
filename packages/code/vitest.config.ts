// can't use @vitejs/plugin-react-swc since the coverage lines are incorrect
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  root: resolve(import.meta.dirname),
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "vitest.setup.ts",
    // I do not like having tests in the same folders as the rest of the files
    include: ["**/src/**/__tests__/*.{ts,tsx}"],
    coverage: {
      include: ["src/**/*"],
      exclude: ["**/{index,types,testSetup}.ts", "**/__snapshots__/**"],
    },
  },
});
