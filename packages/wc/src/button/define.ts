import { safeDefine } from "../utils/safeDefine.js";
import { Button } from "./button.js";
import "../elevation/define.js";

safeDefine("mwc-button", Button);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-button": Button;
  }
}
