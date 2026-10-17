import { safeDefine } from "../utils/safeDefine.js";
import { TextField } from "./text-field.js";

safeDefine(TextField);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-text-field": TextField;
  }
}
