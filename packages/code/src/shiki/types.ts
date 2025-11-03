import type { HTMLAttributes } from "react";
import type {
  BundledTheme,
  CodeOptionsMultipleThemes,
  TransformerOptions,
} from "shiki";

import type { ConfigurableCodeBlockScrollWrappersProps } from "../code-block/CodeBlockScrollWrappers.js";

export interface CodeHighlightOptions
  extends Partial<CodeOptionsMultipleThemes<BundledTheme>>,
    TransformerOptions {
  code: string;
  lang?: string;
  lineWrap?: boolean;
}

export interface HighlightedCodeBlockProps
  extends ConfigurableCodeBlockScrollWrappersProps,
    CodeHighlightOptions {
  /**
   * Shiki does not have a nice way to render to react elements without complex
   * hast traversals, so just do:
   *
   * ```tsx
   * <div {...preWrapperProps} dangerouslySetInnerHTML={{ __html: code }} />
   * ```
   */
  preWrapperProps?: Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "dangerouslySetInnerHTML"
  >;
}

export interface CodeHighlightState {
  html: string;
  highlighted: boolean;
  highlighting: boolean;
}
