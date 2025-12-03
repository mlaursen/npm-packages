import type { ShikiTransformer } from "shiki";

import {
  type CodeBlockPreLineWrapOptions,
  codeBlockPre,
} from "../code-block/styles.js";

const EMPTY_LIST = [] as const;

export interface CreateShikiTransformerOptions extends CodeBlockPreLineWrapOptions {
  transformers?: readonly ShikiTransformer[];
}

export function createShikiTransformers({
  lineWrap,
  transformers = EMPTY_LIST,
}: CreateShikiTransformerOptions): ShikiTransformer[] {
  return [
    {
      pre(element) {
        element.properties["dir"] = "ltr";
        this.addClassToHast(element, codeBlockPre({ lineWrap }));
      },
    },
    ...transformers,
  ];
}
