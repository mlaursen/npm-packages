import { describe, expect, it, vi } from "vitest";

import {
  compileScss as compileScssRaw,
  type CompileScssOptions,
} from "../compileScss.js";
import { compileScss } from "../compileScss.node.js";
import { defaultNodeLoad } from "../defaultNodeLoad.js";

vi.mock("../compileScss.js");

const compileScssMock = vi.mocked(compileScssRaw);

describe("node", () => {
  describe("compileScss", () => {
    it("should default to loading with readFileSync", () => {
      const code = "$variable: 1;";
      const basePath = ".";
      compileScss({ code, basePath });
      expect(compileScssMock).toHaveBeenCalledWith({
        code,
        basePath,
        load: defaultNodeLoad,
      } satisfies CompileScssOptions);
    });
  });
});
