import { safeDefine } from "../utils/safeDefine.js";
import { Box } from "./box.js";

safeDefine(Box);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-box": Box;
  }
}
