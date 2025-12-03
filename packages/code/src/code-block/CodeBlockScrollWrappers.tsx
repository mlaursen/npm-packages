import { type HTMLAttributes, type ReactElement, type ReactNode } from "react";

import {
  type CodeBlockClassNameOptions,
  codeBlock,
  codeBlockPreContainer,
  codeBlockScrollContainer,
} from "./styles.js";

export interface ConfigurableCodeBlockScrollWrappersProps extends CodeBlockClassNameOptions {
  preContainerProps?: HTMLAttributes<HTMLDivElement>;
  scrollContainerProps?: HTMLAttributes<HTMLDivElement>;

  /**
   * Any children that should be fixed within the code block even after
   * scrolling the code. These elements should have `position: absolute`.
   */
  fixedChildren?: ReactNode;
}

export interface CodeBlockScrollWrappersProps
  extends
    HTMLAttributes<HTMLDivElement>,
    ConfigurableCodeBlockScrollWrappersProps {
  children: ReactNode;
}

/**
 * This is used to add children that can be fixed within a code block with
 * overflow. You are most likely looking for the `HighlightedCodeBlock` or
 * `CodeBlock` components instead though.
 *
 * @example Simple Example
 * ```tsx
 * <CodeBlockScrollWrappers fixedChildren={<CopyToClipboard copyText={code} />}>
 *   <div
 *     dangerouslySetInnerHTML={{
 *       __html: await codeToHtml(code, {
 *         lang: "tsx",
 *         transformers: [createShikiTransformers()],
 *       })
 *     }}
 *   />
 * </CodeBlockScrollWrappers>
 * ```
 *
 * @see `CodeBlock` for examples with highlight.js or prism.js
 */
export function CodeBlockScrollWrappers(
  props: Readonly<CodeBlockScrollWrappersProps>
): ReactElement {
  const {
    children,
    className,
    preContainerProps,
    scrollContainerProps,
    disableMarginTop,
    fixedChildren,
    ...remaining
  } = props;

  return (
    <div {...remaining} className={codeBlock({ className, disableMarginTop })}>
      <div
        {...scrollContainerProps}
        className={codeBlockScrollContainer(scrollContainerProps)}
      >
        <div
          {...preContainerProps}
          className={codeBlockPreContainer(preContainerProps)}
        >
          {children}
        </div>
      </div>
      {fixedChildren}
    </div>
  );
}
