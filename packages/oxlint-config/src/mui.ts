import type { OxlintConfig } from "oxlint";

export const mui: OxlintConfig = {
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            regex: "^@mui/(?!(x-|utils))[^/]+$",
          },
        ],
      },
    ],
  },
};
