import type { MaterialSymbolCustomProperties } from "@mlaursen/wc";

export interface MaterialSymbolsSearchParamsState extends Required<MaterialSymbolCustomProperties> {
  query: string;
  selected: string;
}

export type MaterialSymbolsSearchParam = keyof MaterialSymbolsSearchParamsState;

export interface MaterialSymbolsState extends MaterialSymbolsSearchParamsState {
  filtersVisible: boolean;
}
