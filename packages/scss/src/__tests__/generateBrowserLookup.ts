import { readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

import packageJson from "../../../wc/package.json" with { type: "json" };
import {
  generateBrowserLookup,
  type GenerateBrowserLookupResult,
} from "../generateBrowserLookup.js";

const basePath = "/home/example";
const FILES: Record<string, string> = {
  [`${basePath}/_index.scss`]: "@use 'everything';",
  [`${basePath}/_everything.scss`]: `
@use "sass:math";
@use "@mlaursen/wc";
`,
  [`${basePath}/node_modules/@mlaursen/wc/package.json`]:
    JSON.stringify(packageJson),
  [`${basePath}/node_modules/@mlaursen/wc/dist/_index.scss`]: `
.fake-css {}
`,
};

vi.mock("node:fs");

vi.mocked(readFileSync).mockImplementation((filePath) => {
  if (typeof filePath !== "string") {
    throw new TypeError("must be string filePath");
  }

  const contents = FILES[filePath];
  if (!contents) {
    throw new Error(`${filePath} does not exist`);
  }

  return contents;
});

describe("generateBrowserLookup", () => {
  it("should be able to generate an example lookup", () => {
    const result = generateBrowserLookup({
      code: "@use './index';",
      basePath,
    });
    const lookup: Record<string, string> = {
      [`/__home__/_everything.scss`]: `
@use "sass:math";
@use "@mlaursen/wc";
`,
      [`/__home__/node_modules/@mlaursen/wc/dist/_index.scss`]: `
.fake-css {}
`,
      [`/__home__/_index.scss`]: "@use 'everything';",
      [`/__home__/node_modules/@mlaursen/wc/package.json`]: JSON.stringify({
        exports: packageJson.exports,
      }),
    };
    expect(result).toEqual({
      lookup,
      basePath: "/__home__",
      contents: expect.any(String),
    } satisfies GenerateBrowserLookupResult);
    expect(result.contents)
      .toBe(`export const SCSS_LOOKUP: Readonly<Record<string, string>> = {"/__home__/_index.scss":"@use 'everything';","/__home__/_everything.scss":"\\n@use \\"sass:math\\";\\n@use \\"@mlaursen/wc\\";\\n","/__home__/node_modules/@mlaursen/wc/package.json":"{\\"exports\\":{\\".\\":{\\"sass\\":\\"./dist/_index.scss\\",\\"default\\":\\"./dist/index.js\\"},\\"./define\\":\\"./dist/define.js\\",\\"./*/define\\":\\"./dist/*/define.js\\",\\"./standalone\\":\\"./dist/standalone.js\\",\\"./package.json\\":\\"./package.json\\"}}","/__home__/node_modules/@mlaursen/wc/dist/_index.scss":"\\n.fake-css {}\\n"};
export const BASE_PATH = "/__home__";

export const loadFromScssLookup = (filePath: string): string => {
  const contents = SCSS_LOOKUP[filePath];
  if (!contents) {
    throw new Error(\`File not found: \${filePath}\`);
  }

  return contents;
};
`);
  });
});
