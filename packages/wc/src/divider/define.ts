import { safeDefine } from "../utils/safeDefine.js";
import { Divider } from "./divider.js";

safeDefine(Divider);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-divider": Divider;
  }
}
