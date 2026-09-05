import { safeDefine } from "../utils/safeDefine.js";
import { UpdatePalette } from "./update-palette.js";

safeDefine("mwc-update-palette", UpdatePalette);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-update-palette": UpdatePalette;
  }
}
