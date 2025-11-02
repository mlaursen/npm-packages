import { cnb } from "cnbuilder";
import { type HTMLAttributes, type ReactElement, type ReactNode } from "react";

import { InlineCode, type InlineCodeProps } from "../inline-code/InlineCode.js";

declare module "react" {
  interface CSSProperties {
    "--color-preview-color"?: string;
    "--color-preview-preview-text-color"?: string;
  }
}

const NBSP = "\u00A0";

export interface ColorPreviewProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: boolean;
  color: string;
  codeProps?: InlineCodeProps;
  disableCode?: boolean;
}

/**
 * Creates an inline preview for a color. It will also add a tooltip while
 * hovered for a slightly larger preview.
 */
export function ColorPreview(props: ColorPreviewProps): ReactElement {
  const {
    icon,
    color,
    style,
    className,
    codeProps,
    disableCode,
    ...remaining
  } = props;

  let content: ReactNode;
  if (disableCode) {
    content = NBSP;
  } else if (!icon) {
    content = <InlineCode {...codeProps}>{color}</InlineCode>;
  }

  return (
    <span
      {...remaining}
      style={{ "--color-preview-color": color, ...style }}
      className={cnb(
        "color-preview",
        !icon && "color-preview--text",
        icon && "color-preview--icon",
        !icon && disableCode && "color-preview--color-only",
        className
      )}
    >
      {content}
    </span>
  );
}
