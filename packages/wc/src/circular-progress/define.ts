import { safeDefine } from "../utils/safeDefine.js";
import { CircularProgress } from "./circular-progress.js";

safeDefine(CircularProgress);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-circular-progress": CircularProgress;
  }
}
