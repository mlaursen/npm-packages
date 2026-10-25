import { html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

import { Progress } from "../progress/progress.js";
import styles from "./linear-progress-styles.js";
import type {
  LinearProgressProperties,
  LinearProgressShape,
  LinearProgressSize,
} from "./types.js";

export class LinearProgress
  extends Progress
  implements LinearProgressProperties
{
  static override styles = [...Progress.styles, styles];
  static readonly elementName: string = "mwc-linear-progress";

  @property({ attribute: "aria-orientation", reflect: true })
  override ariaOrientation = "horizontal";

  @property()
  size: LinearProgressSize = "small";

  @property({ reflect: true })
  shape: LinearProgressShape = "round";

  @property({ type: Boolean, attribute: "disable-stop-indicator" })
  disableStopIndicator = false;

  override render(): TemplateResult {
    return html`
      <div class="track pseudo indeterminate"></div>

      <div class="track buffer"></div>
      <div class="track pseudo determinate"></div>
      <div class="stop-indicator"></div>
    `;
  }
}
