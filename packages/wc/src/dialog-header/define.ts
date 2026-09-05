import { safeDefine } from "../utils/safeDefine.js";
import { DialogHeader } from "./dialog-header.js";

safeDefine("mwc-dialog-header", DialogHeader);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-dialog-header": DialogHeader;
  }
}
