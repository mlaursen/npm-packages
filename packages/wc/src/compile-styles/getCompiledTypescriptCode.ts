import type { CompileStylesOutput, CompileStylesResult } from "./types.js";

interface Options extends CompileStylesResult {
  output: CompileStylesOutput;
}

/**
 * @internal
 */
export function getCompiledTypescriptCode(options: Options): string {
  const { output, production, development } = options;

  let contents: string;
  if (output === "minified") {
    contents = `export default css\`${production}\`;`;
  } else {
    contents = `export default process.env.NODE_ENV === "production"
  ? css\`${production}\`
  : css\`${development}\`;
`;
  }

  return `import { css } from "lit";
${contents}
`;
}
