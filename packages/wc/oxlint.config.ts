import { configs } from "@mlaursen/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [configs.recommended],
  rules: {
    "@typescript-eslint/no-empty-object-type": [
      "error",
      {
        allowInterfaces: "never",
        allowObjectTypes: "never",
        allowWithName: ".+Overrides$",
      },
    ],
  },
});
