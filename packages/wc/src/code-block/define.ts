import { safeDefine } from "../utils/safeDefine.js";
import { CodeBlock } from "./code-block.js";

safeDefine(CodeBlock);

declare global {
  interface HTMLElementTagNameMap {
    "mwc-code-block": CodeBlock;
  }
}
