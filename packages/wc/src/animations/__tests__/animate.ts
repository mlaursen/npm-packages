import { describe, expect, it, vi } from "vitest";

import { animate } from "../animate.js";
import { fade } from "../fade.js";

interface Options {
  rejects?: boolean;
}

function createFakeAnimation({ rejects }: Options = {}): Animation {
  const animation = {
    cancel: vi.fn(),
    finished: new Promise((resolve, reject) => {
      if (rejects) {
        reject(new DOMException("Aborted", "AbortError"));
      }

      resolve(animation);
    }),
  } as unknown as Animation;
  return animation;
}

function createFakeElement(options: Options = {}) {
  const animation = createFakeAnimation(options);
  const element = {
    animate: vi.fn(() => animation),
  } as unknown as HTMLElement;

  return { animation, element };
}

describe("animate", () => {
  it("should call element.animate for each set of args", () => {
    const { element } = createFakeElement();

    const fade1 = fade();
    const fade2 = fade({ pseudoElement: "::backdrop" });
    animate([[element, [fade1, fade2]]]);

    expect(element.animate).toHaveBeenCalledTimes(2);
    expect(element.animate).toHaveBeenNthCalledWith(1, ...fade1);
    expect(element.animate).toHaveBeenNthCalledWith(2, ...fade2);
  });

  it("should support a list of elements", () => {
    const fake1 = createFakeElement();
    const fake2 = createFakeElement();

    const { running } = animate([[[fake1.element, fake2.element], [fade()]]]);

    expect(fake1.element.animate).toHaveBeenCalledTimes(1);
    expect(fake2.element.animate).toHaveBeenCalledTimes(1);
    expect(running).toEqual([fake1.animation, fake2.animation]);
  });

  it("should skip empty element and args", () => {
    const { element } = createFakeElement();
    const args = [[{ opacity: 0 }, { opacity: 1 }], { duration: 150 }];

    const { running } = animate([
      [null, [args]],
      [element, []],
      [[null, element], [args]],
    ] as never);

    expect(element.animate).toHaveBeenCalledTimes(1);
    expect(running).toHaveLength(1);
  });

  it("should resolve finished when every animation has finished", async () => {
    const { element, animation } = createFakeElement();
    const { finished, running } = animate([[element, [fade()]]]);

    expect(running).toEqual([animation]);
    await expect(finished).resolves.toEqual([animation]);
  });

  it("should not reject if an animation is canceled", async () => {
    const { element, animation } = createFakeElement({ rejects: true });

    const { finished } = animate([[element, [fade()]]] as never);
    await expect(finished).resolves.toEqual([animation]);
  });

  it("should support canceling animations with an abort controller signal and not reject the finished state", async () => {
    const controller = new AbortController();
    const fake1 = createFakeElement();
    const fake2 = createFakeElement();

    const { finished } = animate(
      [
        [fake1.element, [fade()]],
        [fake2.element, [fade()]],
      ],
      { signal: controller.signal },
    );
    expect(fake1.animation.cancel).not.toHaveBeenCalled();
    expect(fake2.animation.cancel).not.toHaveBeenCalled();

    controller.abort();
    expect(fake1.animation.cancel).toHaveBeenCalledTimes(1);
    expect(fake2.animation.cancel).toHaveBeenCalledTimes(1);

    await expect(finished).resolves.not.toThrow();
  });
});
