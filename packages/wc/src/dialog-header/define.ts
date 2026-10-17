import { safeDefine } from "../utils/safeDefine.js";
import { DialogHeader } from "./dialog-header.js";

safeDefine(DialogHeader);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-header": DialogHeader;
  }
}
