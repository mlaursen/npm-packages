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
  size?: AvatarSize;
  shape?: AvatarShape;
}
