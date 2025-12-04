export const DEV_WARNING_PROD_ERROR =
  process.env.NODE_ENV === "production" ? "error" : "warn";

/**
 * This is a "temporary" workaround until autofixable rules can be disabled with
 * a config option because of the "autofix + format(+ save)?" behavior. It
 * should be something closer to `DEV_WARN_PROD_ERROR_AND_FIX`
 */
export const DEV_OFF_PROD_ERROR =
  process.env.NODE_ENV === "production" ? "error" : "off";

export const BASE_NAME = "@mlaursen/eslint-config";

export const TS_FILES = ["**/*.{ts,tsx,mts,mtsx}"];

export const TEST_FILES = [
  "**/__tests__/**",
  "**/*.{spec,test}.{ts,tsx,js,jsx}",
];

export const JSX_FILES = ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"];

export const VITE_MAIN_FILES = ["**/main.tsx"];
