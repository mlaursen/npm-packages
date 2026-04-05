import prettyBytes, { type Options as PrettyBytesOptions } from "pretty-bytes";

import { type FilesizeOptions, filesize } from "./filesize.js";

export interface PrettyFilesizeOptions
  extends FilesizeOptions, PrettyBytesOptions {}

export function prettyFilesize(options: FilesizeOptions): string {
  const { gzip, contents, ...prettyOptions } = options;
  const size = filesize({ gzip, contents });
  return prettyBytes(size, prettyOptions);
}
