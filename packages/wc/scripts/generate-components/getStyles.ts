import { type CreateStylesOutput } from "./types.js";

export interface GetStylesOptions {
  output: CreateStylesOutput;
  development: string;
  production: string;
}

export function getStyles(options: GetStylesOptions): string {
  const { output, development, production } = options;

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
