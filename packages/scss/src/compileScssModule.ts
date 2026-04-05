import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

import { type CompileScssOptions, compileScss } from "./compileScss.js";
import { GLOBAL_SCOPE, LOCAL_SCOPE } from "./constants.js";
import { getFakeCssModuleClassName } from "./utils.js";

export interface CompileScssModuleOptions extends CompileScssOptions {
  componentName: string;
}

/**
 * This can be used to create fake css modules from SCSS code which can be used
 * to create an SCSS editor in the browser.
 *
 * @see {@link compileScss} for setup around loading code in node or browser
 * environments
 */
export function compileScssModule(options: CompileScssModuleOptions): string {
  const { componentName, ...compileOptions } = options;
  const result = compileScss(compileOptions);
  const parsed = postcss.parse(result.css);
  const processor = selectorParser((root) => {
    let prevScope = LOCAL_SCOPE;
    root.walk((node) => {
      switch (node.type) {
        case "pseudo":
          if (node.value === LOCAL_SCOPE || node.value === GLOBAL_SCOPE) {
            prevScope = node.value;
            const { parent, nodes } = node;
            if (parent && nodes.length > 0) {
              for (const childNode of nodes) {
                // eslint-disable-next-line unicorn/prefer-modern-dom-apis
                parent.insertBefore(node, childNode);
              }
            }
            node.remove();
          }
          break;
        case "class":
          if (prevScope === LOCAL_SCOPE) {
            node.value = getFakeCssModuleClassName(componentName, node.value);
          }
          break;
      }
    });
  });

  parsed.walkRules((rule) => {
    processor.processSync(rule, {
      lossless: false,
      updateSelector: true,
    });
  });

  return parsed.toResult().css;
}
