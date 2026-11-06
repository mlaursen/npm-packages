import { describe, it, expect } from "vitest";

import { compileScssModule } from "../compileScssModule.js";
import { defaultNodeLoad } from "../defaultNodeLoad.js";

const scss = (strings: TemplateStringsArray, ...values: string[]): string =>
  strings.reduce(
    (result, str, i) => result + str + (i < values.length ? values[i] : ""),
    "",
  );

describe("compileScssModule", () => {
  it("should be able to handle a simple scss file by using a consistent hash", () => {
    const result = compileScssModule({
      code: ".whatever { color: red; }",
      basePath: process.cwd(),
      componentName: "Whatever",
      load: defaultNodeLoad,
    });
    expect(result.css).toBe(`.Whatever_whatever__V2hhd {
  color: red;
}`);
  });

  it("should support local and global scope", () => {
    const code = scss`
$scale-transition-enter-duration: .15s;

.countdown {
  will-change: width;

  &::before {
    animation: none;
  }

  &::after {
    animation: 5s linear $scale-transition-enter-duration countdown;
  }

  :global(.rmd-toast--paused) :local &::after {
    animation-play-state: paused;
  }
}
`;

    const result = compileScssModule({
      code,
      basePath: process.cwd(),
      componentName: "AnotherExample",
      load: defaultNodeLoad,
    });
    expect(result.css).toBe(`.AnotherExample_countdown__QW5vd {
  will-change: width;
}
.AnotherExample_countdown__QW5vd::before {
  animation: none;
}
.AnotherExample_countdown__QW5vd::after {
  animation: 5s linear 0.15s countdown;
}
.rmd-toast--paused  .AnotherExample_countdown__QW5vd::after {
  animation-play-state: paused;
}`);
  });
});
