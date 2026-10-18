/**
 * This probably won't be used much, but a small wrapper to create a
 * `light-dark()` value for css
 *
 * @example Main Example
```ts
const value = lightDark(getVar("palette.light-primary"), getVar("palette.dark-primary"));
value === "light-dark(var(--mwc-light-primary), var(--mwc-dark-primary))" // true
```
 *
 * @param light - the light value to use
 * @param dark - the dark value to use
 * @returns the light-dark statement
 */
export function lightDark(light: string, dark: string): string {
  return `light-dark(${light}, ${dark})`;
}

/**
 * Helper to get a `--mwc-` prefixed custom property. Automatically converts
 * dotted names to match the Sass behavior.
 *
 * @example Main Example
```ts
getVarName("palette.primary") === "--mwc-primary" // true
getVarName("divider.size") === "--mwc-divider-size" // true
```
 *
 * @param name - The token name
 * @returns the custom property name
 */
export function getVarName(name: string): string {
  // NOTE: This needs to stay in sync with `./_tokens.scss`
  const hyphenatedName = name
    .replaceAll(".", "-")
    .replace(/^((palette|transition)-)/, "");

  return `--mwc-${hyphenatedName}`;
}

/**
 * This util is used to get a `var()` string.
 *
 * @example Main Example
```ts
getVar("palette.primary") === "var(--mwc-primary)" // true
getVar("divider.size", "1rem") === "var(--mwc-divider-size, 1rem)" // true
```
 *
 * @param name - the var name to lookup. i.e. `"palette.primary"`
 * @param fallback an optional fallback value
 * @returns the var statement
 */
export function getVar(name: string, fallback: string | number = ""): string {
  let suffix = "";
  if (fallback !== "") {
    suffix = `, ${fallback}`;
  }

  return `var(${getVarName(name)}${suffix})`;
}
