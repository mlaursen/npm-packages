import { AppBar, type AppBarProps } from "@react-md/core/app-bar/AppBar";
import {
  type AppBarHeight,
  type AppBarTheme,
} from "@react-md/core/app-bar/styles";
import { type ReactElement } from "react";

import { codeBlockAppBar } from "./styles.js";

export interface CodeBlockAppBarProps extends AppBarProps {
  /** @defaultValue "clear" */
  theme?: AppBarTheme;
  /** @defaultValue `"dense"` */
  height?: AppBarHeight;
}

/**
 * This is just a small wrapper around the {@link AppBar} with default styles
 */
export function CodeBlockAppBar(props: CodeBlockAppBarProps): ReactElement {
  const {
    theme = "clear",
    height = "dense",
    className,
    children,
    ...remaining
  } = props;

  return (
    <AppBar
      {...remaining}
      theme={theme}
      height={height}
      className={codeBlockAppBar({ className })}
    >
      {children}
    </AppBar>
  );
}
