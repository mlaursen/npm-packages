import { type ReactElement } from "react";

import { CodeBlock } from "../code-block/CodeBlock.js";
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
  });

  // moved here so they can bypass the `data-*` is not an HTMLAttribute
  const attrs = {
    "data-highlighted": highlighted,
    "data-highlighting": highlighting,
  };

  return (
    <CodeBlock
      {...remaining}
      preWrapperProps={{
        ...props.preWrapperProps,
        ...attrs,
        dangerouslySetInnerHTML: { __html: html },
      }}
    />
  );
}
