import { html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

import { Progress } from "../progress/progress.js";
import styles from "./linear-progress-styles.js";
import type {
  LinearProgressProperties,
  LinearProgressShape,
  LinearProgressSize,
} from "./types.js";

/**
 * @csspart indeterminate-track - The visible track while in the indeterminate
 * state. Animate or restyle this.
 * @csspart determinate-track - The visible track while in the determinate
 * state. Animate or restyle this.
 */
export class LinearProgress
  extends Progress
  implements LinearProgressProperties
{
  static override styles = [...Progress.styles, styles];
  static readonly elementName: string = "mwc-linear-progress";

  @property({ attribute: "aria-orientation", reflect: true })
  override ariaOrientation = "horizontal";

  @property({ reflect: true })
  size: LinearProgressSize = "small";

  @property({ reflect: true })
  shape: LinearProgressShape = "round";

  @property({ reflect: true, attribute: "stop-indicator" })
  stopIndicator: "visible" | "hidden" = "visible";

  // NOTE: I haven't implemented the buffer part again yet
  override render(): TemplateResult {
    return html`
      <div part="indeterminate-track" class="track pseudo indeterminate"></div>

      <div part="buffer" class="track buffer"></div>
      <div part="determinate-track" class="track pseudo determinate"></div>
      <div class="stop-indicator"></div>
    `;
  }
}
