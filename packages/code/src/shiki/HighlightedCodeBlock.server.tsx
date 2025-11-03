import { type ReactElement } from "react";
import { codeToHtml } from "shiki";

import { CodeBlockScrollWrappers } from "../code-block/CodeBlockScrollWrappers.js";
import { DEFAULT_SHIKI_COLOR, DEFAULT_SHIKI_THEMES } from "./constants.js";
import { createShikiTransformers } from "./createShikiTransformers.js";
import type { HighlightedCodeBlockProps } from "./types.js";

export async function HighlightedCodeBlock(
  props: Readonly<HighlightedCodeBlockProps>
): Promise<ReactElement> {
  const {
    code,
    lang = "",
    themes = DEFAULT_SHIKI_THEMES,
    colorsRendering,
    cssVariablePrefix,
    defaultColor = DEFAULT_SHIKI_COLOR,
    transformers,
    lineWrap,
    preWrapperProps,
    ...remaining
  } = props;

  return (
    <CodeBlockScrollWrappers {...remaining}>
      <div
        {...preWrapperProps}
        dangerouslySetInnerHTML={{
          __html: await codeToHtml(code, {
            lang,
            themes,
            colorsRendering,
            cssVariablePrefix,
            defaultColor,
            transformers: createShikiTransformers({ lineWrap, transformers }),
          }),
        }}
      />
    </CodeBlockScrollWrappers>
  );
}
