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
  onCopyFailed?: (error: unknown) => void;

  /**
   * Either this or the {@link getCopyText} are required.
   *
   * @defaultValue `""`
   */
  copyText?: string;

  /**
   * Either this or the {@link copyText} are required.
   *
   * @defaultValue `() =>  ""`
   */
  getCopyText?: (button: HTMLButtonElement) => string;
}

export type CopyToClipboardStrictProps = RequireAtLeastOne<
  CopyToClipboardProps,
  "copyText" | "getCopyText"
>;

/**
 * @example Simple Example
 * ```tsx
 * <CopyToClipboard copyText="Here is some text to copy!" />
 *
 * <CopyToClipboard getCopyText={() => "Here is some text to copy!"} />
 * ```
 */
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
    onCopyFailed = noop,
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
        if (!text) {
          return;
        }

        try {
          await navigator.clipboard.writeText(text);
          onCopied(text);
        } catch (e) {
          onCopyFailed(e);
        }
      }}
    >
      {children}
    </TooltippedButton>
  );
}
