import { type BoxOptions, box } from "@react-md/core/box/styles";
import { cssUtils } from "@react-md/core/cssUtils";
import { bem } from "@react-md/core/utils/bem";
import { cnb } from "cnbuilder";

const styles = bem("code-preview");

export interface CodePreviewClassNameOptions extends BoxOptions {
  className?: string;

  /**
   * Set to `true` to disable all the {@link box} styling.
   *
   * @defaultValue `false`
   */
  disableBox?: boolean;

  /**
   * @defaultValue `false`
   */
  borderBottom?: boolean;
}

export function codePreview(options: CodePreviewClassNameOptions): string {
  const { className, borderBottom, disableBox, disablePadding, ...boxOptions } =
    options;

  return cnb(
    styles({
      padding: !disablePadding,
      "no-bb": !borderBottom,
    }),
    !disableBox && box({ ...boxOptions, disablePadding }),
    className
  );
}

export interface CodePreviewErrorClassNameOptions {
  className?: string;
}

export function codePreviewError(
  options: CodePreviewErrorClassNameOptions = {}
): string {
  const { className } = options;

  return cnb(
    styles("error"),
    cssUtils({ textAlign: "right", textColor: "error" }),
    className
  );
}
