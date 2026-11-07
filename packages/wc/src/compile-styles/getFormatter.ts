import { importOptional } from "@mlaursen/node-utils";
import type * as CSSDeclarationSorter from "css-declaration-sorter";
import type { PluginCreator } from "postcss";
import type PostCSS from "postcss";

import type { FormatDevelopmentCSS } from "./types.js";

type SortOptions = Parameters<typeof CSSDeclarationSorter.default>[0];

/**
 * @internal
 */
export async function getFormatter(
  formatter: FormatDevelopmentCSS | undefined,
): Promise<FormatDevelopmentCSS> {
  if (formatter) {
    return formatter;
  }

  const [postcss, cssDeclarationSorter] = await Promise.all([
    importOptional<typeof PostCSS>("postcss", "").catch(() => undefined),
    importOptional<PluginCreator<SortOptions>>(
      "css-declaration-sorter",
      "",
    ).catch(() => undefined),
  ]);

  return async (code: string) => {
    if (!postcss || !cssDeclarationSorter) {
      return code;
    }

    const result = await postcss([
      cssDeclarationSorter({ order: "alphabetical", keepOverrides: true }),
    ]).process(code, { from: undefined });

    return result.css;
  };
}
