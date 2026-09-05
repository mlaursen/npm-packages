import { safeDefine } from "../utils/safeDefine.js";
import { Dialog } from "./dialog.js";
import "../dialog-actions/define.js";
import "../dialog-content/define.js";
import "../dialog-header/define.js";
import "../dialog-title/define.js";

safeDefine("mwc-dialog", Dialog);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog": Dialog;
  }
}
