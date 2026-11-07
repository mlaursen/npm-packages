import { titleCase } from "@mlaursen/utils";

import {
  MATERIAL_SYMBOL_FILLS,
  MATERIAL_SYMBOL_GRADES,
  MATERIAL_SYMBOL_OPTICAL_SIZES,
  MATERIAL_SYMBOL_WEIGHTS,
  type MaterialSymbolFamily,
  type MaterialSymbolFill,
  type MaterialSymbolGrade,
  type MaterialSymbolOpticalSize,
  type MaterialSymbolWeight,
} from "./constants.js";
import type {
  MaterialSymbolCustomProperties,
  MaterialSymbolCustomPropertyName,
} from "./types.js";

export function isMaterialSymbolFill(
  value: unknown,
): value is MaterialSymbolFill {
  return MATERIAL_SYMBOL_FILLS.includes(value as MaterialSymbolFill);
}

export function isMaterialSymbolWeight(
  value: unknown,
): value is MaterialSymbolWeight {
  return MATERIAL_SYMBOL_WEIGHTS.includes(value as MaterialSymbolWeight);
}

export function isMaterialSymbolGrade(
  value: unknown,
): value is MaterialSymbolGrade {
  return MATERIAL_SYMBOL_GRADES.includes(value as MaterialSymbolGrade);
}

export function isMaterialSymbolOpticalSize(
  value: unknown,
): value is MaterialSymbolOpticalSize {
  return MATERIAL_SYMBOL_OPTICAL_SIZES.includes(
    value as MaterialSymbolOpticalSize,
  );
}

export function isMaterialSymbolFamily(
  value: unknown,
): value is MaterialSymbolFamily {
  return value === "outlined" || value === "rounded" || value === "sharp";
}

export interface ToggleMaterialSymbolVarOptions<
  N extends MaterialSymbolCustomPropertyName,
> {
  root: HTMLElement;
  name: N;
  value: MaterialSymbolCustomProperties[N] | null;
}

/**
 * This is used to toggle the material symbol custom property value.
 *
 * @example
```ts
toggleMaterialSymbolVar({
  root: document.documentElement,
  name: "opsz",
  value: 48,
});

toggleMaterialSymbolVar({
  root: document.querySelector("#child-scope")
  name: "opsz",
  value: 20,
});

// remove
toggleMaterialSymbolVar({
  root: document.querySelector("#child-scope")
  name: "opsz",
  value: null,
});
```
 */
export function toggleMaterialSymbolVar<
  N extends MaterialSymbolCustomPropertyName,
>(options: ToggleMaterialSymbolVarOptions<N>): void {
  const { name, root, value } = options;

  let varValue: string | undefined | null;
  if (name === "family" && typeof value === "string" && value) {
    varValue = `Material Symbols ${titleCase(value)}`;
  } else if (
    name !== "family" &&
    (typeof value === "number" || (typeof value === "string" && value))
  ) {
    varValue = `${value}`;
  }

  const varName = `--mwc-icon-symbol-${name}`;
  if (value === undefined || value === null) {
    root.style.removeProperty(varName);
  } else {
    root.style.setProperty(varName, `${varValue}`);
  }
}
