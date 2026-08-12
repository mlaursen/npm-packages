import { defineConfig } from "oxlint";

import { configs } from "./dist/index.js";

export default defineConfig(configs.recommended);
