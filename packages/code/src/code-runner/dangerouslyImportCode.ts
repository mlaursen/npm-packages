import { dangerouslyEvalCode } from "./dangerouslyEvalCode.js";
import { transformCode } from "./transformCode.js";
import type { RunnableCodeScope } from "./types.js";

/**
 * @see https://github.com/nihgwu/react-runner/tree/974ebc932db7b7c7d59f1b50a79aed705efbf75a
 *
 * This is pretty much everything from there except using the new JSX transform
 * and I wanted to understand why things were implemented the way they were
 */
export function dangerouslyImportCode(
  code: string,
  scope?: RunnableCodeScope
): RunnableCodeScope {
  const exports: RunnableCodeScope = {};
  dangerouslyEvalCode({
    code: transformCode(code),
    scope: { ...scope, exports },
  });

  return exports;
}
