import { safeDefine } from "../utils/safeDefine.js";
import { Button } from "./button.js";

safeDefine(Button);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-button": Button;
  }
}
