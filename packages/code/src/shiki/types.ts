import type {
  BundledTheme,
  CodeOptionsMultipleThemes,
  TransformerOptions,
} from "shiki";

import type { CodeBlockConfigurableProps } from "../code-block/CodeBlock.js";

export interface CodeHighlightOptions
  extends Partial<CodeOptionsMultipleThemes<BundledTheme>>,
    TransformerOptions {
  code: string;
  lang?: string;
  lineWrap?: boolean;
}

export interface HighlightedCodeBlockProps
  extends CodeBlockConfigurableProps,
    CodeHighlightOptions {}

export interface CodeHighlightState {
  html: string;
  highlighted: boolean;
  highlighting: boolean;
}
