import { safeDefine } from "../utils/safeDefine.js";
import { SrOnly } from "./sr-only.js";

safeDefine(SrOnly);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-sr-only": SrOnly;
  }
}
