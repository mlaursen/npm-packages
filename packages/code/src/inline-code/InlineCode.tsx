import { type HTMLAttributes, type ReactElement } from "react";

import { type InlineCodeClassNameOptions, inlineCode } from "./styles.js";

export interface InlineCodeProps
  extends HTMLAttributes<HTMLElement>, InlineCodeClassNameOptions {
  as?: "kbd" | "code";
}

/**
 * This is used to render inline code that is surrounded by backticks.
 *
 * @example Simple Example
 * ```tsx
 * <InlineCode>pnpm add @mlaursen/code</InlineCode>
 * <InlineCode disableTicks>pnpm add @mlaursen/code</InlineCode>
 *
 * <InlineCode as="kbd">Enter</InlineCode>
 * <InlineCode as="kbd" disableTicks>Enter</InlineCode>
 * ```
 */
export function InlineCode(props: InlineCodeProps): ReactElement {
  const {
    as: Component = "code",
    className,
    disableTicks,
    ...remaining
  } = props;

  return (
    <Component
      {...remaining}
      className={inlineCode({ className, disableTicks })}
    />
  );
}
