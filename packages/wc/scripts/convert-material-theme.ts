/* eslint-disable unicorn/no-process-exit */
import { enableLogger, generateFile, logFailure } from "@mlaursen/node-utils";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

import type { MaterialContrast } from "../src/palette/schemas.js";
import {
  convertMaterialSchemeToScssMap,
  getMaterialSchemeKey,
  parseMaterialContrast,
  parseMaterialTheme,
} from "../src/palette/utils.js";

enableLogger();

let contrast: MaterialContrast = "normal";
const contrastIndex = process.argv.indexOf("--contrast");
if (contrastIndex > 0) {
  contrast = parseMaterialContrast(process.argv[contrastIndex]);
}

if (!existsSync("material-theme.json")) {
  logFailure("Missing material-theme.json!");
  process.exit(1);
}

const rawJson = await readFile("material-theme.json", "utf8");
const { schemes } = parseMaterialTheme(rawJson);
const lightScheme = schemes[getMaterialSchemeKey("light", contrast)];
const darkScheme = schemes[getMaterialSchemeKey("dark", contrast)];

await generateFile({
  contents: `
@use "@mlaursen/wc" as *;

@include configure(
  $palette: (
    light-theme: ${convertMaterialSchemeToScssMap(lightScheme)},
    dark-theme: ${convertMaterialSchemeToScssMap(darkScheme)},
  ),
);
`,
  filePath: "material-theme.scss",
  format: true,
});
