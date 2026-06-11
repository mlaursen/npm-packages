import { Duration, Easing } from "../transition/constants.js";
import type { AnimateElementArgs, AnimationList } from "../transition/types.js";
import { type Point } from "../types.js";
import {
  RIPPLE_INITIAL_SCALE,
  RIPPLE_PADDING,
  RIPPLE_SOFT_EDGE_MIN_SIZE,
  RIPPLE_SOFT_EDGE_RATIO,
} from "./constants.js";
import { type RippleAnimateOptions } from "./types.js";

export function isTouchEvent(event: PointerEvent): boolean {
  return event.pointerType === "touch";
}

export interface ActionableEventOptions {
  event: Event;
  disabled: boolean;
  startEvent?: PointerEvent;
}

export function isActionableEvent(options: ActionableEventOptions): boolean {
  const { event, disabled, startEvent } = options;
  if (
    disabled ||
    !(event instanceof PointerEvent) ||
    !event.isPrimary ||
    (startEvent ?? event).pointerId !== event.pointerId
  ) {
    return false;
  }

  if (event.type === "pointerenter" || event.type === "pointerleave") {
    return !isTouchEvent(event);
  }

  return isTouchEvent(event) || event.buttons === 1;
}

export interface GetRippleAnimateOptions {
  event?: Event;
  rect: Readonly<DOMRect>;
  zoom: number;
}

export function getRippleAnimateOptions(
  options: GetRippleAnimateOptions,
): Readonly<RippleAnimateOptions> {
  const { event, rect, zoom } = options;
  const { height, width, top, left } = rect;

  const maxDimension = Math.max(height, width);
  const rippleSize = Math.floor((maxDimension * RIPPLE_INITIAL_SCALE) / zoom);
  const rippleRadius = Math.hypot(height, width) + RIPPLE_PADDING;
  const softEdgeSize = Math.max(
    maxDimension * RIPPLE_SOFT_EDGE_RATIO,
    RIPPLE_SOFT_EDGE_MIN_SIZE,
  );
  const rippleScale = (rippleRadius + softEdgeSize) / rippleSize / zoom;

  let startPoint: Point;
  if (event instanceof PointerEvent) {
    const { pageX, pageY } = event;
    const { scrollX, scrollY } = globalThis.window;
    const documentX = scrollX + left;
    const documentY = scrollY + top;

    startPoint = {
      x: (pageX - documentX) / zoom,
      y: (pageY - documentY) / zoom,
    };
  } else {
    startPoint = {
      x: width / zoom / 2,
      y: height / zoom / 2,
    };
  }
  const endPoint: Point = {
    x: (width / zoom - rippleSize) / 2,
    y: (height / zoom - rippleSize) / 2,
  };

  return {
    rippleSize,
    rippleScale,
    startPoint,
    endPoint,
  };
}

export function getRippleAnimationArgs(
  options: GetRippleAnimateOptions,
): AnimateElementArgs {
  const { rippleSize, rippleScale, startPoint, endPoint } =
    getRippleAnimateOptions(options);

  const rippleSizePx = `${rippleSize}px`;

  return [
    {
      top: [0, 0],
      left: [0, 0],
      width: [rippleSizePx, rippleSizePx],
      height: [rippleSizePx, rippleSizePx],
      transform: [
        `translate(${startPoint.x}px, ${startPoint.y}px) scale(1)`,
        `translate(${endPoint.x}px, ${endPoint.y}px) scale(${rippleScale})`,
      ],
    },
    {
      pseudoElement: "::before",
      duration: Duration.Long1,
      easing: Easing.Standard,
      fill: "forwards",
    },
  ];
}
