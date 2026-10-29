import type { StylableLitElement, StyledLitElement } from "../types.js";
import { mergeStyles } from "../utils/mergeStyles.js";
import styles from "./elevation-styles.js";

export function ElevationMixin<T extends StylableLitElement>(
  Base: T,
): T & StyledLitElement {
  return class ElevatedLitElement extends Base {
    static override styles = mergeStyles(Base, styles);
  };
}
