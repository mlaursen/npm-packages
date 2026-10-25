import { safeDefine } from "../utils/safeDefine.js";
import { AsyncButton } from "./async-button.js";
import "../button/define.js";
import "../linear-progress/define.js";
import "../circular-progress/define.js";

safeDefine(AsyncButton);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-async-button": AsyncButton;
  }
}
