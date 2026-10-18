import { safeDefine } from "../utils/safeDefine.js";
import { Switch } from "./switch.js";

safeDefine(Switch);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-switch": Switch;
  }
}
