import React from "react";
import * as jsxRuntime from "react/jsx-runtime";

import { createFakeCssModules } from "../fake-css-modules.js";
import type { CreateRequireOptions, LocalCodeScope } from "./types.js";

/**
 * This will create fake css modules for imports that end with `.module.s?css`
 * for the {@link createRequire} function.
 */
export function tryRequiringCssModule(module: string): unknown {
  const [_, fileName] = module.match(/([^/\\]+?)\.module\.s?css$/) ?? [];
  if (!fileName) {
    return;
  }

  return createFakeCssModules(fileName);
}

/**
 * `sucrase` will transform all import statements into `require` to work in the
 * browser. So to be able to import code in other files or packages, the require
 * statement should be mocked to lookup valid imports from above.
 *
 * If a package isn't defined in the `imports` scope, there will be a runtime
 * error about the module cannot be found.
 *
 * TODO: Re-verify 🔽
 * This unfortunately doesn't work well with RSC since functions can't be passed
 * to client components.
 */
export function createRequire(options: CreateRequireOptions) {
  const { getDynamicModule = tryRequiringCssModule } = options;
  const imports: LocalCodeScope = {
    react: React,
    "react/jsx-runtime": jsxRuntime,
    ...options.imports,
  };

  return function require(module: string): unknown {
    const result = getDynamicModule(module);
    if (result !== undefined) {
      return result;
    }

    if (!Object.prototype.hasOwnProperty.call(imports, module)) {
      throw new Error(`Module not found: ${module}`);
    }

    return imports[module];
  };
}
