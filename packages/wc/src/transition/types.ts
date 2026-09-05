export type AnimateElementArgs = Parameters<Element["animate"]>;

export type AnimateElementMap<K extends string = string> = Partial<
  Record<K, readonly AnimateElementArgs[]>
>;

export type GetAnimationMap<T extends AnimateElementMap = AnimateElementMap> =
  () => T;

export interface BaseAnimateOptions<
  T extends AnimateElementMap = AnimateElementMap,
> {
  animate?: boolean | (() => Readonly<T>);
}

export interface AnimateOptions<
  T extends AnimateElementMap = AnimateElementMap,
> extends BaseAnimateOptions<T> {
  opening: boolean;
}

export type MaybeAnimatedElement = HTMLElement | null | undefined | false;
export type AnimationList = readonly [
  element: MaybeAnimatedElement | MaybeAnimatedElement[],
  animations: readonly AnimateElementArgs[] | undefined,
][];

export interface BaseAnimatedElementProperties {
  /**
   * This is a protected property that can be used to check if the animated
   * element has been updated at least once. The main use-case is if a
   * component should only animate after the first change and not initial
   * render.
   *
   * @sealed
   */
  _initialized: boolean;

  /**
   * This function should be overridden in the custom element that should
   * animate by providing the valid animation list.
   *
   * @virtual
   */
  _getAnimations(options: BaseAnimateOptions): AnimationList;

  /**
   * This is a protected function that handles animating the element. It will
   * resolve once all animations have completed or have been aborted.
   *
   * This can be overridden to redefine the `options` parameter but should
   * always call `super._animate(options)`.
   *
   * @virtual
   */
  _animate(options: BaseAnimateOptions): Promise<void>;
}

/**
 * @fires {Event} open - Fired before the show animation occurs and can be used
 * to cancel opening the element by calling `event.preventDefault()`.
 * @fires {Event} opened - Fired once the element has opened and the animations
 * have completed.
 * @fires {Event} close - Fired before the hide animation occurs and can be
 * used to cancel closing the element by calling `event.preventDefault()`.
 * @fires {Event} closed - Fired once the element has closed and the animations
 * have completed.
 */
export interface AnimatedElementProperties extends BaseAnimatedElementProperties {
  /**
   * @see BaseAnimatedElementProperties._getAnimations
   * @override
   */
  _getAnimations(options: AnimateOptions): AnimationList;

  /**
   * @see BaseAnimatedElementProperties._animate
   * @override
   */
  _animate(options: AnimateOptions): Promise<void>;

  /**
   * Public API to show the animated element and will resolve once the
   * animations have completed:
   *
   * @example
```ts
const element = document.querySelector("my-custom-element");
await element.show();
```
   *
   * @sealed
   */
  show(options?: BaseAnimateOptions): Promise<void>;

  /**
   * Public API to close the animated element and will resolve once the
   * animations have completed:
   *
   * @example
```ts
const element = document.querySelector("my-custom-element");
await element.close();
```
   *
   * @sealed
   */
  close(options?: BaseAnimateOptions): Promise<void>;

  /**
   * This can be used to prevent opening/showing an element. The default
   * implementation always returns `true`.
   *
   * @virtual
   */
  _isOpenable(): boolean;

  /**
   * This can be used to prevent closing/hiding an element. The default
   * implementation always returns `true`.
   *
   * @virtual
   */
  _isClosable(): boolean;

  /**
   * This is called before the animation begins and should generally do
   * something like:
   *
   * ```ts
   * dialog.showModal();
   * popover.showPopover();
   * ...etc
   * ```
   *
   * Any additional setup like scrolling, setting properties, focusing elements,
   * etc should be called here.
   *
   * This will be called after the `"open"` event has been fired and was not canceled.
   *
   * @virtual
   */
  _showElement(): void;

  /**
   * This is called before the animation begins and should generally do
   * something like:
   *
   * ```ts
   * popover.hidePopover();
   * ```
   *
   * @virtual
   */
  _closeElement(): void;

  /**
   * An optional callback that will be fired before triggering the `"open"`
   * event.
   *
   * @virtual
   */
  _onBeforeOpen(): void;

  /**
   * An optional callback that will be fired if the `"open"` event was
   * canceled.
   *
   * @virtual
   */
  _onOpenCanceled(): void;

  /**
   * An optional callback that will be fired when {@link close} is called
   * before the element has connected in the DOM.
   *
   * @virtual
   */
  _onNotConnectedClose(): void;

  /**
   * An optional callback that is fired when {@link close} is called but cannot
   * be closed since it is not open or {@link _isClosable} returned `false`.
   *
   * @virtual
   */
  _onNotClosable(): void;

  /**
   * An optional callback that will be fired before triggering the `"close"`
   * event.
   *
   * @virtual
   */
  _onBeforeClose(options: BaseAnimateOptions): void;

  /**
   * An optional callback that will be fired if the `"close"` event was
   * canceled.
   *
   * @virtual
   */
  _onCloseCanceled(): void;
}
