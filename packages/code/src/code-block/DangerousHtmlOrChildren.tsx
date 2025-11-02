import { type HTMLAttributes, type ReactElement } from "react";

export interface DangerousHtmlOrChildrenProps
  extends HTMLAttributes<HTMLPreElement | HTMLElement> {
  as: "pre" | "code" | "div";
}

export function DangerousHtmlOrChildren({
  as: Component,
  children,
  ...props
}: Readonly<DangerousHtmlOrChildrenProps>): ReactElement {
  if (props.dangerouslySetInnerHTML) {
    return <Component {...props} />;
  }

  return <Component {...props}>{children}</Component>;
}
