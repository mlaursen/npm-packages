import { LitElement, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import { PaletteMixin } from "../palette/palette-mixin.js";
import styles from "./list-styles.js";
import type { ListProperties, ListSize } from "./types.js";

const BaseList = AriaMixin(PaletteMixin(LitElement), "list", false);

export class List extends BaseList implements ListProperties {
  static override styles = [...BaseList.styles, styles];

  @property()
  size: ListSize = "large";

  @property({ type: Boolean })
  horizontal?: boolean;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
