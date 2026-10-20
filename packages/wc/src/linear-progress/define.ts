import { safeDefine } from "../utils/safeDefine.js";
import { LinearProgress } from "./linear-progress.js";

safeDefine(LinearProgress);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-linear-progress": LinearProgress;
  }
}
