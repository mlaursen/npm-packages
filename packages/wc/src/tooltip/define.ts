import { safeDefine } from "../utils/safeDefine.js";
import { Tooltip } from "./tooltip.js";

safeDefine(Tooltip);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-tooltip": Tooltip;
  }
}
