import { constants, gzipSync } from "node:zlib";

export interface FilesizeOptions {
  /**
   * Set to `true` to use gzip size
   */
  gzip?: boolean | undefined;
}

/**
 * Used to get the size for a file's contents. Defaults to normal size but also
 * supports gzip.
 *
 * @example Simple Example
 * ```ts
 * import { readFile } from "node:fs/promises";
 * import { filesize } from "@mlaursen/node-utils";
 *
 * const contents = await readFile("README.md", "utf8");
 * console.log(`README.md is ${filesize(contents)} bytes`);
 * console.log(`README.md is ${filesize(contents, { gzip: true })} bytes when gzipped`);
 * ```
 *
 * @see {@link prettyFilesize} for formatting the bytes to human readable strings.
 */
export function filesize(
  contents: string,
  options: FilesizeOptions = {}
): number {
  const { gzip } = options;

  if (gzip) {
    return gzipSync(contents, { strategy: constants.Z_BEST_COMPRESSION })
      .byteLength;
  }

  return Buffer.byteLength(contents, "utf8");
}
