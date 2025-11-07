import { type ComponentType, type ReactElement, isValidElement } from "react";

import { dangerouslyEvalCode } from "./dangerouslyEvalCode.js";
import { transformCode } from "./transformCode.js";
import { tryAddingMissingExportDefault } from "./tryAddingMissingExportDefault.js";
import type { DangerouslyEvalCodeOptions, RunnableCodeScope } from "./types.js";

/**
 * You are most likely looking for the `useDangerousCodeRunner` hook instead.
 *
 * This function is used to take a raw code string and attempt to run it as a
 * React component. There are a few restrictions:
 *
 * 1. The code must have a default export
 * 2. All the dependencies must be provided using the {@link DangerouslyEvalCodeOptions.scope}
 * 3. References to `render` will not work through the global or local scope as it is used for this to work.
 *
 * @see https://github.com/nihgwu/react-runner/tree/974ebc932db7b7c7d59f1b50a79aed705efbf75a
 */
export function dangerouslyCreateElement(
  options: DangerouslyEvalCodeOptions
): ReactElement | null {
  const { code, scope } = options;
  if (!code.trim()) {
    return null;
  }

  const fileExports: RunnableCodeScope = {};
  const render = (value: unknown): void => {
    fileExports["default"] = value;
  };
  dangerouslyEvalCode({
    code: transformCode(tryAddingMissingExportDefault(code)),
    scope: { render, ...scope, exports: fileExports },
  });

  const result = fileExports["default"];
  if (isValidElement(result)) {
    return result;
  }

  if (typeof result === "function") {
    const Component = result as ComponentType;
    return <Component />;
  }

  if (typeof result === "string") {
    return <>{result}</>;
  }

  return null;
}
