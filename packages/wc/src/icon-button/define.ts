import { safeDefine } from "../utils/safeDefine.js";
import { IconButton } from "./icon-button.js";
import "../elevation/define.js";

safeDefine("mwc-icon-button", IconButton);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-icon-button": IconButton;
  }
}
