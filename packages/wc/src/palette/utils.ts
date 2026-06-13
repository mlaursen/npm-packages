import { type CamelCase, kebabCase, upperFirst } from "@mlaursen/utils";

import {
  type MaterialContrast,
  MaterialContrastSchema,
  type MaterialSchemeTokens,
  type MaterialTheme,
  MaterialThemeSchema,
} from "./schemas.js";
import type {
  AllPaletteTokenName,
  ColorScheme,
  PaletteTokenName,
} from "./types.js";

function assertMaterialThemeKey(
  _name: string,
): asserts _name is CamelCase<PaletteTokenName> {}

export interface ConvertMaterialThemeToPropertiesOptions {
  schemes: MaterialTheme["schemes"];
  contrast: MaterialContrast;
  colorScheme: ColorScheme | null | false;
}

/**
 * This util can be used to update the palette to a new material theme:
 *
 * @example
 * ```ts
 * import { convertMaterialThemeToProperties, parseMaterialTheme } from "@mlaursen/wc/palette/utils";
 * import { spread } from "@open-wc/lit-helpers";
 *
 * import materialTheme from "./material-theme.json" with { type: "json" };
 *
 * const { schemes } = parseMaterialTheme(materialTheme)
 *
 * <mwc-configure-palette
 *   root
 *   ${spread(convertMaterialThemeToProperties({
 *     schemes,
 *     contrast: "normal",
 *     colorScheme: "light-dark",
 *   }))}
 * >
 * </mwc-configure-palette>
 * ```
 */
export function convertMaterialThemeToProperties(
  options: ConvertMaterialThemeToPropertiesOptions,
): Readonly<Record<AllPaletteTokenName, string | undefined>> {
  const { schemes, contrast, colorScheme } = options;

  let { light, dark } = schemes;
  if (contrast !== "normal") {
    light = schemes[`light-${contrast}-contrast`];
    dark = schemes[`dark-${contrast}-contrast`];
  }

  const isDark = colorScheme === "dark";
  const isLight = colorScheme === "light";
  const isLightDark = colorScheme === "light-dark" || colorScheme === "system";

  const properties: Partial<Record<AllPaletteTokenName, string | undefined>> =
    {};
  for (const [name, lightValue] of Object.entries(light)) {
    assertMaterialThemeKey(name);

    const darkValue = dark[name];
    const darkKey = `dark${upperFirst(name)}` as const;
    const lightKey = `light${upperFirst(name)}` as const;

    let staticValue: string | undefined;
    if (isLight) {
      staticValue = lightValue;
    } else if (isDark) {
      staticValue = darkValue;
    }

    properties[kebabCase(name)] = staticValue;
    properties[kebabCase(lightKey)] = isLightDark ? lightValue : undefined;
    properties[kebabCase(darkKey)] = isLightDark ? darkValue : undefined;
  }

  return properties as Record<AllPaletteTokenName, string | undefined>;
}

/**
 * This can be used to validate and parse a string or object to ensure it is a
 * valid material theme.
 *
 * @see https://m3.material.io/blog/material-theme-builder
 * @see https://material-foundation.github.io/material-theme-builder/
 *
 * @example
 * ```ts
 * import { parseMaterialTheme } from "@mlaursen/wc/palette/utils";
 *
 * import materialTheme from "./material-theme.json" with { type: "json" };
 *
 * // safely parsed and typed!
 * const { schemes } = parseMaterialTheme(materialTheme);
 * ```
 *
 * @see {@link convertMaterialSchemeToScssMap} for generating styles
 * @see {@link convertMaterialThemeToProperties} for updating the theme with
 * the `mwc-update-palette` component
 */
export function parseMaterialTheme(json: string | unknown): MaterialTheme {
  const parsed = MaterialThemeSchema.safeParse(
    typeof json === "string" ? JSON.parse(json) : json,
  );

  if (!parsed.success) {
    throw new Error(`Invalid Material Theme JSON:
${parsed.error.message}
`);
  }

  return parsed.data;
}

/**
 * This is probably more of an internal util, but it is able to validate that a
 * user-provided contrast value is correct.
 */
export function parseMaterialContrast(contrast: unknown): MaterialContrast {
  const parsed = MaterialContrastSchema.safeParse(contrast);
  if (!parsed.success) {
    throw new Error(`Invalid Material Contrast:
${parsed.error.message}
`);
  }

  return parsed.data;
}

/**
 * This is probably more of an internal thing, but this is used to help convert
 * a material theme scheme to a sass value.
 *
 * @see {@link convertMaterialSchemeToScssMap}
 */
export function getMaterialSchemeKey(
  mode: "light" | "dark",
  contrast: MaterialContrast = "normal",
): keyof MaterialTheme["schemes"] {
  if (contrast === "normal") {
    return mode;
  }

  return `${mode}-${contrast}-contrast`;
}

/**
 * This is probably more of an internal thing, but used to help generate a
 * palette:
 *
 * @example
 * ```ts
 * import { generateFile } from "@mlaursen/node-utils";
 * import {
 *   convertMaterialSchemeToScssMap,
 *   getMaterialSchemeKey,
 *   parseMaterialTheme
 * } from "@mlaursen/wc/palette/utils";
 *
 * import materialTheme from "./material-theme.json" with { type: "json" };
 *
 * const { schemes } = parseMaterialTheme(materialTheme);
 *
 * const lightTheme = schemes[getMaterialSchemeKey("light", "normal")];
 * const darkTheme = schemes[getMaterialSchemeKey("dark", "normal")];
 * await generateFile({
 *   contents: `
 * @use "@mlaursen/wc" as *;
 *
 * @include configure(
 *   $palette: (
 *     light-theme: ${convertMaterialSchemeToScssMap(lightScheme)},
 *     dark-theme: ${convertMaterialSchemeToScssMap(darkScheme)},
 *   ),
 * );
 * `,
 *   filePath: "material-theme.scss",
 *   format: true,
 * });
 * ```
 */
export function convertMaterialSchemeToScssMap(
  scheme: MaterialSchemeTokens,
): string {
  let output = "(";
  for (const [name, value] of Object.entries(scheme)) {
    output += `${kebabCase(name)}: ${value},\n`;
  }

  return output + ")";
}
