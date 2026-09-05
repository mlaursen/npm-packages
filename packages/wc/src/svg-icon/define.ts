import { safeDefine } from "../utils/safeDefine.js";
import { SvgIcon } from "./svg-icon.js";

safeDefine("mwc-svg-icon", SvgIcon);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-svg-icon": SvgIcon;
  }
}
