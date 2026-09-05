import type { LitElement } from "lit";

import type { ElementWithInternalsProperties } from "../internals-mixin/types.js";
import type { LitConstructor } from "../types.js";

export type AriaRole =
  | "alert"
  | "alertdialog"
  | "application"
  | "article"
  | "banner"
  | "blockquote"
  | "button"
  | "caption"
  | "cell"
  | "checkbox"
  | "code"
  | "columnheader"
  | "combobox"
  | "complementary"
  | "contentinfo"
  | "definition"
  | "deletion"
  | "dialog"
  | "directory"
  | "document"
  | "emphasis"
  | "feed"
  | "figure"
  | "form"
  | "generic"
  | "grid"
  | "gridcell"
  | "group"
  | "heading"
  | "img"
  | "insertion"
  | "link"
  | "list"
  | "listbox"
  | "listitem"
  | "log"
  | "main"
  | "mark"
  | "marquee"
  | "math"
  | "menu"
  | "menubar"
  | "menuitem"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "meter"
  | "navigation"
  | "none"
  | "note"
  | "option"
  | "paragraph"
  | "presentation"
  | "progressbar"
  | "radio"
  | "radiogroup"
  | "region"
  | "row"
  | "rowgroup"
  | "rowheader"
  | "scrollbar"
  | "search"
  | "searchbox"
  | "separator"
  | "slider"
  | "spinbutton"
  | "status"
  | "strong"
  | "subscript"
  | "superscript"
  | "switch"
  | "tab"
  | "table"
  | "tablist"
  | "tabpanel"
  | "term"
  | "textbox"
  | "time"
  | "timer"
  | "toolbar"
  | "tooltip"
  | "tree"
  | "treegrid"
  | "treeitem";

export interface AriaMixinProperties extends ElementWithInternalsProperties {
  /**
   * The current aria role set to the element.
   */
  role: AriaRole;

  /**
   * Public helper to determine if an element is considered disabled via aria
   * role behavior.
   *
   * Override this function if the click and keyboard events should be
   * prevented due to disabled states that are not one of these two.
   *
   * @return `true` if `disabled` or `aria-disabled === "true"`
   */
  isDisabled(): boolean;

  /**
   * Public helper that prevents default behavior and stops propagation if
   * {@link isDisabled}.
   */
  handleClick(event: MouseEvent): void;

  /**
   * Public helper that triggers click events for elements when not
   * {@link isDisabled} and the `Enter` or `Space` key has been pressed
   */
  handleKeyDown(event: KeyboardEvent): void;
}

export type LitElementWithAriaProperties<T = LitElement> = T &
  LitConstructor<AriaMixinProperties>;
