import { safeDefine } from "../utils/safeDefine.js";
import { Elevation } from "./elevation.js";

safeDefine(Elevation);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-elevation": Elevation;
  }
}
