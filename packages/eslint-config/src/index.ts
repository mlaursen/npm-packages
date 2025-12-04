import { base } from "./base.js";

import { jsxA11y } from "./jsxA11y.js";
import { react } from "./react.js";
import { recommended } from "./recommended.js";
import { recommendedFrontend } from "./recommendedFrontend.js";
import { scripts } from "./scripts.js";
import { testingLibraryDom, testingLibraryReact } from "./testing-library.js";
import { jest, jestDom, testing, vitest } from "./testing.js";
import { typescript } from "./typescript.js";
import { unicorn } from "./unicorn.js";

export * from "./constants.js";

interface EslintConfigs {
  recommended: typeof recommended;
  recommendedFrontend: typeof recommendedFrontend;

  base: typeof base;
  jest: typeof jest;
  jestDom: typeof jestDom;
  jsxA11y: typeof jsxA11y;
  react: typeof react;
  scripts: typeof scripts;
  testing: typeof testing;
  testingLibraryDom: typeof testingLibraryDom;
  testingLibraryReact: typeof testingLibraryReact;
  typescript: typeof typescript;
  unicorn: typeof unicorn;
  vitest: typeof vitest;
}

export const configs: Readonly<EslintConfigs> = {
  recommended,
  recommendedFrontend,

  base,
  jest,
  jestDom,
  react,
  typescript,
  testingLibraryDom,
  testingLibraryReact,
  scripts,
  jsxA11y,
  testing,
  vitest,
  unicorn,
};

export { gitignore } from "./gitignore.js";
