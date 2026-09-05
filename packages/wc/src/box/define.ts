import { safeDefine } from "../utils/safeDefine.js";
import { Box } from "./box.js";

safeDefine("mwc-box", Box);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-box": Box;
  }
}
