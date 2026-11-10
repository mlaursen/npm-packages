import { safeDefine } from "../utils/safeDefine.js";
import { Skeleton } from "./skeleton.js";

safeDefine(Skeleton);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-skeleton": Skeleton;
  }
}
