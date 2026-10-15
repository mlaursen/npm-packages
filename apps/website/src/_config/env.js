import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

Object.assign(process.env, parseEnv(readFileSync(".env", "utf8")));
