import { safeDefine } from "../utils/safeDefine.js";
import { Checkbox } from "./checkbox.js";

safeDefine("mwc-checkbox", Checkbox);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-checkbox": Checkbox;
  }
}
