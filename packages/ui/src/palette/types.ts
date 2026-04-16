import { type CamelCase, type CamelCaseKeys } from "@mlaursen/utils";

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
export type LightBasePaletteContainer = `light-${BasePaletteContainer}`;
export type DarkBasePaletteContainer = `dark-${BasePaletteContainer}`;

export type OnBasePaletteContainer = `on-${BasePaletteContainer}`;
export type LightOnBasePaletteContainer = `light-on-${BasePaletteContainer}`;
export type DarkOnBasePaletteContainer = `dark-on-${BasePaletteContainer}`;

export type PaletteContainer = BasePaletteContainer | OnBasePaletteContainer;
export type LightPaletteContainer = `light-${PaletteContainer}`;
export type DarkPaletteContainer = `dark-${PaletteContainer}`;

export type ExtraPaletteSurface =
  | "inverse-primary"
  | "surface-dim"
  | "surface-bright"
  | "surface-container-lowest"
  | "surface-container-low"
  | "surface-container"
  | "surface-container-high"
  | "surface-container-highest";
export type LightExtraPaletteSurface = `light-${ExtraPaletteSurface}`;
export type DarkExtraPaletteSurface = `dark-${ExtraPaletteSurface}`;

export type PaletteBackgroundColor = BasePaletteContainer | ExtraPaletteSurface;
export type LightPaletteBackgroundColor = `light-${PaletteBackgroundColor}`;
export type DarkPaletteBackgroundColor = `dark-${PaletteBackgroundColor}`;

export type RemainingPalette =
  | "outline"
  | "outline-variant"
  | "shadow"
  | "surface-tint"
  | "scrim";
export type LightRemainingPalette = `light-${RemainingPalette}`;
export type DarkRemainingPalette = `dark-${RemainingPalette}`;

export type PaletteTokenName =
  | PaletteContainer
  | ExtraPaletteSurface
  | RemainingPalette;
export type LightPaletteTokenName = `light-${PaletteTokenName}`;
export type DarkPaletteTokenName = `dark-${PaletteTokenName}`;
export type AllPaletteTokenName =
  | PaletteTokenName
  | LightPaletteTokenName
  | DarkPaletteTokenName;

export type PaletteTokenProperties = CamelCaseKeys<{
  [K in AllPaletteTokenName]?: string;
}>;

export type PaletteTextColor =
  | BasePaletteTheme
  | OnBasePaletteContainer
  | "currentcolor";

export type ContainerColor =
  | BasePaletteContainer
  | LightBasePaletteContainer
  | DarkBasePaletteContainer;
export type OnContainerColor =
  | OnBasePaletteContainer
  | LightOnBasePaletteContainer
  | DarkOnBasePaletteContainer;
export type CamelCaseContainerColor = CamelCase<ContainerColor>;
export type CamelCaseOnContainerColor = CamelCase<OnContainerColor>;
