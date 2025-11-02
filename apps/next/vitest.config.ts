import react from "@vitejs/plugin-react";
import tsconigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    tsconigPaths(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
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
