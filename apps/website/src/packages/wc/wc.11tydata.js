export const packageName = "@mlaursen/wc";
export const title = `${packageName}: An accessible web component library`;
export const siteName = `${packageName} documentation`;
export const description =
  "Accessible web components built to the the foundation for web applications. The default styles are based on material design.";
export const symbols = true;

export const currentVersion = 0;

export const sourcePath = "npm-packages/packages/wc";

export const materialThemeBuilderUrl =
  "https://material-foundation.github.io/material-theme-builder/";

/** @type {import("@mlaursen/wc").DefaultComponentSize[]} */
export const defaultSizes = ["small", "medium", "large"];

/** @type {import("@mlaursen/wc").DefaultComponentExtraSize[]} */
export const defaultExtraSizes = [
  "extra-small",
  ...defaultSizes,
  "extra-large",
];

/** @type {import("@mlaursen/wc").DefaultComponentShape[]} */
const defaultShapes = ["square", "round"];

/** @type {import("@mlaursen/wc").BasePaletteTheme[]} */
const baseThemes = ["primary", "secondary", "tertiary", "error"];
export const theme = {
  baseThemes,

  /** @type {import("@mlaursen/wc").PaletteBackgroundColor[]} */
  backgrounds: [
    "background",
    "surface",
    "surface-variant",
    "surface-dim",
    "surface-bright",
    "surface-container-lowest",
    "surface-container-low",
    "surface-container",
    "surface-container-high",
    "surface-container-highest",
    ...baseThemes.flatMap((name) => [name, `${name}-container`]),
  ],
};

export const appBar = {
  /** @type {import("@mlaursen/wc").AppBarSize[]} */
  sizes: defaultSizes,

  /** @type {import("@mlaursen/wc").AppBarVariant[]} */
  variants: ["flexible"],

  /** @type {import("@mlaursen/wc").AppBarPosition[]} */
  positions: ["top", "bottom"],

  /** @type {import("@mlaursen/wc").AppBarScrollBehavior[]} */
  scrollBehavior: [
    "static",
    "sticky",
    "fixed",
    "sticky-upwards",
    "fixed-upwards",
  ],
};

export const button = {
  /** @type {import("@mlaursen/wc").ButtonSize[]} */
  sizes: defaultExtraSizes,

  /** @type {import("@mlaursen/wc").ButtonShape[]} */
  shapes: ["round", "square"],

  /** @type {import("@mlaursen/wc").ButtonVariant[]} */
  variants: ["tonal", "text", "outlined", "filled", "elevated"],

  playground: true,
};

export const iconButton = {
  /** @type {(import("@mlaursen/wc").IconButtonWidth | null)[]} **/
  widths: ["narrow", null, "wide"],
};

export const dialog = {
  /** @type {(import("@mlaursen/wc").DialogType | null)[]} **/
  types: [null, "alert"],

  /** @type {(import("@mlaursen/wc").DialogWidth)[]} **/
  widths: defaultSizes,
};

export const sheet = {
  /** @type {(import("@mlaursen/wc").SheetShape)[]} **/
  shapes: defaultShapes,

  /** @type {(import("@mlaursen/wc").SheetPosition)[]} **/
  positions: ["right", "left", "bottom", "top"],

  /** @type {(import("@mlaursen/wc").SheetVariant)[]} **/
  variants: ["modal", "detached", "inline"],

  /** @type {(import("@mlaursen/wc").DialogWidth)[]} **/
  widths: defaultSizes,
};

export const typography = {
  /** @type {import("@mlaursen/wc").TypographySize[]} */
  sizes: defaultSizes.toReversed(),

  /** @type {import("@mlaursen/wc").TypographyVariant[]} */
  variants: ["display", "headline", "title", "label", "body"],
};

export const eleventyComputed = {
  playground: (data) => {
    const slug = data.page.fileSlug;

    return data[slug]?.playground ?? null;
  },
  title: (data) => {
    if (data.page.title) {
      return `${data.page.title} - ${packageName}`;
    }

    return data.tile || null;
  },
};
