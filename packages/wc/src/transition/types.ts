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

export interface AnimatedElementProperties {
  show(options?: BaseAnimateOptions): Promise<void>;
  close(options?: BaseAnimateOptions): Promise<void>;

  _opening: boolean;

  _isOpenable(): boolean;
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
   */
  _showElement(): void;
  _closeElement(): void;

  _getAnimations(options: AnimateOptions): AnimationList;

  _animate(options: AnimateOptions): Promise<void>;

  _onBeforeOpen(): void;
  _onOpenCanceled(): void;
  _onNotClosable(): void;
  _onNotConnectedClose(): void;
  _onBeforeClose(options: BaseAnimateOptions): void;
  _onCloseCanceled(): void;
}
