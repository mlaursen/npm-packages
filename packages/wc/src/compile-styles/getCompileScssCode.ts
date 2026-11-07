import type { ConfigureScssOptions, CompileStylesOptions } from "./types.js";

interface Options
  extends Required<ConfigureScssOptions>, Pick<CompileStylesOptions, "code"> {}

/**
 * @internal
 */
export function getCompileScssCode({ code, ...options }: Options): string {
  if (code) {
    return typeof code === "string" ? code : code(options);
  }

  const { filePath, wcPath, configureFilePath, verifyTokens } = options;

  let verify = "";
  let configure = "";
  if (configureFilePath) {
    configure = `@use "${configureFilePath}";`;
  }
  if (verifyTokens) {
    verify = "@include wc.verify-tokens;";
  }

  return `
@use "${wcPath}" as wc;
${configure}

@use "${filePath}";

${verify}
`;
}
