import { compileString, type Importer, type StringOptions } from "sass";
import { describe, expect, it, vi } from "vitest";

import { compileScss } from "../compileScss.js";
import { createScssImporter } from "../createScssImporter.js";

vi.mock("sass");
vi.mock("../createScssImporter.js");

const importer: Importer = {
  canonicalize: () => null,
  load: () => null,
};
const compileStringMock = vi.mocked(compileString);
const createScssImporterMock = vi
  .mocked(createScssImporter)
  .mockReturnValue(importer);

const code = "$variable: 1;";
const load = (): string => "";
const basePath = ".";

describe("compileScss", () => {
  it("should just call the sass compileString with the default options", () => {
    compileScss({ code, load, basePath });

    expect(compileStringMock).toHaveBeenCalledWith(code, {
      importers: [importer],
    } satisfies StringOptions<"sync">);
    expect(createScssImporterMock).toHaveBeenCalledWith({ load, basePath });
  });

  it("should support custom sass options", () => {
    const sassOptions: StringOptions<"sync"> = {
      alertAscii: false,
      quietDeps: true,
    };
    compileScss({ code, load, basePath, sassOptions });
    expect(compileStringMock).toHaveBeenCalledWith(code, {
      ...sassOptions,
      importers: [importer],
    } satisfies StringOptions<"sync">);
  });
});
