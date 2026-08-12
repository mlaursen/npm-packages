import type { OxlintConfig } from "oxlint";

import { jestDom } from "./jestDom.js";
import { jsxA11y } from "./jsxA11y.js";
import { mui } from "./mui.js";
import { react } from "./react.js";
import { testingLibrary } from "./testingLibrary.js";

export const frontend: OxlintConfig = {
  extends: [react, jestDom, jsxA11y, mui, testingLibrary],
};
