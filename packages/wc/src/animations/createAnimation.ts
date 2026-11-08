import type {
  AnimateElementArgs,
  CreateAnimationOptions,
  KeyframeDescriptor,
  OneOrManyKeyframeDescriptors,
} from "./types.js";

/**
 * This is a helper to create component animations for the animate mixins in a
 * more readable form. There are also built-in common animations like `fade`,
 * `slide`, and `scale` that can be used instead.
 *
 * @example Custom Animation
```ts
const animations = {
  host: [
    // this is basically the `fade` animation
    createAnimation({
      from: { opacity: 0 },
      to: { opacity: 0.32 },
      duration: Duration.Short3,
      pseudo: "::backdrop",
    }),
    createAnimation({
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay: Duration.Short1,
      duration: Duration.Short3,
    }),

    // this is basically the `scale` animation
    createAnimation({
      from: { transform: "scale(0)" },
      to: { transform: "scale(1)" },
      duration: Duration.Medium2,
      easing: Easing.Emphasized,
    }),
  ],
} as const satisfies AnimateElementMap;
```
 */
export function createAnimation<
  From = OneOrManyKeyframeDescriptors,
  To = KeyframeDescriptor,
>(options: CreateAnimationOptions<From, To>): AnimateElementArgs {
  const { pseudoElement: pseudo, from, to, ...timing } = options;

  return [
    [...(Array.isArray(from) ? from : [from]), to],
    { ...timing, pseudoElement: pseudo },
  ];
}
