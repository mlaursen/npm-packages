/**
 * Set this to `"roving"` when:
 * - there are a group of focusable elements that have a `tabIndex={-1}`
 * - the container element defaults to having a `tabIndex={0}`
 * - if the container is focused, it should no longer be included in the normal
 *   tab flow. Instead, the current focused element should be included instead
 *   by changing its `tabIndex` from `-1` to `0`
 *
 * Set this to `"virtual"` when:
 * - the container element should never lose focus
 * - the "focused" element only gains focus styles instead of being focused
 * - the container element specifies an `aria-activedescendant` pointing to one
 *   of the ids for the child "focusable" elements
 *
 * Set this to `"none"` when:
 * - every element sets their own tab index (generally `-1`). the active
 *   element is focused programmatically without updating the tab index
 */
export type TabIndexBehavior = "roving" | "virtual" | "none";

export interface FocusControllerOptions {
  /**
   * The default behavior for focusable items is that if the user tries to
   * focus the previous item while focusing the first or focuses the next item
   * while focusing the last item, focus does not change. Set this to `true`
   * to allow the focus to loop to the end / start.
   *
   * NOTE: Searching is
   *
   * @defaultValue `false`
   */
  loop?: boolean;

  /**
   * This should pretty much always be:
   *
```ts
isRTL: () => globalThis.getComputedStyle(this).direction === "rtl",
```
   */
  isRTL: () => boolean;

  /**
   * This should return `true` if the widget is horizontal instead of vertical
   * to update the keyboard activation keys.
   *
   * @defaultValue `() => false`
   */
  isHorizontal?: () => boolean;

  /**
   * This will probably change as I have more widgets that require custom
   * keyboard movement, but this should generally be something that traverses
   * the main slot for focusable elements.
   *
   * @example Main Example
```ts
@queryAssignedElements({ flatten: true })
items?: HTMLElement[];

#focusController: FocusController;
#getFocusableElements = (): readonly HTMLElement[] => {
  const elements: HTMLElement[] = [];
  for (const item of this.items ?? []) {
    if (isFocusable(item, true)) {
      elements.push(item);
    } else {
      const children = getFocusableElements({
        root: item,
        programmatic: true,
      });
      elements.push(...children);
    }
  }

  return elements;
};
```
   */
  getFocusableElements: () => readonly HTMLElement[];

  /**
   * @see {@link TabIndexBehavior}
   * @defaultValue `"none"`
   */
  tabIndexBehavior?: TabIndexBehavior;
}
