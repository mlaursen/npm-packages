import { cnb } from "cnbuilder";
import { type HTMLAttributes, type ReactElement, type ReactNode } from "react";

import { InlineCode, type InlineCodeProps } from "../inline-code/InlineCode.js";
import { type ColorPreviewClassNameOptions, colorPreview } from "./styles.js";

declare module "react" {
  interface CSSProperties {
    "--color-preview-background-color"?: string;
    "--color-preview-border-color"?: string;
    "--color-preview-border-radius"?: string;
    "--color-preview-border-width"?: string;
    "--color-preview-color"?: string;
    "--color-preview-inline-offset"?: string;
    "--color-preview-inline-size"?: string;
    "--color-preview-large-offset"?: string;
    "--color-preview-offset"?: string;
    "--color-preview-outer-width"?: string;
    "--color-preview-popup-offset"?: string;
    "--color-preview-popup-transform-rtl"?: string;
    "--color-preview-preview-text-color"?: string;
    "--color-preview-size"?: string;
  }
}

const NBSP = "\u00A0";

export interface ColorPreviewProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    ColorPreviewClassNameOptions {
  /**
   * The color to use. Should be any valid CSS color string.
   *
   * - `#faf`
   * - `#FFAAFF`
   * - `rgb(255, 3, 10)`
   * - `rgba(12, 22, 255, 0.3)`
   * - etc
   */
  color: string;

  /**
   * Set to `true` to render without text and with an icon size.
   *
   * NOTE: This will always be `true` if {@link disableCode} is `true`.
   *
   * @defaultValue `false`
   */
  icon?: boolean;

  /**
   * Optional props to pass to the {@link InlineCode} element that wraps the
   * {@link color}. Will not be used if {@link disableCode} is `true`.
   */
  codeProps?: InlineCodeProps;

  /**
   * Set to `true` to disable the color from being rendered within a
   * {@link InlineCode}.
   *
   * @defaultValue `false`
   */
  disableCode?: boolean;

  v2?: boolean;
}

/**
 * Creates an inline preview for a color. It will also add a tooltip while
 * hovered for a slightly larger preview.
 *
 * @example Simple Example
 * ```tsx
 * <ColorPreview color="#faf" />
 * <ColorPreview color="rgba(255, 12, 32, 0.3)" icon />
 * <ColorPreview color="#0F0F0F" disableCode />
 * ```
 */
export function ColorPreview(props: ColorPreviewProps): ReactElement {
  const {
    icon,
    color,
    style,
    className,
    codeProps,
    disableCode,
    v2,
    variant = "inline-code",
    shadowed,
    disableTooltip,
    ...remaining
  } = props;

  if (v2) {
    const isIcon = variant === "icon";
    return (
      <span
        role={(isIcon && "presentation") || undefined}
        {...remaining}
        style={{ "--color-preview-color": color, ...style }}
        className={colorPreview({
          className,
          variant,
          shadowed,
          disableTooltip,
        })}
      >
        {!isIcon && <InlineCode {...codeProps}>{color}</InlineCode>}
      </span>
    );
  }

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
