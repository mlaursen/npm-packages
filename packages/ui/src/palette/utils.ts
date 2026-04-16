import { type CamelCase, camelCase } from "@mlaursen/utils";

import {
  type AllPaletteTokenName,
  type BasePaletteContainer,
  type CamelCaseContainerColor,
  type CamelCaseOnContainerColor,
  type ContainerColor,
  type DarkBasePaletteContainer,
  type LightBasePaletteContainer,
  type OnContainerColor,
  type PaletteTokenName,
} from "./types.js";

const BASE_CONTAINER_COLOR: readonly BasePaletteContainer[] = [
  "primary",
  "primary-container",
  "secondary",
  "secondary-container",
  "tertiary",
  "tertiary-container",
  "surface",
  "surface-variant",
  "background",
  "error",
  "error-container",
];

type RemainingColor = Exclude<PaletteTokenName, BasePaletteContainer>;
type AllRemainingColor = Exclude<
  AllPaletteTokenName,
  BasePaletteContainer | LightBasePaletteContainer | DarkBasePaletteContainer
>;
type CamelCaseRemainingColor = CamelCase<AllRemainingColor>;

const BASE_REMAINING_COLOR: RemainingColor[] = [
  "on-primary",
  "on-primary-container",
  "inverse-primary",
  "on-secondary",
  "on-secondary-container",
  "on-tertiary",
  "on-tertiary-container",
  "on-surface",
  "surface-dim",
  "surface-bright",
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
  "on-surface-variant",
  "inverse-surface",
  "inverse-on-surface",
  "on-background",
  "on-error",
  "on-error-container",
  "outline",
  "outline-variant",
  "shadow",
  "surface-tint",
  "scrim",
];

type ContainerVarMapping = Record<CamelCaseContainerColor, ContainerColor>;
type OnContainerMapping = Record<
  CamelCaseContainerColor,
  CamelCaseOnContainerColor
>;
type OnContainerVarMapping = Record<CamelCaseContainerColor, OnContainerColor>;
type RemainingVarMapping = Record<CamelCaseRemainingColor, AllRemainingColor>;

// @ts-expect-error built afterwards
const CONTAINER_VAR_MAPPING: ContainerVarMapping = {};
// @ts-expect-error built afterwards
const ON_CONTAINER_MAPPING: OnContainerMapping = {};
// @ts-expect-error built afterwards
const ON_CONTAINER_VAR_MAPPING: OnContainerVarMapping = {};
for (const color of BASE_CONTAINER_COLOR) {
  const onColor = `on-${color}` as const;
  const lightColor = `light-${color}` as const;
  const lightOnColor = `light-on-${color}` as const;
  const darkColor = `dark-${color}` as const;
  const darkOnColor = `dark-on-${color}` as const;

  const key = camelCase(color);
  const lightKey = camelCase(lightColor);
  const darkKey = camelCase(darkColor);
  CONTAINER_VAR_MAPPING[key] = color;
  CONTAINER_VAR_MAPPING[lightKey] = lightColor;
  CONTAINER_VAR_MAPPING[darkKey] = darkColor;

  ON_CONTAINER_MAPPING[key] = camelCase(onColor);
  ON_CONTAINER_MAPPING[lightKey] = camelCase(lightOnColor);
  ON_CONTAINER_MAPPING[darkKey] = camelCase(darkOnColor);

  ON_CONTAINER_VAR_MAPPING[key] = onColor;
  ON_CONTAINER_VAR_MAPPING[lightKey] = lightOnColor;
  ON_CONTAINER_VAR_MAPPING[darkKey] = darkOnColor;
}

// @ts-expect-error built afterwards
const REMAINING_VAR_MAPPING: RemainingVarMapping = {};
for (const color of BASE_REMAINING_COLOR) {
  const lightColor = `light-${color}` as const;
  const darkColor = `dark-${color}` as const;
  const key = camelCase(color);
  const lightKey = camelCase(lightColor);
  const darkKey = camelCase(darkColor);

  REMAINING_VAR_MAPPING[key] = color;
  REMAINING_VAR_MAPPING[lightKey] = lightColor;
  REMAINING_VAR_MAPPING[darkKey] = darkColor;
}

export function isPaletteContainerProperty(
  property: unknown,
): property is CamelCaseContainerColor {
  return (
    typeof property === "string" &&
    !!CONTAINER_VAR_MAPPING[property as CamelCaseContainerColor]
  );
}

export function isRemainingPaletteProperty(
  property: unknown,
): property is CamelCaseRemainingColor {
  return (
    typeof property === "string" &&
    !!REMAINING_VAR_MAPPING[property as CamelCaseRemainingColor]
  );
}

export function getOnContainerProperty(
  name: CamelCaseContainerColor,
): CamelCaseOnContainerColor {
  return ON_CONTAINER_MAPPING[name];
}

export function getContainerVar(name: CamelCaseContainerColor): ContainerColor {
  return CONTAINER_VAR_MAPPING[name];
}

export function getOnContainerVar(
  name: CamelCaseContainerColor,
): OnContainerColor {
  return ON_CONTAINER_VAR_MAPPING[name];
}

export function getRemainingVar(
  name: CamelCaseRemainingColor,
): AllRemainingColor {
  return REMAINING_VAR_MAPPING[name];
}
