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

export interface RequireDynamicModuleOptions {
  /**
   * This function can be used to dynamically determine imports for more
   * advanced dependencies like fake css modules. This is still a synchronous
   * callback so you can't dynamically import things to get it to work.
   *
   * If this returns `undefined`, the result will be ignored and the default
   * import behavior will continue where it must exist in the `imports`
   * LocalCodeScope.
   *
   * @defaultValue `tryRequiringCssModule`
   * @see {@link tryRequiringCssModule}
   */
  getDynamicModule?: (module: string) => unknown | undefined;
}

export interface CreateRequireOptions extends RequireDynamicModuleOptions {
  imports?: LocalCodeScope;
}

export interface DangerouslyEvalCodeOptions extends RequireDynamicModuleOptions {
  code: string;
  /** @see {@link RunnableCodeScope} */
  scope?: RunnableCodeScope;
}

export interface DangerouslyRunCodeRenderedOptions {
  onRendered?: (error: Error | null) => void;
}

export interface DangerouslyRunCodeOptions
  extends DangerouslyEvalCodeOptions, DangerouslyRunCodeRenderedOptions {}

export interface DangerouslyRunCodeResult {
  error: Error | null;
  element: ReactElement | null;
}
