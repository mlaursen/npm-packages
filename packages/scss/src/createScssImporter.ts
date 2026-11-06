import type { Importer } from "sass";

import { FILE_URL } from "./constants.js";
import { getPossiblePaths } from "./getPossiblePaths.js";
import { resolveSassImportFromPackageJson } from "./resolveSassImportFromPackageJson.js";

export interface CreateScssImporterOptions {
  /**
   * Used to load the file. For node environments, this should generally be
   * `(filePath) => readFileSync(filePath, "utf8")`.
   */
  load: (filePath: string) => string;

  /**
   * The base path for resolving files. This should generally be
   * `process.cwd()` for node environments.
   */
  basePath: string;
}

export function createScssImporter(
  options: CreateScssImporterOptions,
): Importer<"sync"> {
  const { load, basePath } = options;
  return {
    canonicalize(url) {
      // if it's a relative path, let sass handle it itself.
      if (url.startsWith(".")) {
        return null;
      }

      let currentUrl = url;
      if (currentUrl.startsWith(FILE_URL)) {
        currentUrl = currentUrl.replace(FILE_URL, "");
      }
      currentUrl = currentUrl.replace(basePath + "/", "");

      const resolved = resolveSassImportFromPackageJson({
        url: currentUrl,
        load,
        basePath,
      });
      if (resolved) {
        return new URL(resolved, FILE_URL);
      }

      const possiblePaths = getPossiblePaths(`${basePath}/${currentUrl}`);
      for (const path of possiblePaths) {
        try {
          load(path);
          return new URL(path, FILE_URL);
        } catch {
          continue;
        }
      }
      return null;
    },
    load(canonicalUrl) {
      const filePath = canonicalUrl.pathname;
      const contents = load(filePath);

      return {
        syntax: "scss",
        contents,
      };
    },
  };
}
