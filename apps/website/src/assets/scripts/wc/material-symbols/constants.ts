import type {
  MaterialSymbolCustomPropertyName,
  MaterialSymbolFamily,
} from "@mlaursen/wc";

import type {
  MaterialSymbolsSearchParam,
  MaterialSymbolsState,
} from "./types.js";

export const SYMBOL_FAMILIES = [
  "outlined",
  "rounded",
  "sharp",
] as const satisfies MaterialSymbolFamily[];

export const SYMBOL_QUERY_STATE_DEFAULTS = {
  fill: 0,
  weight: 500,
  grade: 0,
  opsz: 48,
  family: "outlined",
  query: "",
  selected: "",
} as const satisfies Partial<MaterialSymbolsState>;
export const SYMBOL_QUERY_STATE_PARAMS = Object.keys(
  SYMBOL_QUERY_STATE_DEFAULTS,
);
export const SYMBOL_CUSTOM_PROPERTY_NAMES = [
  "fill",
  "weight",
  "grade",
  "opsz",
  "family",
] as const satisfies MaterialSymbolCustomPropertyName[];

export const SYMBOL_QUERY_VAR_NAMES = {
  fill: "FILL",
  grade: "GRAD",
  weight: "wght",
  opsz: "opsz",
  query: "q",
  family: "family",
  selected: "icon",
} as const satisfies Record<MaterialSymbolsSearchParam, string>;

export const MIN_CELL_WIDTH = 160;
export const DEFAULT_HEADING_HEIGHT = 20;
export const FIRST_HEADING_HEIGHT = 48;
export const OTHER_HEADING_HEIGHT = 80;
