import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "./elevation-styles.js";

@customElement("mwc-elevation")
export class Elevation extends LitElement {
  static override styles = styles;
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-elevation": Elevation;
  }
}
