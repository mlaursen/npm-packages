import { LitElement } from "lit";
import { property } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./icon-styles.js";
import { type IconProperties, type IconSize } from "./types.js";

const BaseIcon = PaletteMixin(MarginMixin(LitElement));

export class Icon extends BaseIcon implements IconProperties {
  static override styles = [...BaseIcon.styles, styles];

  @property()
  size: IconSize = "medium";

  override connectedCallback(): void {
    super.connectedCallback();

    this.ariaHidden ||= "true";
  }
}
