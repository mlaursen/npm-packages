import { LitElement, type TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import type {
  TypographySize,
  TypographyVariant,
} from "../dist/typography/types.js";

const sizes: TypographySize[] = ["large", "medium", "small"];
const variants: TypographyVariant[] = [
  "display",
  "headline",
  "title",
  "label",
  "body",
];
const prominents = [false, true];

@customElement("app-typography")
export class Typography extends LitElement {
  override render(): TemplateResult {
    const parts = variants.map((variant) =>
      sizes.map((size) =>
        prominents.map(
          (prominent) => html`
            <mwc-typography
              size=${size}
              variant=${variant}
              .prominent=${prominent}
            >
              <h3>${variant} ${size} ${prominent && "Prominent"}</h3>
            </mwc-typography>
          `,
        ),
      ),
    );
    return html`${parts}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-typography": Typography;
  }
}
