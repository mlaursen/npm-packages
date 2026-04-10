import {
  enableLogger,
  logComplete,
  prettyFilesize,
} from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss";
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";

enableLogger();
const load = (filePath: string): string => readFileSync(filePath, "utf8");

const code = `
@use "./src" as *;

@include configure(
  $output: css
);

@layer {
  :root{
    @include variables;
  }

  @include styles;
}
`;

const start = Date.now();
const result = compileScss({
  code,
  load,
  basePath: process.cwd(),
  sassOptions: {
    sourceMap: true,
    sourceMapIncludeSources: true,
  },
});

const minified = transform({
  code: Buffer.from(result.css, "utf8"),
  minify: true,
  filename: "scripts/test-scss.scss",
  targets: browserslistToTargets(
    browserslist("last 2 versions and not dead and > 0.5%"),
  ),
  inputSourceMap: (result.sourceMap && JSON.stringify(result.sourceMap)) ?? "",
});

await Promise.all([
  writeFile("./dist/raw.css", result.css, "utf8"),
  writeFile("./dist/raw.min.css", minified.code.toString(), "utf8"),
]);

logComplete(
  `Wrote:
- ./dist/raw.css       ${prettyFilesize(result.css)}
- ./dist/raw.min.css   ${prettyFilesize(minified.code.toString())}
`,
  Date.now() - start,
);
