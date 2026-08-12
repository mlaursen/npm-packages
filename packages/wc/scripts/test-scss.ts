import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";

import {
  enableLogger,
  ensureParentDir,
  logComplete,
  prettyFilesize,
} from "@mlaursen/node-utils";
import { compileScss } from "@mlaursen/scss";
import browserslist from "browserslist";
import { browserslistToTargets, transform } from "lightningcss";

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
// - ./css/raw.css       42.4 kB
// - ./css/raw.min.css   36.6 kB
//
// shortVarNames === true
//  ✓ Wrote:
// - ./css/raw.css       38.7 kB
// - ./css/raw.min.css   33 kB

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

let materialThemeCss: string | undefined;
if (existsSync("material-theme.scss")) {
  const result = compileScss({
    code: `@use "./src" as *;
@use "./material-theme";

@layer {
  @include css-reset;
  :root{
    @include variables;
  }

  @include styles;
}
`,
    basePath: process.cwd(),
    load(filePath) {
      if (filePath.endsWith("material-theme.scss")) {
        return readFileSync("./material-theme.scss", "utf8").replace(
          "@mlaursen/wc",
          "./src",
        );
      }

      return readFileSync(filePath, "utf8");
    },
  });

  materialThemeCss = result.css;
}

await ensureParentDir("./css/raw.css");

await Promise.all([
  writeFile("./css/raw.css", result.css, "utf8"),
  writeFile("./css/raw.min.css", minified.code.toString(), "utf8"),
  materialThemeCss &&
    writeFile("./css/material-theme.css", materialThemeCss, "utf8"),
]);

logComplete(
  `Wrote:
- ./css/raw.css             ${prettyFilesize(result.css)}
- ./css/raw.min.css         ${prettyFilesize(minified.code.toString())}
${materialThemeCss && `- ./css/material-theme.css  ${prettyFilesize(result.css)}`}
`,
  Date.now() - start,
);
