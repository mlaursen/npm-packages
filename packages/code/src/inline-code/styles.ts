import { bem } from "@react-md/core/utils/bem";
import { cnb } from "cnbuilder";

declare module "react" {
  interface CSSProperties {
    "--code-inline-color"?: string;
    "--code-inline-font-family"?: string;
  }
}

const styles = bem("inline-code");

export interface InlineCodeClassNameOptions {
  className?: string;

  /**
   * Set to `true` to disable the backticks around the code (rendered with CSS).
   *
   * <code>`some code`</code> vs <code>some code</code>
   *
   * @defaultValue `false`
   *
   */
  disableTicks?: boolean;
}

export function inlineCode(options: InlineCodeClassNameOptions = {}): string {
  const { className, disableTicks } = options;

  return cnb(styles({ ticked: !disableTicks }), className);
}
