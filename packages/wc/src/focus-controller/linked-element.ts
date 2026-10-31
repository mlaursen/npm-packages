/**
 * This is used for the `FocusController` to create a linked list of available
 * elements to focus and traversing through those elements.
 */
export class LinkedElement {
  #element: HTMLElement;

  next: LinkedElement | null = null;
  prev: LinkedElement | null = null;

  constructor(element: HTMLElement) {
    this.#element = element;
  }

  get element(): HTMLElement {
    return this.#element;
  }
}
