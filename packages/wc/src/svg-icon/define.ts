import { safeDefine } from "../utils/safeDefine.js";
import { SvgIcon } from "./svg-icon.js";

safeDefine(SvgIcon);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-svg-icon": SvgIcon;
  }
}
