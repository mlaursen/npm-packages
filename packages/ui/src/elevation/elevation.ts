import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "./elevation-styles.js";

@customElement("ui-elevation")
export class Elevation extends LitElement {
  static override styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-elevation": Elevation;
  }
}
