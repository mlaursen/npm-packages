import { safeDefine } from "../utils/safeDefine.js";
import { SheetHeader } from "./sheet-header.js";
import "../icon-button/define.js";
import "../material-symbol/define.js";

safeDefine(SheetHeader);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sheet-header": SheetHeader;
  }
}
