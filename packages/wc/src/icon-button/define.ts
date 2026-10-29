import { safeDefine } from "../utils/safeDefine.js";
import { IconButton } from "./icon-button.js";

safeDefine(IconButton);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-icon-button": IconButton;
  }
}
