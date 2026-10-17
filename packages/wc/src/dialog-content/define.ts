import { safeDefine } from "../utils/safeDefine.js";
import { DialogContent } from "./dialog-content.js";

safeDefine(DialogContent);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-content": DialogContent;
  }
}
