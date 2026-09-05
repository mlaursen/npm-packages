import { safeDefine } from "../utils/safeDefine.js";
import { ObjectFit } from "./object-fit.js";

safeDefine("mwc-object-fit", ObjectFit);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-object-fit": ObjectFit;
  }
}
