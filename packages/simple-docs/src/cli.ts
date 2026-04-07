import { Command } from "commander";

import { generate } from "./generate.js";

const program = new Command("@mlaursen/simple-docs");
program.action(() => generate());

program.parse(process.argv);
