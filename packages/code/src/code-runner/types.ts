import type { ReactElement } from "react";

export type GlobalCodeScope = Record<string, unknown>;
export type LocalCodeScope = Record<string, unknown>;

/**
 * Everything defined in this object will be part of the global scope. If there
 * are specific imports for the file, they should be added under `imports`
 *
 * i.e.
 * ```ts
 * import Prism from "prismjs";
 * import * as someLibrary from "some-library";
 *
 * const scope: RunnableCodeScope = {
 *   Prism,
 *   import: {
 *     "some-library": someLibrary,
 *   },
 * };
 *
 * // no Prism import required since it's in the global scope.
 * const code = `
 * import { part } from "some-library";
 *
 * Prism.highlightElement(document.getElementById('root'));
 *
 * part();
 * `;
 * ```
 */
export type RunnableCodeScope = GlobalCodeScope & { import?: LocalCodeScope };

export interface DangerouslyEvalCodeOptions {
  code: string;
  scope?: RunnableCodeScope;
}

export interface DangerouslyRunCodeOptions extends DangerouslyEvalCodeOptions {
  onRendered?: (error: Error | null) => void;
}

export interface DangerouslyRunCodeResult {
  error: Error | null;
  element: ReactElement | null;
}
