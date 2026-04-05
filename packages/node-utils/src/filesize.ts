import { constants, gzipSync } from "node:zlib";

export interface FilesizeOptions {
  gzip?: boolean | undefined;
  contents: string;
}

export function filesize(options: FilesizeOptions): number {
  const { gzip, contents } = options;

  if (gzip) {
    return gzipSync(contents, { strategy: constants.Z_BEST_COMPRESSION })
      .byteLength;
  }

  return Buffer.byteLength(contents, "utf8");
}
