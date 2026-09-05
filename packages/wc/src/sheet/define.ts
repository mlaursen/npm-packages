import { safeDefine } from "../utils/safeDefine.js";
import { Sheet } from "./sheet.js";
import "../sheet-header/define.js";
import "../sheet-title/define.js";
import "../material-symbol/define.js";

safeDefine("mwc-sheet", Sheet);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sheet": Sheet;
  }
}
