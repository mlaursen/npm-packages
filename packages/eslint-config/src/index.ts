import { type Linter } from "eslint";
import { base } from "./base.js";
import { frontend, frontendTypeChecking } from "./frontend.js";
import { gitignore } from "./gitignore.js";
import { jsxA11y } from "./jsxA11y.js";
import { react } from "./react.js";
import { scripts } from "./scripts.js";
import { testingLibraryDom, testingLibraryReact } from "./testing-library.js";
import {
  jest,
  jestDom,
  type TestFramework,
  testing,
  vitest,
} from "./testing.js";
import { typescript, typescriptTypeChecking } from "./typescript.js";

export * from "./constants.js";
export { gitignore };

interface EslintConfigs {
  base: readonly Linter.Config[];
  jest: readonly Linter.Config[];
  jestDom: readonly Linter.Config[];
  react: (reactCompiler?: boolean) => readonly Linter.Config[];
  typescript: readonly Linter.Config[];
  typescriptTypeChecking: (tsconfigRootDir: string) => readonly Linter.Config[];
  testingLibraryDom: readonly Linter.Config[];
  testingLibraryReact: readonly Linter.Config[];

  frontend: (
    testFramework: TestFramework,
    reactCompiler?: boolean
  ) => readonly Linter.Config[];
  frontendTypeChecking: (
    tsconfigRootDir: string,
    testFramework: TestFramework,
    reactCompiler?: boolean
  ) => readonly Linter.Config[];

  scripts: readonly Linter.Config[];
  jsxA11y: readonly Linter.Config[];
  testing: (framework: TestFramework) => readonly Linter.Config[];
  vitest: readonly Linter.Config[];
}

export const configs: Readonly<EslintConfigs> = {
  base,
  jest,
  jestDom,
  react,
  typescript,
  typescriptTypeChecking,
  testingLibraryDom,
  testingLibraryReact,
  frontend,
  frontendTypeChecking,
  scripts,
  jsxA11y,
  testing,
  vitest,
};
