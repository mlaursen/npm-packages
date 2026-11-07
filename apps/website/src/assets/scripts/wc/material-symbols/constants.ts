import type { MaterialSymbolCustomPropertyName } from "@mlaursen/wc";

import type {
  MaterialSymbolsSearchParam,
  MaterialSymbolsState,
} from "./types.js";

export const SYMBOL_QUERY_STATE_PARAMS = [
  "fill",
  "weight",
  "grade",
  "opsz",
  "family",
  "query",
  "selected",
] as const satisfies (keyof MaterialSymbolsState)[];
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
