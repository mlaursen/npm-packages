import { createConfig } from "@mlaursen/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig(
  createConfig({
    overrides: {
      ignorePatterns: ["cli.js"],
    },
  }),
);
