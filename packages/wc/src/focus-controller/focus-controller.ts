import { FocusKey } from "./constants.js";
import { LinkedElement } from "./linked-element.js";
import type { FocusControllerOptions, TabIndexBehavior } from "./types.js";

/**
 * This is used to handle focus behavior in complex widgets. This is only
 * supporting menus at this time and will need to be updated to support
 * additional behavior like virtual tab
 */
export class FocusController {
  #loop = false;
  #current: LinkedElement | null = null;
  #previousFocus: HTMLElement | null = null;

  #isRTL: () => boolean;
  #isHorizontal: () => boolean;
  #tabIndexBehavior: TabIndexBehavior;
  #getFocusableElements: () => readonly HTMLElement[];

  constructor(options: FocusControllerOptions) {
    this.#loop = options.loop ?? false;
    this.#isRTL = options.isRTL;
    this.#isHorizontal = options.isHorizontal ?? (() => false);
    this.#tabIndexBehavior = options.tabIndexBehavior ?? "none";
    this.#getFocusableElements = options.getFocusableElements;

    if (this.#tabIndexBehavior !== "none") {
      throw new Error(
        `${this.#tabIndexBehavior} tab index behavior not yet implemented`,
      );
    }
  }

  #append = (element: HTMLElement): void => {
    const node = new LinkedElement(element);
    if (!this.#current) {
      this.#current = node;
      return;
    }

    let tail = this.#current;
    while (tail.next) {
      tail = tail.next;
    }

    tail.next = node;
    node.prev = tail;
  };

  #goToFirst = (): void => {
    while (this.#current?.prev) {
      this.#current = this.#current.prev;
    }
  };

  #goToNext = (): void => {
    const next = this.#current?.next;
    if (next) {
      this.#current = next;
    } else if (this.#loop) {
      this.#goToLast();
    }
  };

  #goToPrev = (): void => {
    const prev = this.#current?.prev;
    if (prev) {
      this.#current = prev;
    } else if (this.#loop) {
      this.#goToFirst();
    }
  };

  #goToLast = (): void => {
    while (this.#current?.next) {
      this.#current = this.#current.next;
    }
  };

  #isSearchableEvent = (event: KeyboardEvent): boolean => {
    const { key, altKey, ctrlKey, metaKey } = event;

    return (
      key.length === 1 &&
      // can't search with space since it is generally a click event
      key !== " " &&
      !altKey &&
      !ctrlKey &&
      !metaKey
    );
  };

  #getSearchText = (element: HTMLElement): string => {
    const cloned = element.cloneNode(true) as HTMLElement;

    const invisibleElements = cloned.querySelectorAll(
      "mwc-material-symbol,mwc-svg-icon,[aria-hidden=true],[hidden],[role=presentation]",
    );
    for (const element of invisibleElements) {
      element.remove();
    }

    // Note: It would be good to use `cloned.innerText` (maybe?) at some point,
    // but it returns `undefined` in jsdom. It also does cause a reflow, so maybe
    // this is fine?
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext
    return (cloned.textContent || "").trim().slice(0, 1).toUpperCase();
  };

  capturePreviousFocus = (): void => {
    this.#previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
  };

  refocusPreviousFocus = (): void => {
    this.#previousFocus?.focus();
    this.#previousFocus = null;
  };

  rebuild = (maintainCurrent = false): void => {
    let current: LinkedElement | null = null;
    let currentElement = maintainCurrent ? this.#current?.element : null;
    this.#current = null;
    for (const element of this.#getFocusableElements()) {
      this.#append(element);
      if (element === currentElement) {
        current = this.#current;
      }
    }

    if (currentElement) {
      this.#current = current;
    }
  };

  focus = (): void => {
    this.#current?.element?.focus();
  };

  focusFirst = (): void => {
    this.#goToFirst();
    this.focus();
  };

  focusNext = (): void => {
    this.#goToNext();
    this.focus();
  };

  focusPrev = (): void => {
    this.#goToPrev();
    this.focus();
  };

  focusLast = (): void => {
    this.#goToLast();
    this.focus();
  };

  searchForward = (value: string, matchFirst: boolean): boolean => {
    let match: LinkedElement | null = null;
    while (this.#current?.next) {
      this.#current = this.#current.next;
      const text = this.#getSearchText(this.#current.element);
      const matches = text.startsWith(value);
      if (matchFirst && matches) {
        return true;
      }

      if (matches) {
        match = this.#current;
      }
    }

    this.#current = match;
    return !!match;
  };

  searchBackward = (value: string, matchFirst: boolean): boolean => {
    let match: LinkedElement | null = null;
    while (this.#current?.prev) {
      this.#current = this.#current.prev;
      const text = this.#getSearchText(this.#current.element);
      const matches = text.startsWith(value);
      if (matchFirst && matches) {
        return true;
      }

      if (matches) {
        match = this.#current;
      }
    }

    this.#current = match;
    return !!match;
  };

  search = (term: string, reversed: boolean): void => {
    const value = term.trim().toUpperCase();
    const start = this.#current;
    if (!start || !value) {
      return;
    }

    const searches = reversed
      ? [this.searchBackward, this.searchForward]
      : [this.searchForward, this.searchBackward];
    for (const [i, search] of searches.entries()) {
      const found = search(value, i === 0);
      if (found) {
        break;
      }

      this.#current = start;
    }

    this.focus();
  };

  handleKeyDown = (event: KeyboardEvent): void => {
    if (this.#isSearchableEvent(event)) {
      event.preventDefault();
      this.search(event.key, event.shiftKey);
      return;
    }

    const match = FocusKey[event.key as FocusKey];
    if (!match) {
      return;
    }

    event.preventDefault();

    if (this.#isHorizontal()) {
      const isRTL = this.#isRTL();
      const inlineNext = isRTL ? FocusKey.ArrowLeft : FocusKey.ArrowRight;
      const inlinePrev = isRTL ? FocusKey.ArrowRight : FocusKey.ArrowLeft;

      if (match === inlineNext) {
        this.focusNext();
        return;
      }
      if (match === inlinePrev) {
        this.focusPrev();
        return;
      }
    }

    switch (match) {
      case "ArrowUp":
        this.focusPrev();
        break;
      case "ArrowDown":
        this.focusNext();
        break;
      case "Home":
        this.focusFirst();
        break;
      case "End":
        this.focusLast();
        break;
    }
  };
}
