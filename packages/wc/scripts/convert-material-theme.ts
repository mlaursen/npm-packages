/* eslint-disable unicorn/no-process-exit */
import { enableLogger, generateFile, logFailure } from "@mlaursen/node-utils";
import { kebabCase } from "@mlaursen/utils";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { z } from "zod";

enableLogger();

const SchemeTokensSchema = z.object({
  // same order as scss
  primary: z.string(),
  primaryContainer: z.string(),
  onPrimary: z.string(),
  onPrimaryContainer: z.string(),
  inversePrimary: z.string(),
  secondary: z.string(),
  secondaryContainer: z.string(),
  onSecondary: z.string(),
  onSecondaryContainer: z.string(),
  tertiary: z.string(),
  tertiaryContainer: z.string(),
  onTertiary: z.string(),
  onTertiaryContainer: z.string(),
  surface: z.string(),
  surfaceDim: z.string(),
  surfaceBright: z.string(),
  surfaceContainerLowest: z.string(),
  surfaceContainerLow: z.string(),
  surfaceContainer: z.string(),
  surfaceContainerHigh: z.string(),
  surfaceContainerHighest: z.string(),
  surfaceVariant: z.string(),
  onSurface: z.string(),
  onSurfaceVariant: z.string(),
  inverseSurface: z.string(),
  inverseOnSurface: z.string(),
  background: z.string(),
  onBackground: z.string(),
  error: z.string(),
  errorContainer: z.string(),
  onError: z.string(),
  onErrorContainer: z.string(),
  outline: z.string(),
  outlineVariant: z.string(),
  shadow: z.string(),
  surfaceTint: z.string(),
  scrim: z.string(),
});
const PalettesSchema = z.object({
  "0": z.string(),
  "5": z.string(),
  "10": z.string(),
  "15": z.string(),
  "20": z.string(),
  "25": z.string(),
  "30": z.string(),
  "35": z.string(),
  "40": z.string(),
  "50": z.string(),
  "60": z.string(),
  "70": z.string(),
  "80": z.string(),
  "90": z.string(),
  "95": z.string(),
  "98": z.string(),
  "99": z.string(),
  "100": z.string(),
});

const MaterialThemeSchema = z.object({
  description: z.string(),
  seed: z.string(),
  coreColors: z.object({
    primary: z.string(),
  }),
  extendedColors: z.array(z.string()),
  schemes: z.object({
    light: SchemeTokensSchema,
    "light-medium-contrast": SchemeTokensSchema,
    "light-high-contrast": SchemeTokensSchema,
    dark: SchemeTokensSchema,
    "dark-medium-contrast": SchemeTokensSchema,
    "dark-high-contrast": SchemeTokensSchema,
  }),
  palettes: z.object({
    primary: PalettesSchema,
    secondary: PalettesSchema,
    tertiary: PalettesSchema,
    neutral: PalettesSchema,
    "neutral-variant": PalettesSchema,
  }),
});

const ContrastSchema = z.enum(["normal", "medium", "high"]);

type SchemeTokens = z.infer<typeof SchemeTokensSchema>;
type MaterialTheme = z.infer<typeof MaterialThemeSchema>;
type Contrast = z.infer<typeof ContrastSchema>;

function getSchemeKey(
  mode: "light" | "dark",
  contrast: Contrast,
): keyof MaterialTheme["schemes"] {
  if (contrast === "normal") {
    return mode;
  }

  return `${mode}-${contrast}-contrast`;
}

function convertSchemeToScssMap(scheme: SchemeTokens): string {
  let output = "(";
  for (const [name, value] of Object.entries(scheme)) {
    output += `${kebabCase(name)}: ${value},\n`;
  }

  return output + ")";
}

let contrast: Contrast = "normal";
const contrastIndex = process.argv.indexOf("--contrast");
if (contrastIndex > 0) {
  const parsed = ContrastSchema.safeParse(process.argv[contrastIndex + 1]);
  if (!parsed.success) {
    logFailure("Invalid contrast:");
    logFailure(parsed.error.message);
    process.exit(1);
  }

  contrast = parsed.data;
}

if (!existsSync("material-theme.json")) {
  logFailure("Missing material-theme.json!");
  process.exit(1);
}

const rawJson = await readFile("material-theme.json", "utf8");
const parsed = MaterialThemeSchema.safeParse(JSON.parse(rawJson));
if (!parsed.success) {
  logFailure("Invalid Material theme JSON:");
  logFailure(parsed.error.message);
  process.exit(1);
}

const { schemes } = parsed.data;
const lightScheme = schemes[getSchemeKey("light", contrast)];
const darkScheme = schemes[getSchemeKey("dark", contrast)];

await generateFile({
  contents: `
@use "@mlaursen/wc" as *;

@include configure(
  $palette: (
    light-theme: ${convertSchemeToScssMap(lightScheme)},
    dark-theme: ${convertSchemeToScssMap(darkScheme)},
  ),
);

`,
  filePath: "material-theme.scss",
  format: true,
});
