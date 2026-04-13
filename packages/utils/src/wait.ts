/**
 * This util was just added to support random waits for mocking data and random
 * throttling.
 *
 * @example Wait some duration
 * ```ts
 * import { wait } from "@mlaursen/utils/wait";
 *
 * console.log("start");
 * await wait(5000);
 * console.log("it has been five seconds");
 * ```
 *
 * @param ms time to wait in milliseconds
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, ms),
  );
}
