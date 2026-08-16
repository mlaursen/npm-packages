import { base } from "./base.js";
import { frontend } from "./frontend.js";
import { jest } from "./jest.js";
import { jestDom } from "./jestDom.js";
import { jsxA11y } from "./jsxA11y.js";
import { mui } from "./mui.js";
import { nextjs } from "./nextjs.js";
import { react } from "./react.js";
import { testingLibrary } from "./testingLibrary.js";
import { typescript } from "./typescript.js";
import { unicorn } from "./unicorn.js";
import { vitest } from "./vitest.js";

export * from "./constants.js";
export * from "./createConfig.js";

export interface OxlintConfigs {
  base: typeof base;
  jest: typeof jest;
  jestDom: typeof jestDom;
  jsxA11y: typeof jsxA11y;
  mui: typeof mui;
  nextjs: typeof nextjs;
  react: typeof react;
  testingLibrary: typeof testingLibrary;
  typescript: typeof typescript;
  unicorn: typeof unicorn;
  vitest: typeof vitest;
  frontend: typeof frontend;
}

export const configs: Readonly<OxlintConfigs> = {
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
};
