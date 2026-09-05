import type { TemplateResult } from "lit";
import { html } from "lit";
import { property } from "lit/decorators.js";

import { AriaMixin } from "../aria-mixin/aria-mixin.js";
import { Card } from "../card/card.js";
import { InteractionMixin } from "../interaction/interaction-mixin.js";

const InteractableCard = InteractionMixin(Card);
const ButtonCard = AriaMixin(InteractableCard, "button");

export class ClickableCard extends ButtonCard {
  @property({ type: Boolean, reflect: true })
  clickable = true;

  @property({ type: Boolean })
  dragging = false;

  override render(): TemplateResult {
    return html`${super.render()}${this._renderStateLayer()}${this._renderRipple()}`;
  }
}
