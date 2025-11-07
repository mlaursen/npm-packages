import { type HTMLAttributes, type ReactElement } from "react";

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
   * Optional props to pass to the {@link InlineCode} element that wraps the
   * {@link color}. Will not be used if {@link disableCode} is `true`.
   */
  codeProps?: InlineCodeProps;
}

/**
 * Creates an inline preview for a color. It will also add a tooltip while
 * hovered for a slightly larger preview.
 *
 * @example Simple Example
 * ```tsx
 * <ColorPreview color="#faf" />
 * <ColorPreview color="rgba(255, 12, 32, 0.3)" variant="icon" />
 * <ColorPreview color="#0F0F0F" shadowed />
 * <ColorPreview color="#0F0F0F" variant="icon" shadowed />
 * ```
 */
export function ColorPreview(props: ColorPreviewProps): ReactElement {
  const {
    color,
    style,
    className,
    codeProps,
    variant = "inline-code",
    shadowed,
    disableTooltip,
    ...remaining
  } = props;

  const icon = variant === "icon";
  return (
    <span
      role={(icon && "presentation") || undefined}
      {...remaining}
      style={{ "--color-preview-color": color, ...style }}
      className={colorPreview({
        className,
        variant,
        shadowed,
        disableTooltip,
      })}
    >
      {!icon && <InlineCode {...codeProps}>{color}</InlineCode>}
    </span>
  );
}
