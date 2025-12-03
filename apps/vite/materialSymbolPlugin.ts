import type { MaterialSymbolFamily } from "@react-md/core/icon/material";
import {
  MATERIAL_CONFIG,
  type MaterialSymbolFill,
  type MaterialSymbolGrade,
  type MaterialSymbolOpticalSize,
  type MaterialSymbolWeight,
} from "@react-md/core/icon/materialConfig";
import { glob, readFile } from "node:fs/promises";
import { join } from "node:path";
import { type Plugin } from "vite";

export type ValueOrRange<T extends number> = T | { min: T; max: T };

export interface MaterialSymbolPluginOptions {
  symbolNames?: readonly string[];
  defaultSymbolNames?: readonly string[];
  family?: MaterialSymbolFamily;
  fill?: ValueOrRange<MaterialSymbolFill>;
  weight?: ValueOrRange<MaterialSymbolWeight>;
  opticalSize?: ValueOrRange<MaterialSymbolOpticalSize>;
  grade?: ValueOrRange<MaterialSymbolGrade>;
}

const getValue = <T extends number>(
  value: ValueOrRange<T> | undefined,
  fallback: T
): string => {
  if (!value) {
    return `${fallback}`;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return `${value.min}..${value.max}`;
};

/**
 * Uses basic regex matching to find `<MaterialSymbol name="{SYMBOL_NAME}" />`.
 * So this will not work if the symbol name is a variable or multiple lines
 * due to formatting and will include commented code.
 */
export function materialSymbolPlugin(
  options: MaterialSymbolPluginOptions = {}
): Plugin {
  const {
    family = "outlined",
    defaultSymbolNames = [],
    symbolNames: staticSymbolNames,
  } = options;
  const symbolNames = new Set<string>(staticSymbolNames ?? defaultSymbolNames);

  const variant = family.charAt(0).toUpperCase() + family.slice(1);
  const fill = getValue(options.fill, MATERIAL_CONFIG.fill);
  const grade = getValue(options.grade, MATERIAL_CONFIG.grade);
  const weight = getValue(options.weight, MATERIAL_CONFIG.weight);
  const opticalSize = getValue(
    options.opticalSize,
    MATERIAL_CONFIG.opticalSize
  );

  const specs = `:opsz,wght,FILL,GRAD@${opticalSize},${weight},${fill},${grade}`;
  const baseUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+${variant}${specs}`;

  const regex = /<MaterialSymbol\s+name=["']([^"']+)["']/g;

  return {
    name: "@mlaursen/vite-plugin-material-symbols",
    async configResolved(config) {
      if (staticSymbolNames) {
        return;
      }

      const root = config.root ?? process.cwd();

      const globbedFiles = glob("src/**/*.{ts,tsx,js,jsx}", { cwd: root });
      for await (const file of globbedFiles) {
        try {
          const contents = await readFile(join(root, file), "utf8");

          let match: RegExpExecArray | null;
          while ((match = regex.exec(contents)) !== null) {
            symbolNames.add(match[1]);
          }
        } catch {
          // skip failed files
        }
      }
    },

    transformIndexHtml() {
      if (symbolNames.size === 0) {
        return [];
      }

      const sortedNames = [...symbolNames].toSorted();

      const fontUrl = `${baseUrl}&icon_names=${sortedNames.join(",")}&display=block`;

      return [
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          },
          injectTo: "head-prepend",
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: "",
          },
          injectTo: "head-prepend",
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: fontUrl,
          },
          injectTo: "head",
        },
      ];
    },
  };
}
