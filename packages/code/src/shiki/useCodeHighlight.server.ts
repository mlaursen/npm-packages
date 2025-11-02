import type { CodeHighlightOptions, CodeHighlightState } from "./types.js";

export function useCodeHighlight(
  options: CodeHighlightOptions
): Readonly<CodeHighlightState> {
  return { html: options.code, highlighted: false, highlighting: false };
}
