export type ColorScheme = "light" | "dark" | "system" | "light-dark";

export type PaletteBackground = "background";

export type BasePaletteTheme = "primary" | "secondary" | "tertiary" | "error";

export type BasePaletteSurface =
  | "surface"
  | "surface-variant"
  | "inverse-surface";

export type BasePaletteContainer =
  | PaletteBackground
  | BasePaletteTheme
  | BasePaletteSurface
  | `${BasePaletteTheme}-container`;

export type OnBasePaletteContainer = `on-${BasePaletteContainer}`;

export type PaletteContainer = BasePaletteContainer | OnBasePaletteContainer;

export type ExtraPaletteSurface =
  | "inverse-primary"
  | "surface-dim"
  | "surface-bright"
  | "surface-container-lowest"
  | "surface-container-low"
  | "surface-container"
  | "surface-container-high"
  | "surface-container-highest";

export type PaletteBackgroundColor = BasePaletteContainer | ExtraPaletteSurface;

export type PaletteTextColor =
  | BasePaletteTheme
  | OnBasePaletteContainer
  | "currentcolor";

export type RemainingPalette =
  | "outline"
  | "outline-variant"
  | "shadow"
  | "surface-tint"
  | "scrim";

export type PaletteTokenName =
  | PaletteContainer
  | ExtraPaletteSurface
  | RemainingPalette;
