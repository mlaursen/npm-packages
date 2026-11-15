import type { OverridableStringUnion } from "@mlaursen/utils";

import type { DefaultComponentShape } from "../types.js";

export interface AvatarSizeOverrides {}
export type DefaultAvatarSize = "small" | "medium";
export type AvatarSize = OverridableStringUnion<
  DefaultAvatarSize,
  AvatarSizeOverrides
>;

export interface AvatarShapeOverrides {}
export type DefaultAvatarShape = DefaultComponentShape;
export type AvatarShape = OverridableStringUnion<
  DefaultAvatarShape,
  AvatarShapeOverrides
>;

export interface AvatarProperties {
  /**
   * @defaultValue `"medium"`
   */
  size: AvatarSize;

  /**
   * When this is `null`, the size can be customized using the
   * `--mwc-avatar-shape` custom property which defaults to the `"round"`
   * shape.
   *
   * @defaultValue `"round"`
   */
  shape: AvatarShape;
}
