/* eslint-disable no-param-reassign */
const RGB_REGEX = /^rgb\(((\b([01]?\d\d?|2[0-4]\d|25[0-5])\b),?){3}\)$/;
const SHORTHAND_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const VERBOSE_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts a hex string into an rgb value. This is useful for detecting color
 * contrast ratios and other stuff.
 *
 * @param hex - The hex string to convert
 * @returns an object containing the r, g, b values for the color.
 */
export function hexToRGB(hex: string): RGB {
  if (!SHORTHAND_REGEX.test(hex) && !VERBOSE_REGEX.test(hex)) {
    throw new TypeError("Invalid color string.");
  }

  hex = hex.replace(
    SHORTHAND_REGEX,
    (_m, r, g, b) => `${r}${r}${g}${g}${b}${b}`,
  );

  const result = hex.match(VERBOSE_REGEX) || [];
  const r = Number.parseInt(result[1] || "", 16) || 0;
  const g = Number.parseInt(result[2] || "", 16) || 0;
  const b = Number.parseInt(result[3] || "", 16) || 0;

  return { r, g, b };
}

export function getRGB(color: string): RGB {
  // chrome 102.0.50005.63 apparently has whitespace when calling `window.getComputedStyle(element)`
  // remove whitespace to make it easy for supporting rgb or hex
  color = color.replaceAll(/\s/g, "");
  const rgbMatches = color.match(RGB_REGEX);
  if (rgbMatches) {
    const r = Number.parseInt(rgbMatches[1] || "", 16) || 0;
    const g = Number.parseInt(rgbMatches[2] || "", 16) || 0;
    const b = Number.parseInt(rgbMatches[3] || "", 16) || 0;

    return { r, g, b };
  }

  return hexToRGB(color);
}

/**
 * @see https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 */
function toLinear(bit: number): number {
  bit /= 255;

  if (bit <= 0.039_28) {
    return bit / 12.92;
  }

  return ((bit + 0.055) / 1.055) ** 2.4;
}

/**
 * A number closest to 0 should be closest to black while a number closest to 1
 * should be closest to white.
 *
 * @see https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 */
export function getLuminance(color: string): number {
  const { r, g, b } = getRGB(color);

  return toLinear(r) * 0.2126 + toLinear(g) * 0.7152 + toLinear(b) * 0.0722;
}

/**
 * Gets the contrast ratio between a background color and a foreground color.
 *
 * @see https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param background - The background color
 * @param foreground - The foreground color. This is normally the `color` css
 * value.
 * @returns the contrast ratio between the background and foreground colors.
 */
export function getContrastRatio(
  background: string,
  foreground: string,
): number {
  const backgroundLuminance = getLuminance(background) + 0.05;
  const foregroundLuminance = getLuminance(foreground) + 0.05;

  return (
    Math.max(backgroundLuminance, foregroundLuminance) /
    Math.min(backgroundLuminance, foregroundLuminance)
  );
}

/**
 * Returns the highest contrast color to the provided `backgroundColor`. This is
 * normally used to ensure that a new background color can use an accessible text
 * color of either `#000` or `#fff`.
 *
 * This is pretty much a javascript implementation as the `contrast-color` Sass
 * function.
 */
export function contrastColor(
  backgroundColor: string,
  lightColor = "#fff",
  darkColor = "#000",
): string {
  const lightContrast = getContrastRatio(backgroundColor, lightColor);
  const darkContrast = getContrastRatio(backgroundColor, darkColor);

  return lightContrast > darkContrast ? lightColor : darkColor;
}
