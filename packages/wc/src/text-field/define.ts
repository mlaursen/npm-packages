import { safeDefine } from "../utils/safeDefine.js";
import { TextField } from "./text-field.js";

safeDefine("mwc-text-field", TextField);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-text-field": TextField;
  }
}
