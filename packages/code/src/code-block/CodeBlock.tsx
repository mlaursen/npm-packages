import { type HTMLAttributes, type ReactElement, type ReactNode } from "react";

import {
  CodeBlockScrollWrappers,
  type ConfigurableCodeBlockScrollWrappersProps,
} from "./CodeBlockScrollWrappers.js";
import { type CodeBlockPreLineWrapOptions, codeBlockPre } from "./styles.js";

export interface CodeBlockConfigurableProps
  extends ConfigurableCodeBlockScrollWrappersProps,
    CodeBlockPreLineWrapOptions {
  preContainerProps?: HTMLAttributes<HTMLDivElement>;
  scrollContainerProps?: HTMLAttributes<HTMLDivElement>;

  /**
   * This is mostly used by the CodeEditor to render the textarea within the
   * scroll container
   */
  afterPreElement?: ReactNode;
}

export interface CodeBlockProps
  extends HTMLAttributes<HTMLDivElement>,
    CodeBlockConfigurableProps {
  preProps?: HTMLAttributes<HTMLPreElement>;

  /**
   * This should be the `<code>` content that has already been highlighted.
   */
  children: ReactElement;
}

/**
 * The `CodeBlock` component can be used to render code in a scrollable area
 * with elements fixed within that scrollable area.
 */
export function CodeBlock(props: CodeBlockProps): ReactElement {
  const { children, preProps, lineWrap, afterPreElement, ...remaining } = props;

  return (
    <CodeBlockScrollWrappers {...remaining}>
      <pre
        {...preProps}
        className={codeBlockPre({ className: preProps?.className, lineWrap })}
      >
        {children}
      </pre>
      {afterPreElement}
    </CodeBlockScrollWrappers>
  );
}
