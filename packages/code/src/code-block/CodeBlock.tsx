import { type HTMLAttributes, type ReactElement, type ReactNode } from "react";

import { DangerousHtmlOrChildren } from "./DangerousHtmlOrChildren.js";
import {
  codeBlock,
  codeBlockPre,
  codeBlockPreContainer,
  codeBlockScrollContainer,
} from "./styles.js";

declare module "react" {
  interface CSSProperties {
    "--code-margin"?: number | string;
    "--code-padding"?: number | string;
    "--code-max-height"?: number | string;
    "--code-tablet-max-height"?: number | string;
    "--code-pre-margin"?: number | string;
    "--code-pre-padding"?: number | string;
  }
}

export interface CodeBlockConfigurableProps {
  preContainerProps?: HTMLAttributes<HTMLDivElement>;
  preWrapperProps?: HTMLAttributes<HTMLDivElement>;
  scrollContainerProps?: HTMLAttributes<HTMLDivElement>;

  /**
   * This is mostly used by the CodeEditor to render the textarea within the
   * scroll container
   */
  afterPreElement?: ReactNode;

  /**
   * This should be enabled if the header or preview exists above the code
   * block.
   */
  disableMarginTop?: boolean;

  /**
   * This is mostly for the material icon/symbols copy/paste code. Allow line
   * wrapping there due to limited space and show all the code at once
   */
  lineWrap?: boolean;

  /**
   * Any children that should be fixed within the code block even after
   * scrolling the code. These elements should have `position: absolute`.
   */
  fixedChildren?: ReactNode;
}

export interface CodeBlockProps
  extends HTMLAttributes<HTMLDivElement>,
    CodeBlockConfigurableProps {
  preProps?: HTMLAttributes<HTMLPreElement>;

  /**
   * This should be the `<code>` content.
   */
  children?: ReactElement;
}

/**
 * The `CodeBlock` component can be used to render code in a scrollable area
 * with elements fixed within that scrollable area.
 */
export function CodeBlock(props: CodeBlockProps): ReactElement {
  const {
    children,
    preProps,
    className,
    lineWrap,
    preContainerProps,
    scrollContainerProps,
    afterPreElement,
    disableMarginTop,
    fixedChildren,
    preWrapperProps,
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
          <DangerousHtmlOrChildren as="div" {...preWrapperProps}>
            <pre
              {...preProps}
              className={codeBlockPre({ className, lineWrap })}
            >
              {children}
            </pre>
          </DangerousHtmlOrChildren>
          {afterPreElement}
        </div>
      </div>
      {fixedChildren}
    </div>
  );
}
