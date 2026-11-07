import type { IconProperties } from "../icon/types.js";
import type {
  MaterialSymbolFill,
  MaterialSymbolWeight,
  MaterialSymbolGrade,
  MaterialSymbolOpticalSize,
  MaterialSymbolFamily,
} from "./constants.js";

export interface MaterialSymbolCustomProperties {
  /**
   * Used to override the current material symbol font family. This can also be
   * configured using the `--mwc-icon-symbol-family` custom property.
   */
  family?: MaterialSymbolFamily;

  /**
   * Used to override the current material symbol fill. This can also be
   * configured using the `--mwc-icon-symbol-fill` custom property.
   */
  fill?: MaterialSymbolFill;

  /**
   * Used to override the current material symbol weight. This can also be
   * configured using the `--mwc-icon-symbol-weight` custom property.
   */
  weight?: MaterialSymbolWeight;

  /**
   * Used to override the current material symbol grade. This can also be
   * configured using the `--mwc-icon-symbol-grade` custom property.
   */
  grade?: MaterialSymbolGrade;

  /**
   * Used to override the current material symbol optical size. This can also
   * be configured using the `--mwc-icon-symbol-opsz` custom property.
   */
  opsz?: MaterialSymbolOpticalSize;
}

export type MaterialSymbolCustomPropertyName =
  keyof MaterialSymbolCustomProperties;

export interface MaterialSymbolProperties
  extends IconProperties, MaterialSymbolCustomProperties {}
