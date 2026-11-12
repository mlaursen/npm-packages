import { describe, expect, it } from "vitest";

import { getRange, middleOfRange, rangeSteps, snapToStep } from "../range.js";

describe("range", () => {
  describe("getRange", () => {
    it("should just do max - min since it's mostly for readability", () => {
      expect(getRange({ min: 0, max: 100 })).toBe(100);
      expect(getRange({ min: Number.NaN, max: 100 })).toBe(Number.NaN);
      expect(getRange({ min: 0, max: Number.NaN })).toBe(Number.NaN);
    });
  });

  describe("middleOfRange", () => {
    it("should return the middle of the range", () => {
      expect(middleOfRange({ min: 0, max: 100, step: 1 })).toBe(50);
      expect(middleOfRange({ min: 0, max: 100, step: 2 })).toBe(50);
      expect(middleOfRange({ min: 0, max: 100, step: 5 })).toBe(50);

      expect(middleOfRange({ min: 30, max: 80, step: 1 })).toBe(55);
    });

    describe("rangeSteps", () => {
      it("should work as expected", () => {
        expect(rangeSteps({ min: 0, max: 100, step: 1 })).toBe(100);
        expect(rangeSteps({ min: 0, max: 100, step: 10 })).toBe(10);
        expect(rangeSteps({ min: 0, max: 10, step: 1 })).toBe(10);
        expect(rangeSteps({ min: 0, max: 100, step: 10 })).toBe(10);
        expect(rangeSteps({ min: -10, max: 10, step: 1 })).toBe(20);
        expect(rangeSteps({ min: -10, max: 10, step: 0.5 })).toBe(40);
        expect(rangeSteps({ min: 0.1, max: 0.9, step: 0.05 })).toBe(16);
      });
    });

    describe("snapToStep", () => {
      it("should round correctly", () => {
        expect(snapToStep({ value: 1, min: 0, max: 1, steps: 1 })).toBe(1);
        expect(snapToStep({ value: 0, min: 0, max: 100, steps: 100 })).toBe(0);

        expect(snapToStep({ value: 28, min: 0, max: 100, steps: 10 })).toBe(30);
        expect(snapToStep({ value: 28.7, min: 0, max: 100, steps: 10 })).toBe(
          30,
        );
        expect(snapToStep({ value: 28.3, min: 0, max: 100, steps: 100 })).toBe(
          28,
        );
        expect(snapToStep({ value: 28.7, min: 0, max: 100, steps: 100 })).toBe(
          29,
        );

        expect(snapToStep({ value: 2.75, min: 0, max: 10, steps: 10 })).toBe(3);
        expect(snapToStep({ value: 5.12, min: 5, max: 6, steps: 10 })).toBe(
          5.1,
        );
        expect(snapToStep({ value: 0.06, min: 0, max: 1, steps: 10 })).toBe(
          0.1,
        );

        expect(snapToStep({ value: 0.12, min: 0, max: 1, steps: 4 })).toBe(0);
        expect(snapToStep({ value: 0.13, min: 0, max: 1, steps: 4 })).toBe(
          0.25,
        );
        expect(snapToStep({ value: 0.24, min: 0, max: 1, steps: 4 })).toBe(
          0.25,
        );
        expect(snapToStep({ value: 0.28, min: 0, max: 1, steps: 4 })).toBe(
          0.25,
        );
        expect(snapToStep({ value: 0.33, min: 0, max: 1, steps: 4 })).toBe(
          0.25,
        );
      });

      it("should allow for a custom range to be used with range sliders", () => {
        // to explain this a bit better, need to make sure that the slider thumbs
        // are always in order of `min -> max` so the min and max values change
        // depending on which thumb is being dragged:
        // - thumb1 -> min === min, max === thumb2Value
        // - thumb2 -> min === thumb1Value, max === max

        expect(
          snapToStep({
            value: 44.3,
            min: 40,
            max: 100,
            steps: 100,
            range: 100,
          }),
        ).toBe(44);
        expect(
          snapToStep({ value: 50, min: 20, max: 50, steps: 50, range: 50 }),
        ).toBe(50);
        expect(
          snapToStep({ value: 22.3, min: 20, max: 50, steps: 50, range: 50 }),
        ).toBe(22);
        expect(
          snapToStep({ value: 12.3, min: 20, max: 50, steps: 50, range: 50 }),
        ).toBe(20);
        expect(
          snapToStep({ value: 0, min: 30, max: 50, steps: 100, range: 100 }),
        ).toBe(30);

        // it's possible for the value to be larger than the min or max for range
        // sliders now that it supports a "current drag value" vs _real_ value
        const min = 100;
        const max = 10_000;
        const range = max - min;
        const steps = range;
        const minValue = 2000;
        const maxValue = 8000;
        expect(
          snapToStep({ value: 10_000, min, max: maxValue, steps, range }),
        ).toBe(maxValue);
        expect(snapToStep({ value: 0, min: minValue, max, steps, range })).toBe(
          minValue,
        );
      });

      it("should just return the min/max value if they are equal to support range sliders that have values one step apart", () => {
        expect(
          snapToStep({
            min: 100,
            max: 100,
            steps: 0,
            value: 100,
          }),
        ).toBe(100);

        expect(
          snapToStep({
            min: 100,
            max: 100,
            steps: 0,
            value: 103,
          }),
        ).toBe(100);
      });
    });
  });
});
