import { LitElement, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

import { MarginMixin } from "../margin/margin-mixin.js";
import type { ObjectFitVariant } from "../object-fit/types.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import type { PaletteBackgroundColor } from "../palette/types.js";
import styles from "./avatar-styles.js";
import type { AvatarProperties, AvatarShape, AvatarSize } from "./types.js";

const BaseStyledAvatar = PaletteMixin(MarginMixin(LitElement));

/**
 * @example Simple Example
```html
<mwc-avatar>A</mwc-avatar>
<mwc-avatar><img src="/example.png" alt=""></mwc-avatar>
```
 *
 * @slot - The default slot should generally contain an `<img>`, icon, or a few
 * letters representing the avatar.
 */
export class Avatar extends BaseStyledAvatar implements AvatarProperties {
  static override styles = [...BaseStyledAvatar.styles, styles];
  static readonly elementName: string = "mwc-avatar";

  @property({ reflect: true })
  size: AvatarSize = "medium";

  @property({ reflect: true })
  shape: AvatarShape = "round";

  @property({ reflect: true })
  variant: ObjectFitVariant = "fill";

  @property({ reflect: true })
  override background: PaletteBackgroundColor = "secondary";

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
