/** @see {@link MaterialSymbolFill} */
export const MATERIAL_SYMBOL_FILLS = [0, 1] as const;
/**
 * Fill gives you the ability to modify the default icon style. A single icon
 * can render both unfilled and filled states.
 *
 * To convey a state transition, use the fill axis for animation or
 * interaction. The values are 0 for default or 1 for completely filled. Along
 * with the weight axis, the fill also impacts the look of the icon.
 */
export type MaterialSymbolFill = (typeof MATERIAL_SYMBOL_FILLS)[number];

/** @see {@link MaterialSymbolWeight} */
export const MATERIAL_SYMBOL_WEIGHTS = [
  100, 200, 300, 400, 500, 600, 700,
] as const;
/**
 * Weight defines the symbol’s stroke weight, with a range of weights between
 * thin (100) and bold (700). Weight can also affect the overall size of the
 * symbol.
 */
export type MaterialSymbolWeight = (typeof MATERIAL_SYMBOL_WEIGHTS)[number];

/** @see {@link MaterialSymbolGrade} */
export const MATERIAL_SYMBOL_GRADES = [-25, 0, 200] as const;
/**
 * Weight and grade affect a symbol’s thickness. Adjustments to grade are more
 * granular than adjustments to weight and have a small impact on the size of
 * the symbol.
 *
 * Grade is also available in some text fonts. You can match grade levels
 * between text and symbols for a harmonious visual effect. For example, if
 * the text font has a -25 grade value, the symbols can match it with a
 * suitable value, say -25.
 *
 * You can use grade for different needs:
 *
 * - Low emphasis (e.g. -25 grade): To reduce glare for a light symbol on a
 *   dark background, use a low grade.
 * - High emphasis (e.g. 200 grade): To highlight a symbol, increase the
 *   positive grade.
 */
export type MaterialSymbolGrade = (typeof MATERIAL_SYMBOL_GRADES)[number];

/** @see {@link MaterialSymbolOpticalSize} */
export const MATERIAL_SYMBOL_OPTICAL_SIZES = [20, 24, 40, 48] as const;
/**
 * Optical Sizes range from 20dp to 48dp.
 *
 * For the image to look the same at different sizes, the stroke weight
 * (thickness) changes as the icon size scales. Optical Size offers a way to
 * automatically adjust the stroke weight when you increase or decrease the
 * symbol size.
 */
export type MaterialSymbolOpticalSize =
  (typeof MATERIAL_SYMBOL_OPTICAL_SIZES)[number];

export const MATERIAL_SYMBOL_FAMILIES = [
  "outlined",
  "rounded",
  "sharp",
] as const;
export type MaterialSymbolFamily = (typeof MATERIAL_SYMBOL_FAMILIES)[number];
