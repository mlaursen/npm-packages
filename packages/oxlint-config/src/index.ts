import { base } from "./base.js";
import { frontend } from "./frontend.js";
import { jest } from "./jest.js";
import { jestDom } from "./jestDom.js";
import { jsxA11y } from "./jsxA11y.js";
import { mui } from "./mui.js";
import { nextjs } from "./nextjs.js";
import { react } from "./react.js";
import { recommended } from "./recommended.js";
import { testingLibrary } from "./testingLibrary.js";
import { typescript } from "./typescript.js";
import { unicorn } from "./unicorn.js";
import { vitest } from "./vitest.js";

export * from "./constants.js";

export const configs = {
  base,
  jest,
  jestDom,
  jsxA11y,
  mui,
  nextjs,
  react,
  testingLibrary,
  typescript,
  unicorn,
  vitest,
  frontend,

  recommended,
} as const;
