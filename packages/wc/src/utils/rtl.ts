import { getVarName } from "./tokens.js";

const varName = getVarName("rtl.mult");

export interface ToggleRtlOptions {
  dir?: "rtl" | "ltr";

  /**
   * @defaultValue `document.documentElement`
   */
  element?: HTMLElement | null;

  /**
   * @defaultValue `true`
   */
  translateVar?: boolean;
}

/**
 * This util is used to toggle or set the `dir` for an element
 * (generally the `document.documentElement`). This also sets a
 * custom property for reversing positions when in right-to-left.
 */
export function toggleRtl(options: ToggleRtlOptions = {}): void {
  const {
    dir,
    element = typeof document === "undefined" ? null : document.documentElement,
    translateVar = true,
  } = options;

  if (!element) {
    return;
  }

  let nextDir = dir;
  if (!nextDir) {
    nextDir = element.dir === "rtl" ? "ltr" : "rtl";
  }

  element.dir = nextDir;
  if (translateVar) {
    if (nextDir === "rtl") {
      element.style.setProperty(varName, "-1");
    } else {
      element.style.removeProperty(varName);
    }
  }
}

/**
 * This is used to automatically inverse a horizontal position in RTL mode.
 */
export function calcRtlTranslate(value: string): string {
  return `calc(${value} * var(${varName}, 1))`;
}
