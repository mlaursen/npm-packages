import type {
  ToastState,
  ToastTimeoutPausedEventDetail,
  ToastTimeoutPausedReason,
  ToastTimeoutStartedEventDetail,
  ToastTimeoutStartedReason,
} from "./types.js";

export abstract class BaseToastStateChangeEvent
  extends Event
  implements ToastState
{
  static readonly type = "toast-state-change";
  readonly startTime: number;
  readonly elapsedTime: number;
  readonly remainingTime: number;

  constructor(detail: ToastState, eventInitDict?: EventInit) {
    super(BaseToastStateChangeEvent.type, eventInitDict);

    this.startTime = detail.startTime;
    this.elapsedTime = detail.elapsedTime;
    this.remainingTime = detail.remainingTime;
  }
}

export class ToastTimeoutStartedEvent
  extends BaseToastStateChangeEvent
  implements ToastTimeoutStartedEventDetail
{
  readonly state = "started";
  readonly reason: ToastTimeoutStartedReason;

  constructor(
    detail: Omit<ToastTimeoutStartedEventDetail, "state">,
    eventInitDict?: EventInit,
  ) {
    const { reason, ...timing } = detail;
    super(timing, eventInitDict);

    this.reason = reason;
  }
}

export class ToastTimeoutPausedEvent
  extends BaseToastStateChangeEvent
  implements ToastTimeoutPausedEventDetail
{
  readonly state = "paused";
  readonly reason: ToastTimeoutPausedReason;

  constructor(
    detail: Omit<ToastTimeoutPausedEventDetail, "state">,
    eventInitDict?: EventInit,
  ) {
    const { reason, ...timing } = detail;
    super(timing, eventInitDict);

    this.reason = reason;
  }
}

export type ToastStateChangeEvent =
  | ToastTimeoutStartedEvent
  | ToastTimeoutPausedEvent;

declare global {
  interface GlobalEventHandlersEventMap {
    "toast-state-change": ToastStateChangeEvent;
  }
}
