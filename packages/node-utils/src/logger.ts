import prettyMilliseconds from "pretty-ms";

let _log = false;

export function enableLogger(): void {
  _log = true;
}

export function disableLogger(): void {
  _log = false;
}

export function log(msg: string, type: "log" | "error" | "warn" = "log"): void {
  if (!_log) {
    return;
  }

  // eslint-disable-next-line no-console
  console[type](msg);
}

export function logPending(message: string): void {
  log(` ○ ${message} ...`);
}

export function logComplete(message: string, duration?: number): void {
  const suffix =
    typeof duration === "number" ? ` in ${prettyMilliseconds(duration)}` : "";
  log(` ✓ ${message}${suffix}`);
}

export function logFailure(message: string): void {
  log(` × ${message}`, "error");
}

export async function logTask<Result>(
  task: Promise<Result>,
  startMessage: string,
  endMessage: string
): Promise<Result> {
  if (!_log || (!startMessage && !endMessage)) {
    return task;
  }

  if (startMessage) {
    logPending(startMessage);
  }

  const start = Date.now();
  const result = await task;
  const duration = Date.now() - start;
  logComplete(endMessage, duration);
  return result;
}
