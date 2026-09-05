import { safeDefine } from "../utils/safeDefine.js";
import { SheetTitle } from "./sheet-title.js";

safeDefine("mwc-sheet-title", SheetTitle);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sheet-title": SheetTitle;
  }
}
