import { transform } from "sucrase";

/**
 * @internal
 */
export function transformCode(code: string): string {
  return transform(code, {
    transforms: ["jsx", "typescript", "imports"],
    production: true,
    jsxRuntime: "automatic",
  }).code.substring(13); // remove leading `"use strict";`
}
