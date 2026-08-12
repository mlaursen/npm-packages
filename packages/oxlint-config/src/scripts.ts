import type { OxlintConfig } from "oxlint";

export const scripts: OxlintConfig = {
  overrides: [
    {
      files: ["scripts/**"],
      rules: { "no-console": "off" },
    },
  ],
};
