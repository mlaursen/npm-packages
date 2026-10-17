import { safeDefine } from "../utils/safeDefine.js";
import { Checkbox } from "./checkbox.js";

safeDefine(Checkbox);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-checkbox": Checkbox;
  }
}
