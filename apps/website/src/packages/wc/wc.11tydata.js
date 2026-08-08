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

/** @type {import("@mlaursen/wc").Margin[]} */
export const margins = ["none", "top", "bottom", "centered", "start", "end"];

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

  states: ["normal", "unselected", "selected"],
};

export const iconButton = {
  /** @type {(import("@mlaursen/wc").IconButtonWidth | null)[]} **/
  widths: ["narrow", null, "wide"],
};

export const card = {
  image: {
    src: "data:image/png;base64,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",
    alt: "",
  },

  clickable: [true, false],
  disabled: [false, true],

  /** @type {import("@mlaursen/wc").CardVariant[]} */
  variants: ["elevated", "filled", "outlined"],
};

export const dialog = {
  /** @type {(import("@mlaursen/wc").DialogType | null)[]} **/
  types: [null, "alert"],

  /** @type {(import("@mlaursen/wc").DialogWidth)[]} **/
  widths: defaultSizes,
};

export const checkbox = {
  /** @type {(import("@mlaursen/wc").CheckboxSize)[]} **/
  sizes: defaultSizes,

  states: ["unchecked", "checked", "indeterminate", "error", "disabled"],
};

export const radio = {
  /** @type {(import("@mlaursen/wc").RadioSize)[]} **/
  sizes: defaultSizes,
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

export const textField = {
  /** @type {import("@mlaursen/wc").TextFieldSize[]} */
  sizes: ["normal", "small"],

  /** @type {import("@mlaursen/wc").TextFieldVariant[]} */
  variants: ["filled", "outlined"],

  /** @type {import("@mlaursen/wc").SupportedInputType[]} */
  types: [
    "text",
    "number",
    "email",
    "search",
    "tel",
    "url",
    "password",
    "textarea",
  ],

  /** @type {import("@mlaursen/wc").TextFieldShape[]} */
  shapes: ["round", "square"],

  states: ["normal", "disabled", "readOnly", "error"],
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
