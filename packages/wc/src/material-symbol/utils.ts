import { titleCase } from "@mlaursen/utils";

import type {
  MaterialSymbolCustomProperties,
  MaterialSymbolCustomPropertyName,
  MaterialSymbolFamily,
  MaterialSymbolFill,
  MaterialSymbolGrade,
  MaterialSymbolOpticalSize,
  MaterialSymbolWeight,
} from "./types.js";

export function isMaterialSymbolFill(
  value: unknown,
): value is MaterialSymbolFill {
  return value === 0 || value === 1;
}

export function isMaterialSymbolWeight(
  value: unknown,
): value is MaterialSymbolWeight {
  return (
    value === 100 ||
    value === 200 ||
    value === 300 ||
    value === 400 ||
    value === 500 ||
    value === 600 ||
    value === 700
  );
}

export function isMaterialSymbolGrade(
  value: unknown,
): value is MaterialSymbolGrade {
  return value === -25 || value === 0 || value === 200;
}

export function isMaterialSymbolOpticalSize(
  value: unknown,
): value is MaterialSymbolOpticalSize {
  return value === 20 || value === 24 || value === 40 || value === 48;
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
