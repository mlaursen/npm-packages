import { LitElement } from "lit";
import { property } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin.js";
import { PaletteMixin } from "../palette/palette.js";
import styles from "./icon-styles.js";
import { type IconSize } from "./types.js";

const BaseIcon = PaletteMixin(MarginMixin(LitElement));

export class Icon extends BaseIcon {
  static override styles = [...BaseIcon.styles, styles];

  @property()
  size: IconSize = "medium";

  override connectedCallback(): void {
    super.connectedCallback();

    this.ariaHidden ||= "true";
  }
}
