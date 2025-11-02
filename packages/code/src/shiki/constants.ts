import type { BundledTheme } from "shiki";

export const DEFAULT_SHIKI_THEMES = {
  light: "solarized-light",
  dark: "solarized-dark",
} satisfies Record<string, BundledTheme>;

export const DEFAULT_SHIKI_COLOR = "light";
