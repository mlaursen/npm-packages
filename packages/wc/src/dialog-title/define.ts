import { safeDefine } from "../utils/safeDefine.js";
import { DialogTitle } from "./dialog-title.js";

safeDefine("mwc-dialog-title", DialogTitle);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-title": DialogTitle;
  }
}
