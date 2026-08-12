import { configs } from "@mlaursen/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [configs.recommended],
});
