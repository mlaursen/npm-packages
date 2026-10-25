import { html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

import { Progress } from "../progress/progress.js";
import styles from "./circular-progress-styles.js";
import type {
  CircularProgressIndicatorWidth,
  CircularProgressProperties,
  CircularProgressSize,
} from "./types.js";

export class CircularProgress
  extends Progress
  implements CircularProgressProperties
{
  static override styles = [...Progress.styles, styles];
  static readonly elementName: string = "mwc-circular-progress";

  @property({ reflect: true })
  size: CircularProgressSize = "medium";

  @property({ reflect: true, attribute: "indicator-width" })
  indicatorWidth: CircularProgressIndicatorWidth = "medium";

  override render(): TemplateResult {
    if (this.indeterminate) {
      return this.#renderIndeterminate();
    }

    return this.#renderDeterminate();
  }

  #renderDeterminate(): TemplateResult {
    const dashOffset = (1 - this.value / this.max) * 100;

    return html`
      <svg class="determinate" viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle
          class="active-track"
          pathLength="100"
          stroke-dashoffset=${dashOffset}
        ></circle>
      </svg>
    `;
  }

  #renderIndeterminate(): TemplateResult {
    return html`
      <div class="spinner">
        <div class="left"><div class="circle"></div></div>
        <div class="right"><div class="circle"></div></div>
      </div>
    `;
  }
}
