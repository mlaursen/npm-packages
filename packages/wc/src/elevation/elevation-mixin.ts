import { property } from "lit/decorators.js";

import type {
  StylableLitElement,
  StyledLitElementWithProperties,
} from "../types.js";
import { mergeStyles } from "../utils/mergeStyles.js";
import styles from "./elevation-styles.js";
import type { ElevationLevel, ElevationProperties } from "./types.js";

export function ElevationMixin<T extends StylableLitElement>(
  Base: T,
): StyledLitElementWithProperties<ElevationProperties, T> {
  class ElevatedLitElement extends Base implements ElevationProperties {
    static override styles = mergeStyles(Base, styles);

    @property({ type: Boolean, reflect: true })
    elevated = false;

    @property({ type: Number })
    elevation?: ElevationLevel | undefined;
  }

  return ElevatedLitElement;
}
