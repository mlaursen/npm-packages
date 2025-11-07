import { type ReactElement } from "react";

import { CodeBlockScrollWrappers } from "../code-block/CodeBlockScrollWrappers.js";
import type { HighlightedCodeBlockProps } from "./types.js";
import { useCodeHighlight } from "./useCodeHighlight.client.js";

export function HighlightedCodeBlock(
  props: Readonly<HighlightedCodeBlockProps>
): ReactElement {
  const {
    code,
    lang,
    themes,
    colorsRendering,
    cssVariablePrefix,
    defaultColor,
    transformers,
    lineWrap,
    preWrapperProps,
    getInitialDangerousHtml,
    ...remaining
  } = props;

  const { html, highlighted, highlighting } = useCodeHighlight({
    code,
    lang,
    themes,
    colorsRendering,
    cssVariablePrefix,
    defaultColor,
    transformers,
    lineWrap,
    getInitialDangerousHtml,
  });

  // moved here so they can bypass the `data-*` is not an HTMLAttribute
  const attrs = {
    "data-highlighted": highlighted,
    "data-highlighting": highlighting,
  };

  return (
    <CodeBlockScrollWrappers {...remaining}>
      <div
        {...preWrapperProps}
        {...attrs}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </CodeBlockScrollWrappers>
  );
}
