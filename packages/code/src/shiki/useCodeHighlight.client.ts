import { useEffect, useState } from "react";

import { DEFAULT_SHIKI_COLOR, DEFAULT_SHIKI_THEMES } from "./constants.js";
import { createShikiTransformers } from "./createShikiTransformers.js";
import { getInitialDangerousHtml as defaultGetInitialDangerousHtml } from "./getInitialDangerousHtml.js";
import type {
  CodeHighlightDangerousHtmlOptions,
  CodeHighlightState,
} from "./types.js";

export function useCodeHighlight(
  options: CodeHighlightDangerousHtmlOptions
): Readonly<CodeHighlightState> {
  const {
    code,
    lang = "",
    lineWrap,
    themes = DEFAULT_SHIKI_THEMES,
    colorsRendering,
    cssVariablePrefix,
    defaultColor = DEFAULT_SHIKI_COLOR,
    transformers,
    getInitialDangerousHtml = defaultGetInitialDangerousHtml,
  } = options;

  const [state, setState] = useState<CodeHighlightState>(() => ({
    html: getInitialDangerousHtml(options),
    highlighted: false,
    highlighting: false,
  }));
  useEffect(() => {
    let canceled = false;

    setState((prev) => ({ ...prev, highlighting: true }));
    async function update(): Promise<void> {
      const codeToHtml = await import("shiki/bundle/web").then(
        (mod) => mod.codeToHtml
      );
      const html = await codeToHtml(code, {
        lang,
        themes,
        defaultColor,
        colorsRendering,
        cssVariablePrefix,
        transformers: createShikiTransformers({
          lineWrap,
          transformers,
        }),
      });

      if (!canceled) {
        setState({
          html,
          highlighted: true,
          highlighting: false,
        });
      }
    }
    update();

    return () => {
      canceled = true;
    };
  }, [
    code,
    colorsRendering,
    cssVariablePrefix,
    defaultColor,
    lang,
    lineWrap,
    themes,
    transformers,
  ]);

  return state;
}
