import {
  isMaterialSymbolFamily,
  isMaterialSymbolFill,
  isMaterialSymbolGrade,
  isMaterialSymbolOpticalSize,
  isMaterialSymbolWeight,
} from "@mlaursen/wc";

import {
  SYMBOL_QUERY_STATE_DEFAULTS,
  SYMBOL_QUERY_VAR_NAMES,
} from "./constants.js";
import type {
  MaterialSymbolsSearchParam,
  MaterialSymbolsSearchParamsState,
} from "./types.js";
import type { URLSearchParamsController } from "./URLSearchParamsController.js";

export function getSearchParamsValue(
  name: "fill",
  controller: URLSearchParamsController,
): MaterialSymbolsSearchParamsState["fill"];
export function getSearchParamsValue(
  name: "weight",
  controller: URLSearchParamsController,
): MaterialSymbolsSearchParamsState["weight"];
export function getSearchParamsValue(
  name: "grade",
  controller: URLSearchParamsController,
): MaterialSymbolsSearchParamsState["grade"];
export function getSearchParamsValue(
  name: "opsz",
  controller: URLSearchParamsController,
): MaterialSymbolsSearchParamsState["opsz"];
export function getSearchParamsValue(
  name: "family",
  controller: URLSearchParamsController,
): MaterialSymbolsSearchParamsState["family"];
export function getSearchParamsValue(
  name: "selected",
  controller: URLSearchParamsController,
): MaterialSymbolsSearchParamsState["selected"];
export function getSearchParamsValue(
  name: "query",
  controller: URLSearchParamsController,
): MaterialSymbolsSearchParamsState["query"];
export function getSearchParamsValue(
  name: MaterialSymbolsSearchParam,
  controller: URLSearchParamsController,
): string | number {
  const value = controller.get(SYMBOL_QUERY_VAR_NAMES[name]);
  const fallback = SYMBOL_QUERY_STATE_DEFAULTS[name];
  if (name === "query") {
    return value?.trim() ?? fallback;
  }

  if (name === "selected") {
    return value?.trim() ?? fallback;
  }

  if (name === "family") {
    return isMaterialSymbolFamily(value) ? value : fallback;
  }

  const numberValue = Number.parseInt(value ?? "", 10);
  if (
    (name === "fill" && isMaterialSymbolFill(numberValue)) ||
    (name === "grade" && isMaterialSymbolGrade(numberValue)) ||
    (name === "weight" && isMaterialSymbolWeight(numberValue)) ||
    (name === "opsz" && isMaterialSymbolOpticalSize(numberValue))
  ) {
    return numberValue;
  }

  return fallback;
}

export function getSearchParamsUpdate(
  state: MaterialSymbolsSearchParamsState,
): Record<string, string | null> {
  const params: Record<string, string | null> = {};
  for (const [key, value] of Object.entries(state)) {
    if (
      key !== "query" &&
      key !== "fill" &&
      key !== "weight" &&
      key !== "grade" &&
      key !== "opsz" &&
      key !== "family" &&
      key !== "selected"
    ) {
      continue;
    }

    const initial = SYMBOL_QUERY_STATE_DEFAULTS[key];
    const current = typeof value === "string" ? value.trim() : value;

    params[SYMBOL_QUERY_VAR_NAMES[key]] =
      current === initial ? null : `${current}`;
  }

  return params;
}

export function getUpdateSearchParamsValue(
  value: string | number,
  initial: string | number,
): string | null {
  if (value === initial) {
    return null;
  }

  return `${value}`;
}
