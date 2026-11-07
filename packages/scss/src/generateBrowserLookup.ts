import { readFileSync, writeFileSync } from "node:fs";

import { assertSassResolvePackageJson } from "./assertSassResolvePackageJson.js";
import { compileScss } from "./compileScss.js";
import { getBrowserFileContents } from "./getBrowserFileContents.js";

export interface GenerateBrowserLookupOptions {
  /**
   * The code entry point. This should be a file with `@use` statements to
   * import the rest of the code.
   *
   * i.e.
   *
   * ```scss
   * @use "./src";
   * ```
   */
  code: string;

  /**
   * An optional base path for loading files.
   *
   * @defaultValue `process.cwd()`
   */
  basePath?: string;

  /**
   * An optional browser base path
   *
   * @defaultValue `"/__home__"`
   */
  browserBasePath?: string;

  /**
   * When this is provided, the {@link GenerateBrowserLookupResult.contents}
   * will be written to that path
   */
  browserOutFilePath?: string;
}

export interface GenerateBrowserLookupResult {
  /**
   * The generated file lookup of absolute filePath -> contents
   */
  lookup: Readonly<Record<string, string>>;

  /**
   * The default generated file contents if not using the
   * {@link GenerateBrowserLookupOptions.browserOutFilePath}.
   */
  contents: string;

  /**
   * The {@link GenerateBrowserLookupOptions.browserBasePath} if writing the
   * files manually.
   */
  basePath: string;
}

/**
 * This is used to generate a browser lookup of files so the scss can
 * be compiled dynamically in the browser.
 *
 * @example Generate SCSS Lookup
```ts
import { generateBrowserLookup } from "@mlaursen/scss";

generateBrowserLookup({
  code: `
@use "./path/to/code";
`,
  browserOutFilePath: "./scssLookup.ts",
});

// then use in the browser:
import { compileScss } from "@mlaursen/wc";

import { loadFromScssLookup, BASE_PATH } from "./scssLookup";

const result = compileScss({
  code: `
@use "./another/path/to/code";

.whatever {
  background: red;
}
`,
  load: loadFromScssLookup,
  basePath: BASE_PATH,
})
```
 *
 * @example Manually Generate SCSS Lookup
```ts
import { readFileSync, writeFileSync } from "node:fs";
import { generateBrowserLookup } from "@mlaursen/scss";

const { basePath, lookup, contents } = generateBrowserLookup({
  code: "@use 'everything';"
});

writeFileSync("./scssLookup.ts", contents, "utf8");

// or manually
writeFileSync(
  "./scssLookupManual.js",
  `export const LOOKUP = ${JSON.stringify(lookup)};
export const BASE_PATH = "${basePath}";
 `,
  "utf8",
);
```
 *
 */
export function generateBrowserLookup(
  options: Readonly<GenerateBrowserLookupOptions>,
): GenerateBrowserLookupResult {
  const {
    code,
    basePath = process.cwd(),
    browserBasePath = "/__home__",
    browserOutFilePath,
  } = options;

  const lookup: Record<string, string> = {};
  compileScss({
    code,
    load: (filePath) => {
      const contents = readFileSync(filePath, "utf8");
      const browserName = filePath.replace(basePath, browserBasePath);
      if (filePath.endsWith("package.json")) {
        const parsed = JSON.parse(contents);
        assertSassResolvePackageJson(parsed);

        // can trim down the exports if needed
        lookup[browserName] = JSON.stringify({
          exports: parsed.exports,
          sass: parsed.sass,
          main: parsed.main,
        });
      } else {
        // can trim down the contents if needed. like removing comments
        lookup[browserName] = contents;
      }

      return contents;
    },
    basePath,
  });

  const contents = getBrowserFileContents(lookup, browserBasePath);
  if (browserOutFilePath) {
    writeFileSync(browserOutFilePath, contents, "utf8");
  }

  return { contents, lookup, basePath: browserBasePath };
}
