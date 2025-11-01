let _log = false;

export function enableLogger(): void {
  _log = true;
}

export function disableLogger(): void {
  _log = false;
}

export function log(msg: string): void {
  if (!_log) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log(msg);
}
