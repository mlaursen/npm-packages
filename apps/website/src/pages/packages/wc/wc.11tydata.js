export const packageName = "@mlaursen/wc";
export const title = `${packageName}: An accessible web component library`;
export const siteName = `${packageName} documentation`;
export const description =
  "Accessible web components built to the the foundation for web applications. The default styles are based on material design.";
export const symbols = true;

export const currentVersion = 0;

export const sourcePath = "npm-packages/packages/wc";

/** @type {import("@mlaursen/wc").DefaultComponentSize[]} */
export const defaultSizes = ["small", "medium", "large"];

/** @type {import("@mlaursen/wc").DefaultComponentExtraSize[]} */
export const defaultExtraSizes = [
  "extra-small",
  ...defaultSizes,
  "extra-large",
];

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

export const eleventyComputed = {
  playground: (data) => {
    const slug = data.page.fileSlug;

    return data[slug]?.playground ?? null;
  },
};
