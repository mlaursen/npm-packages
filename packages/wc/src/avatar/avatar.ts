import { LitElement, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import type { ObjectFitVariant } from "../object-fit/types.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import type { PaletteBackgroundColor } from "../palette/types.js";
import styles from "./avatar-styles.js";
import type { AvatarProperties, AvatarShape, AvatarSize } from "./types.js";

const BaseStyledAvatar = PaletteMixin(MarginMixin(LitElement));

export class Avatar extends BaseStyledAvatar implements AvatarProperties {
  static override styles = [...BaseStyledAvatar.styles, styles];

  @property()
  size: AvatarSize = "medium";

  @property()
  shape: AvatarShape = "round";

  @property()
  variant: ObjectFitVariant = "fill";

  @property({ reflect: true })
  override background: PaletteBackgroundColor = "secondary";

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
