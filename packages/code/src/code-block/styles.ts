import { cssUtils } from "@react-md/core/cssUtils";
import { bem } from "@react-md/core/utils/bem";
import { cnb } from "cnbuilder";

const styles = bem("code-block");

export interface ClassNameOptions {
  className?: string;
}

export interface CodeBlockClassNameOptions extends ClassNameOptions {
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

export function codeBlockScrollContainer(
  options: ClassNameOptions = {}
): string {
  const { className } = options;
  return cnb(styles("scroll-container"), className);
}

export function codeBlockPreContainer(options: ClassNameOptions = {}): string {
  const { className } = options;

  return cnb(styles("pre-container"), className);
}

export interface CodeBlockPreClassNameOptions extends ClassNameOptions {
  lineWrap?: boolean;
}

export function codeBlockPre(
  options: CodeBlockPreClassNameOptions = {}
): string {
  const { lineWrap, className } = options;
  return cnb(styles("pre", { wrap: lineWrap }), className);
}
