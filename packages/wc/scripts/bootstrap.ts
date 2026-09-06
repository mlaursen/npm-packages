import { readFile } from "node:fs/promises";

import { input } from "@inquirer/prompts";
import { generateFile } from "@mlaursen/node-utils";
import { alphaNumericSort, pascalCase } from "@mlaursen/utils";

const ROOT_INDEX_FILE = "src/index.ts";
const ROOT_DEFINE_FILE = "src/define.ts";
const ROOT_CONFIGURE_FILE = "src/_configure.scss";
const ROOT_STYLES_FILE = "src/_styles.scss";

const STYLES_FILE_CONTENTS = `@use "./index" as *;

@include styles;
`;

interface ComponentNames {
  kebabName: string;
  pascalName: string;
}

interface UpdateTypescriptFileOptions extends ComponentNames {
  type: "index" | "define";
}

async function updateTypescriptFile({
  type,
  kebabName,
}: UpdateTypescriptFileOptions): Promise<void> {
  const filePath = type === "index" ? ROOT_INDEX_FILE : ROOT_DEFINE_FILE;
  const contents = await readFile(filePath, "utf8");
  const lines = contents.split("\n");
  if (type === "index") {
    lines.push(
      `export * from "./${kebabName}/${kebabName}.js";`,
      `export * from "./${kebabName}/types.js"`,
    );
  } else {
    lines.push(`import "./${kebabName}/define.js"`);
  }

  await generateFile({
    banner: false,
    contents: alphaNumericSort(lines).join("\n"),
    filePath,
  });
}

function getComponentContents({
  kebabName,
  pascalName,
}: ComponentNames): string {
  return `import { LitElement, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";

import styles from "./${kebabName}-styles.js";
import type { ${pascalName}Properties } from "./types.js";

export class ${pascalName} extends LitElement implements ${pascalName}Properties {
  static override styles = styles;

  override render(): TemplateResult {
    return html\`<slot></slot>\`;
  }
}
`;
}

function getTypesFile({ pascalName }: ComponentNames): string {
  return `import type { OverridableStringUnion } from "@mlaursen/utils";

export interface ${pascalName}ExampleOverrides {}
export type Default${pascalName}Example = "a" | "b";
export type ${pascalName}Example = OverridableStringUnion<Default${pascalName}Example, ${pascalName}ExampleOverrides>;

export interface ${pascalName}Properties {
  //
}
`;
}

function getDefineFile({ kebabName, pascalName }: ComponentNames): string {
  return `import { safeDefine } from "../utils/safeDefine.js";
import { ${pascalName} } from "./${kebabName}.js";

safeDefine("mwc-${kebabName}", ${pascalName});

declare global {
  interface HTMLElementTagNameMap {
    "mwc-${kebabName}": ${pascalName};
  }
}
`;
}

interface UpdateScssFileOptions extends ComponentNames {
  type: "configure" | "styles";
}

async function updateScssFile({
  type,
  kebabName,
}: UpdateScssFileOptions): Promise<void> {
  const filePath = type === "styles" ? ROOT_STYLES_FILE : ROOT_CONFIGURE_FILE;
  const contents = await readFile(filePath, "utf8");

  const lines = contents.split("\n");
  const lastUseStatementIndex = lines.findLastIndex((line) =>
    line.startsWith("@use"),
  );
  if (lastUseStatementIndex === -1) {
    throw new Error("Unable to find last @use statement");
  }

  const useStatementLines = lines.slice(0, lastUseStatementIndex + 1);
  useStatementLines.push(`@use "${kebabName}";`);

  const remainingLines = lines.slice(lastUseStatementIndex + 1);
  if (type === "configure") {
    const lastConfigureArgIndex = remainingLines.findIndex((line) =>
      line.endsWith("null"),
    );
    if (lastConfigureArgIndex === -1) {
      throw new Error("Unable to find the last configure arg");
    }

    const lastArgWithComma = remainingLines[lastConfigureArgIndex] + ",";
    remainingLines.splice(
      lastConfigureArgIndex,
      1,
      lastArgWithComma,
      `$${kebabName}: null`,
    );
  }

  const lastIncludeLineIndex = remainingLines.findLastIndex((line) =>
    /^\s+@include/.test(line),
  );

  if (lastIncludeLineIndex === -1) {
    throw new Error("Unable to find last @include line");
  }

  const mixin =
    type === "styles" ? "styles" : `configure-global($${kebabName})`;
  remainingLines.splice(
    lastIncludeLineIndex + 1,
    0,
    `  @include ${kebabName}.${mixin};`,
  );

  await generateFile({
    banner: false,
    contents: [...useStatementLines, ...remainingLines].join("\n"),
    filePath,
  });
}

function getIndexScssContents({ kebabName }: ComponentNames): string {
  return `@use "sass:map";

@use "../utils";

$-tokens-registered: false;
$-tokens: (
  // added so it doesn't crash
  example: null,
);

$-configure-tokens: map.keys($-tokens);

$-base-styles: (
);

@mixin configure() {
  @if not $-tokens-registered {
    $-tokens-registered: true !global;
    @include utils.register-tokens($tokens: $-tokens, $prefix: "${kebabName}");
  }
}

@mixin configure-global($overrides: null) {
  $overrides: utils.get-config-map(list, $overrides, $-configure-tokens);
  @include configure();
}

@mixin css-styles {
  $styles: ();
  @include utils.css-styles($styles);
}

@mixin host-styles {
  $styles: ();
  @include utils.host-styles($styles);
}

@mixin styles {
  @include css-styles;
  @include host-styles;
}
`;
}

const kebabName = await input({
  message: "Input the component name (should be kebab-cased)",
  pattern: /^[a-z-]+$/,
  required: true,
});
const pascalName = pascalCase(kebabName);
const names: ComponentNames = {
  kebabName,
  pascalName,
};

const srcFolder = `src/${kebabName}`;

await Promise.all([
  updateTypescriptFile({ type: "index", ...names }),
  updateTypescriptFile({ type: "define", ...names }),
  generateFile({
    banner: false,
    contents: getComponentContents(names),
    filePath: `${srcFolder}/${kebabName}.ts`,
  }),
  generateFile({
    banner: false,
    contents: getTypesFile(names),
    filePath: `${srcFolder}/types.ts`,
  }),
  generateFile({
    banner: false,
    contents: getDefineFile(names),
    filePath: `${srcFolder}/define.ts`,
  }),

  updateScssFile({ type: "styles", ...names }),
  updateScssFile({ type: "configure", ...names }),
  generateFile({
    banner: false,
    contents: STYLES_FILE_CONTENTS,
    filePath: `${srcFolder}/${kebabName}.scss`,
  }),
  generateFile({
    banner: false,
    contents: getIndexScssContents(names),
    filePath: `${srcFolder}/_index.scss`,
  }),
]);
