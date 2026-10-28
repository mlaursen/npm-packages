import { property } from "lit/decorators.js";

import type {
  StylableLitElement,
  StyledLitElementWithProperties,
} from "../types.js";
import { mergeStyles } from "../utils/mergeStyles.js";
import styles from "./margin-styles.js";
import type { Margin, MarginProperties } from "./types.js";

export function MarginMixin<T extends StylableLitElement>(
  Base: T,
): StyledLitElementWithProperties<MarginProperties, T> {
  class MarginStyledElement extends Base implements MarginProperties {
    static override styles = mergeStyles(Base, styles);

    @property()
    margin?: Margin;
  }

  return MarginStyledElement;
}
