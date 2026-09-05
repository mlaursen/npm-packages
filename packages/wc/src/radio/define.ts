import { safeDefine } from "../utils/safeDefine.js";
import { Radio } from "./radio.js";

safeDefine("mwc-radio", Radio);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-radio": Radio;
  }
}
