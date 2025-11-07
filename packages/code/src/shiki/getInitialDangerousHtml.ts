import { cnb } from "cnbuilder";

import { codeBlockPre } from "../code-block/styles.js";
import { DEFAULT_SHIKI_THEMES } from "./constants.js";
import type {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CodeHighlightDangerousHtmlOptions,
  CodeHighlightOptions,
} from "./types.js";

/**
 * @see {@link CodeHighlightDangerousHtmlOptions.getInitialDangerousHtml}
 */
export function getInitialDangerousHtml(
  options: Readonly<CodeHighlightOptions>
): string {
  const { code, themes = DEFAULT_SHIKI_THEMES, lineWrap } = options;

  const themeKeys = Object.keys(themes);
  const className = cnb(
    "shiki",
    themeKeys.length > 0 && "shiki-themes",
    themeKeys.join(" "),
    codeBlockPre({ lineWrap })
  );
  return `<pre class="${className}" tabindex="0"><code>${code}</code></pre>`;
}
