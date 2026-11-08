import type { OverridableStringUnion } from "@mlaursen/utils";

import type { MediaQueryNameOrQuery } from "../media-queries/types.js";
import type { HorizontalAnchor, VerticalAnchor } from "../popover/types.js";

export interface CopyToClipboardPositionOverrides {}
export type DefaultCopyToClipboardPosition = "static" | "absolute";
export type CopyToClipboardPosition = OverridableStringUnion<
  DefaultCopyToClipboardPosition,
  CopyToClipboardPositionOverrides
>;

export type ClipboardItemInit = ConstructorParameters<typeof ClipboardItem>[0];
export type ClipboardData = string | ClipboardItem | ClipboardItems;

export interface ClipboardCopyEventDetail<
  D extends ClipboardData = ClipboardData,
> {
  data: D;
}

export interface ClipboardCopyErrorEventDetail<
  D extends ClipboardData = ClipboardData,
> extends ClipboardCopyEventDetail<D> {
  error: unknown;
}

export interface CopyToClipboardOptions<
  D extends ClipboardData = ClipboardData,
> {
  data?: D;
  element?: HTMLElement;

  /**
   * @defaultValue `false`
   */
  allowEmpty?: boolean;

  onCopy?: (details: ClipboardCopyEventDetail<D>) => void;
  onError?: (details: ClipboardCopyErrorEventDetail<D>) => void;
}

export interface CopyToClipboardProperties {
  value: string;

  /**
   * @defaultValue `false`
   */
  allowEmpty: boolean;

  /**
   * @defaultValue `"static"`
   */
  position: CopyToClipboardPosition;

  /**
   * This is a pass-through property for the `<mwc-tooltip>`.
   *
   * @see {@link HorizontalAnchor}
   * @defaultValue `"left"`
   */
  anchorX: HorizontalAnchor;

  /**
   * This is a pass-through property for the `<mwc-tooltip>`.
   *
   * @see {@link VerticalAnchor}
   * @defaultValue `"center"`
   */
  anchorY: VerticalAnchor;

  /**
   * This is a pass-through property for the `<mwc-tooltip>`.
   *
   * @defaultValue `false`
   */
  arrow: boolean;

  /**
   * @defaultValue `false`
   */
  disabled: boolean;

  /**
   * For most use-cases, copy to clipboard isn't useful on phones.
   *
   * @defaultValue `"phone"`
   */
  hiddenMedia: MediaQueryNameOrQuery | null;
}
