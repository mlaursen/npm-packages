"use client";

import {
  TooltippedButton,
  type TooltippedButtonProps,
} from "@react-md/core/button/TooltippedButton";
import { MaterialSymbol } from "@react-md/core/icon/MaterialSymbol";
import { type RequireAtLeastOne } from "@react-md/core/types";
import { type ReactElement } from "react";

const noop = (): void => {
  // do nothing
};

export interface CopyToClipboardProps extends TooltippedButtonProps {
  onCopied?: (text: string) => void;
  copyText?: string;
  getCopyText?: (button: HTMLButtonElement) => string;
}

export type CopyToClipboardStrictProps = RequireAtLeastOne<
  CopyToClipboardProps,
  "copyText" | "getCopyText"
>;

export function CopyToClipboard(
  props: Readonly<CopyToClipboardStrictProps>
): ReactElement {
  const {
    "aria-label": ariaLabel = "Copy",
    iconSize = "small",
    buttonType = "icon",
    children = <MaterialSymbol name="content_copy" />,
    tooltip = "Copy to clipboard",
    tooltipOptions,
    onCopied = noop,
    copyText = "",
    getCopyText = () => copyText,
    ...remaining
  } = props;

  return (
    <TooltippedButton
      {...remaining}
      aria-label={ariaLabel}
      iconSize={iconSize}
      buttonType={buttonType}
      tooltip={tooltip}
      tooltipOptions={{
        hoverTimeout: 0,
        defaultPosition: "left",
        ...tooltipOptions,
      }}
      onClick={async (event) => {
        const text = getCopyText(event.currentTarget);
        if (text) {
          await navigator.clipboard.writeText(text);
          onCopied(text);
        }
      }}
    >
      {children}
    </TooltippedButton>
  );
}
