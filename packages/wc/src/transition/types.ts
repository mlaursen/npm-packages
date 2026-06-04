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
