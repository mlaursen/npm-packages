import prettyBytes, { type Options as PrettyBytesOptions } from "pretty-bytes";

import { type FilesizeOptions, filesize } from "./filesize.js";

export interface PrettyFilesizeOptions
  extends FilesizeOptions, PrettyBytesOptions {}

/**
 * Used to convert bytes to a human readable string.
 *
 * @example Simple Example
 * ```ts
 * import { readFile } from "node:fs/promises";
 * import { prettyFilesize } from "@mlaursen/node-utils";
 *
 * const contents = await readFile("README.md", "utf8");
 * console.log(`README.md is ${prettyFilesize(contents)}`);
 * console.log(`README.md is ${prettyFilesize(contents, { gzip: true })} when gzipped`);
 * ```
 */
export function prettyFilesize(
  contents: string,
  options: FilesizeOptions = {},
): string {
  const { gzip, ...prettyOptions } = options;

  const size = filesize(contents, { gzip });
  return prettyBytes(size, prettyOptions);
}
