import { closeSync, openSync, utimesSync } from "node:fs";

export function touch(filePath: string): void {
  try {
    const now = Date.now();
    utimesSync(filePath, now, now);
  } catch {
    closeSync(openSync(filePath, "w"));
  }
}
