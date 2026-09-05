import { safeDefine } from "../utils/safeDefine.js";
import { RadioGroup } from "./radio-group.js";

safeDefine("mwc-radio-group", RadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-radio-group": RadioGroup;
  }
}
