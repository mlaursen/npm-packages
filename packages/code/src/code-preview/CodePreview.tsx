import { Typography } from "@react-md/core/typography/Typography";
import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useId,
} from "react";

import {
  type CodePreviewClassNameOptions,
  codePreview,
  codePreviewError,
} from "./styles.js";

export interface CodePreviewProps
  extends CodePreviewClassNameOptions, HTMLAttributes<HTMLDivElement> {
  error?: ReactNode;
  errorProps?: HTMLAttributes<HTMLDivElement>;
}

export function CodePreview(props: CodePreviewProps): ReactElement {
  const {
    className,
    error,
    errorProps,
    disableBox,
    borderBottom,
    align,
    justify = "center",
    disableGap,
    disablePadding,
    disableWrap,
    fullWidth,
    grid,
    gridAutoRows,
    gridColumns,
    gridItemSize,
    gridName,
    reversed,
    stacked,
    children,
    ...remaining
  } = props;

  const id = useId();

  return (
    <div
      {...remaining}
      className={codePreview({
        borderBottom,
        disableBox,
        className,

        align,
        justify,
        disableGap,
        disablePadding,
        disableWrap,
        fullWidth,
        grid,
        gridAutoRows,
        gridColumns,
        gridItemSize,
        gridName,
        reversed,
        stacked,
      })}
    >
      {children}
      {error && (
        <div
          id={id}
          role="alert"
          {...errorProps}
          className={codePreviewError(errorProps)}
        >
          <Typography type="caption" as="p">
            {error}
          </Typography>
        </div>
      )}
    </div>
  );
}
