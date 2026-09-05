import { safeDefine } from "../utils/safeDefine.js";
import { Divider } from "./divider.js";

safeDefine("mwc-divider", Divider);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-divider": Divider;
  }
}
