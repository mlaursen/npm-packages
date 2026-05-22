import { readFileSync } from "node:fs";

import { type ConfigureScssOptions } from "./types.js";

function loadConfigureFile(options: Required<ConfigureScssOptions>): string {
  const { colorScheme, shortVarNames } = options;
  return `@use "./src" as *;

@include configure(
  $palette: (
    color-scheme: ${colorScheme}
  ),
  $short-var-names: ${shortVarNames}
);
`;
}

export function createLoadScssFile(options: Required<ConfigureScssOptions>) {
  return function load(filePath: string): string {
    if (/generate-components\/configure/.test(filePath)) {
      return loadConfigureFile(options);
    }

    return readFileSync(filePath, "utf8");
  };
}
