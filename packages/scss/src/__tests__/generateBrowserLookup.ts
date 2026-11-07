import { readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

import packageJson from "../../../wc/package.json" with { type: "json" };
import {
  generateBrowserLookup,
  type GenerateBrowserLookupResult,
} from "../generateBrowserLookup.js";
import { getBrowserFileContents } from "../getBrowserFileContents.js";

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
      contents: getBrowserFileContents(lookup, "/__home__"),
    } satisfies GenerateBrowserLookupResult);
  });
});
