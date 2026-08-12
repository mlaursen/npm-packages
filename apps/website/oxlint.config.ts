import { configs } from "@mlaursen/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [configs.recommended],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        fixStyle: "separate-type-imports",
      },
    ],
  },
});
