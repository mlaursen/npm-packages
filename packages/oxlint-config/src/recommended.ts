import type { OxlintConfig } from "oxlint";

import { base } from "./base.js";
import { scripts } from "./scripts.js";
import { typescript } from "./typescript.js";
import { unicorn } from "./unicorn.js";

export const recommended: OxlintConfig = {
  extends: [base, typescript, scripts, unicorn],
};
