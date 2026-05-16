import { readFileSync } from "node:fs";

export const defaultNodeLoad = (filePath: string): string =>
  readFileSync(filePath, "utf8");
