import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  root: import.meta.dirname,
  plugins: [],
  test: {
    // I do not like having tests in the same folders as the rest of the files
    include: ["**/__tests__/*.{ts,tsx,js,jsx}"],
    coverage: {
      include: ["src/**/*.{ts,tsx,js.jsx}"],
    },
  },
});
