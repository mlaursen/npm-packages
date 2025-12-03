import type { HTMLAttributes } from "react";
import type {
  BundledTheme,
  CodeOptionsMultipleThemes,
  TransformerOptions,
} from "shiki";

import type { ConfigurableCodeBlockScrollWrappersProps } from "../code-block/CodeBlockScrollWrappers.js";
import type { CodeBlockPreLineWrapOptions } from "../code-block/styles.js";

export interface CodeHighlightOptions
  extends
    Partial<CodeOptionsMultipleThemes<BundledTheme>>,
    CodeBlockPreLineWrapOptions,
    TransformerOptions {
  code: string;

  /**
   * The current code language. This should be one of the available `shiki`
   * languages or else the highlighting will throw an error.
   *
   * @defaultValue `""`
   */
  lang?: string;
}

export interface CodeHighlightDangerousHtmlOptions extends CodeHighlightOptions {
  /**
   * This function is used to generate the initial HTML when using client side
   * highlighting with shiki. This should generally just return something
   * _close_ to what shiki would do if it were synchronous instead of async.
   *
   * The default implementation just applies the class names to prevent layout
   * shifting while waiting for the code to be highlighted.
   *
   * @defaultValue `&lt;pre class="shiki shiki-themes code-block__pre" tabindex="0"&gt;&lt;code&gt;{code}&lt;/code&gt;&lt;/pre&gt;`
   */
  getInitialDangerousHtml?: (options: Readonly<CodeHighlightOptions>) => string;
}

export interface HighlightedCodeBlockProps
  extends
    ConfigurableCodeBlockScrollWrappersProps,
    CodeHighlightDangerousHtmlOptions {
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
