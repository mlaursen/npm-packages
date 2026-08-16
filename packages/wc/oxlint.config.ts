import { createConfig } from "@mlaursen/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig(
  createConfig({
    overrides: {
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
    },
  }),
);
