import {
  enableLogger,
  logComplete,
  prettyFilesize,
} from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss";
import { writeFile } from "node:fs/promises";

enableLogger();

const shortVarNames = true;

const code = `
@use "./src" as *;

@include configure(
  $output: css,
  $short-var-names: ${shortVarNames}
);
// shortVarNames === false
//  ✓ Wrote:
// - ./dist/raw.css       42.4 kB
// - ./dist/raw.min.css   36.6 kB
//
// shortVarNames === true
//  ✓ Wrote:
// - ./dist/raw.css       38.7 kB
// - ./dist/raw.min.css   33 kB

@layer {
  @include css-reset;
  :root{
    @include variables;
  }

  @include styles;
}
`;

const start = Date.now();
const result = compileScss({
  code,
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
