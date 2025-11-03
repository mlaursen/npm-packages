import { cssUtils } from "@react-md/core/cssUtils";
import { bem } from "@react-md/core/utils/bem";
import { cnb } from "cnbuilder";

const styles = bem("code-block");

declare module "react" {
  interface CSSProperties {
    "--code-margin"?: number | string;
    "--code-padding"?: number | string;
    "--code-max-height"?: number | string;
    "--code-tablet-max-height"?: number | string;
    "--code-pre-margin"?: number | string;
    "--code-pre-padding"?: number | string;
  }
}

export interface CodeBlockClassNameOptions {
  className?: string;

  /**
   * This should be enabled if the header or preview exists above the code
   * block.
   */
  disableMarginTop?: boolean;
}

export function codeBlock(options: CodeBlockClassNameOptions = {}): string {
  const { className, disableMarginTop } = options;
  return cnb(
    styles({ "no-tm": disableMarginTop }),
    cssUtils({
      textColor: "text-primary",
      surfaceColor: "dark",
    }),
    className
  );
}

export interface CodeBlockScrollContainerClassNameOptions {
  className?: string;
}

export function codeBlockScrollContainer(
  options: CodeBlockScrollContainerClassNameOptions = {}
): string {
  const { className } = options;
  return cnb(styles("scroll-container"), className);
}

export interface CodeBlockPreContainerClassNameOptions {
  className?: string;
}

export function codeBlockPreContainer(
  options: CodeBlockPreContainerClassNameOptions = {}
): string {
  const { className } = options;

  return cnb(styles("pre-container"), className);
}

export interface CodeBlockPreClassNameOptions {
  className?: string;

  /**
   * Set to `true` to allow the code to line wrap instead of showing scrollbars.
   * This is recommended when showing code within a limited space (like a right
   * fixed dialog/sheet).
   *
   * @defaultValue `false`
   */
  lineWrap?: boolean;
}

export function codeBlockPre(
  options: CodeBlockPreClassNameOptions = {}
): string {
  const { lineWrap, className } = options;
  return cnb(styles("pre", { wrap: lineWrap }), className);
}
