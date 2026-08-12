import { writeFile } from "node:fs/promises";

import {
  enableLogger,
  logComplete,
  prettyFilesize,
} from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import { alphaNumericSort } from "@mlaursen/utils";
import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss";

import type { ColorScheme } from "../src/index.js";

enableLogger();
const start = Date.now();

const COLOR_SCHEMES: readonly ColorScheme[] = [
  "light",
  "dark",
  "system",
  "light-dark",
];

function getColorSchemeCode(colorScheme: ColorScheme): string {
  return `
@use "./src" as *;

@include configure(
  $palette: (
    color-scheme: ${colorScheme}
  )
);

@layer {
  @include css-reset;

  :root{
    @include variables;
  }
}
`;
}

let longestLength = 0;
const results: string[] = [];
await Promise.all(
  COLOR_SCHEMES.map(async (colorScheme) => {
    const code = getColorSchemeCode(colorScheme);

    const result = compileScss({
      code,
      basePath: process.cwd(),
    });
    const minified = transform({
      code: Buffer.from(result.css, "utf8"),
      minify: true,
      filename: "scripts/test-scss.scss",
      targets: browserslistToTargets(
        browserslist("last 2 versions and not dead and > 0.5%"),
      ),
    });

    const fileName = `dist/${colorScheme}.css`;
    const minFileName = `dist/${colorScheme}.min.css`;
    const minCode = minified.code.toString();

    await Promise.all([
      writeFile(fileName, result.css, "utf8"),
      writeFile(minFileName, minCode, "utf8"),
    ]);

    const minStats = `./${minFileName} ${prettyFilesize(minCode)}`;
    longestLength = Math.max(longestLength, minStats.length);
    results.push(`./${fileName} ${prettyFilesize(result.css)}`, minStats);
  }),
);

longestLength += 4;
const lines: string[] = [];
for (const line of results) {
  const spacing = " ".repeat(longestLength - line.length);
  lines.push("- " + line.replace(" ", spacing));
}

logComplete(
  `Wrote:
${alphaNumericSort(lines).join("\n")}
`,
  Date.now() - start,
);
