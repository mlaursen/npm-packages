export const DEV_WARNING_PROD_ERROR =
  process.env["NODE_ENV"] === "production" ? "error" : "warn";

export const TS_FILES = ["**/*.{ts,tsx,mts,mtsx}"];

export const TEST_FILES = [
  "**/__tests__/**",
  "**/*.{spec,test}.{ts,tsx,mtsx,js,jsxm,mjsx}",
];

export const JSX_FILES = ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"];

export const VITE_MAIN_FILES = ["**/main.tsx", "**/main.jsx"];
