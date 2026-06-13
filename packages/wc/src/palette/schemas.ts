import { z } from "zod";

export const MaterialSchemeTokensSchema = z.object({
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
const MaterialPalettesSchema = z.object({
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

export const MaterialThemeSchema = z.object({
  description: z.string(),
  seed: z.string(),
  coreColors: z.object({
    primary: z.string(),
  }),
  extendedColors: z.array(z.string()),
  schemes: z.object({
    light: MaterialSchemeTokensSchema,
    "light-medium-contrast": MaterialSchemeTokensSchema,
    "light-high-contrast": MaterialSchemeTokensSchema,
    dark: MaterialSchemeTokensSchema,
    "dark-medium-contrast": MaterialSchemeTokensSchema,
    "dark-high-contrast": MaterialSchemeTokensSchema,
  }),
  palettes: z.object({
    primary: MaterialPalettesSchema,
    secondary: MaterialPalettesSchema,
    tertiary: MaterialPalettesSchema,
    neutral: MaterialPalettesSchema,
    "neutral-variant": MaterialPalettesSchema,
  }),
});

export const MaterialContrastSchema = z.enum(["normal", "medium", "high"]);

export type MaterialSchemeTokens = z.infer<typeof MaterialSchemeTokensSchema>;
export type MaterialTheme = z.infer<typeof MaterialThemeSchema>;
export type MaterialContrast = z.infer<typeof MaterialContrastSchema>;
