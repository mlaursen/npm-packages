import {
  AppBarTitle,
  type AppBarTitleProps,
} from "@react-md/core/app-bar/AppBarTitle";
import { type ReactElement } from "react";

/**
 * This is a small wrapper around the {@link AppBarTitle} to display file names
 * for a code block.
 */
export function CodeBlockFileName(props: AppBarTitleProps): ReactElement {
  const { children, ...remaining } = props;

  return (
    <AppBarTitle type="subtitle-2" as="span" {...remaining}>
      {children}
    </AppBarTitle>
  );
}
