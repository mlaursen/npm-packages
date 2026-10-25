import { html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

import { Progress } from "../progress/progress.js";
import styles from "./circular-progress-styles.js";
import type {
  CircularProgressIndicatorWidth,
  CircularProgressProperties,
  CircularProgressShape,
  CircularProgressSize,
} from "./types.js";

export class CircularProgress
  extends Progress
  implements CircularProgressProperties
{
  static override styles = [...Progress.styles, styles];
  static readonly elementName: string = "mwc-circular-progress";

  @property()
  shape: CircularProgressShape = "round";

  @property()
  size: CircularProgressSize = "medium";

  @property({ reflect: true, attribute: "indicator-width" })
  indicatorWidth: CircularProgressIndicatorWidth = "medium";

  override render(): TemplateResult {
    return html`
      <svg>
        <circle class="track"></circle>
        <circle class="active-track"></circle>
      </svg>

      <div class="spinner">
        <div class="left"><div class="circle"></div></div>
        <div class="right"><div class="circle"></div></div>
      </div>
    `;
  }
}
