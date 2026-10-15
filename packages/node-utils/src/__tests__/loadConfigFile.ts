// oxlint-disable typescript/no-dynamic-delete
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { loadConfigFile } from "../loadConfigFile.js";

// LDE === load dot env
const KEYS = ["LDE_FOO", "LDE_BAR", "LDE_EMPTY", "LDE_QUOTED"];

describe("loadDotEnv", () => {
  let tempDir: string;
  let envPath: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "load-dot-env-"));
    envPath = join(tempDir, ".env");
    for (const key of KEYS) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of KEYS) {
      delete process.env[key];
    }

    rmSync(tempDir, { recursive: true, force: true });
  });

  it("loads variables from the given path", () => {
    writeFileSync(envPath, "LDE_FOO=foo\nLDE_BAR=bar\n");

    loadConfigFile({ path: envPath });

    expect(process.env["LDE_FOO"]).toBe("foo");
    expect(process.env["LDE_BAR"]).toBe("bar");
  });

  it("loads from .env in the working directory by default", () => {
    writeFileSync(envPath, "LDE_FOO=from-cwd\n");
    const originalCwd = process.cwd();

    try {
      process.chdir(tempDir);
      loadConfigFile();
    } finally {
      process.chdir(originalCwd);
    }

    expect(process.env["LDE_FOO"]).toBe("from-cwd");
  });

  it("parses quoted values and ignores comments", () => {
    writeFileSync(
      envPath,
      ["# a comment", 'LDE_QUOTED="hello world"', "LDE_FOO=foo # inline"].join(
        "\n",
      ),
    );

    loadConfigFile({ path: envPath });

    expect(process.env["LDE_QUOTED"]).toBe("hello world");
    expect(process.env["LDE_FOO"]).toBe("foo");
  });

  it("sets empty values as empty strings", () => {
    writeFileSync(envPath, "LDE_EMPTY=\n");

    loadConfigFile({ path: envPath });

    expect(process.env["LDE_EMPTY"]).toBe("");
  });

  describe("without override", () => {
    it("does not replace variables that are already set", () => {
      process.env["LDE_FOO"] = "existing";
      writeFileSync(envPath, "LDE_FOO=from-file\nLDE_BAR=bar\n");

      loadConfigFile({ path: envPath });

      expect(process.env["LDE_FOO"]).toBe("existing");
      expect(process.env["LDE_BAR"]).toBe("bar");
    });

    it("treats an existing empty string as set", () => {
      process.env["LDE_EMPTY"] = "";
      writeFileSync(envPath, "LDE_EMPTY=from-file\n");

      loadConfigFile({ path: envPath });

      expect(process.env["LDE_EMPTY"]).toBe("");
    });

    it("behaves the same when override is explicitly false", () => {
      process.env["LDE_FOO"] = "existing";
      writeFileSync(envPath, "LDE_FOO=from-file\n");

      loadConfigFile({ path: envPath, override: false });

      expect(process.env["LDE_FOO"]).toBe("existing");
    });
  });

  it("silently ignores a missing file", () => {
    const missing = join(tempDir, "does-not-exist.env");

    expect(() => loadConfigFile({ path: missing })).not.toThrow();
    expect(() =>
      loadConfigFile({ path: missing, override: true }),
    ).not.toThrow();
  });

  it("rethrows non-ENOENT errors such as EISDIR", () => {
    const directory = join(tempDir, "a-directory");
    mkdirSync(directory);

    expect(() => loadConfigFile({ path: directory })).toThrow(/EISDIR/);
  });

  describe("with override", () => {
    it("replaces variables that are already set", () => {
      process.env["LDE_FOO"] = "existing";
      writeFileSync(envPath, "LDE_FOO=from-file\nLDE_BAR=bar\n");

      loadConfigFile({ path: envPath, override: true });

      expect(process.env["LDE_FOO"]).toBe("from-file");
      expect(process.env["LDE_BAR"]).toBe("bar");
    });

    it("leaves variables not in the file untouched", () => {
      process.env["LDE_BAR"] = "keep-me";
      writeFileSync(envPath, "LDE_FOO=foo\n");

      loadConfigFile({ path: envPath, override: true });

      expect(process.env["LDE_BAR"]).toBe("keep-me");
    });
  });
});
