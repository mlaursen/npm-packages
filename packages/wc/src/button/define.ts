import { safeDefine } from "../utils/safeDefine.js";
import { Button } from "./button.js";
import "../elevation/define.js";

safeDefine(Button);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-button": Button;
  }
}
