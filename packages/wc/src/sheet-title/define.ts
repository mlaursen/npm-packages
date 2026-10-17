import { safeDefine } from "../utils/safeDefine.js";
import { SheetTitle } from "./sheet-title.js";

safeDefine(SheetTitle);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sheet-title": SheetTitle;
  }
}
