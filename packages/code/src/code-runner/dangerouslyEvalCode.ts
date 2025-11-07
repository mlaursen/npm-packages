import React from "react";
import * as jsxRuntime from "react/jsx-runtime";

import { createRequire } from "./createRequire.js";
import type { DangerouslyEvalCodeOptions, RunnableCodeScope } from "./types.js";

/**
 * @see https://github.com/nihgwu/react-runner/tree/974ebc932db7b7c7d59f1b50a79aed705efbf75a
 *
 * This is pretty much everything from there except using the new JSX transform
 * and I wanted to understand why things were implemented the way they were
 */
export function dangerouslyEvalCode(
  options: DangerouslyEvalCodeOptions & { scope: RunnableCodeScope }
): void {
  const { code, getDynamicModule } = options;
  const { default: _, import: imports = {}, ...scope } = options.scope;

  const functionScope: RunnableCodeScope = {
    require: createRequire({
      imports: {
        ...imports,
        react: React,
        "react/jsx-runtime": jsxRuntime,
      },
      getDynamicModule,
    }),
    React,
    ...scope,
  };

  const parameterNames = Object.keys(functionScope);
  const parameters = parameterNames.map((key) => functionScope[key]);

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
  // So this is a "safer" version of `eval` that generates and runs a function by:
  // - creating a function with the provided code and providing all the locally
  //   scoped variables that are required for the code to run. These are the
  //   `...parameterNames` that are provided before the code.
  // - once the function has been created, execute it and provide all the
  //   values for the parameter names.
  new Function(...parameterNames, code)(...parameters);
}
