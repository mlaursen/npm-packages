import { copyScssFiles } from "@mlaursen/copy-scss-files";
import { Command } from "commander";

const program = new Command("@mlaursen/cli");
program
  .command("copy-scss-files")
  .argument("[pattern]", "An optional scss file pattern")
  .option("--src <src>", "An optional src directory", "src")
  .option("-o, --out <dir>", "An optional dist directory", "dist")
  .option("-w, --watch", "Watch mode", false)
  .action((pattern, options) => {
    return copyScssFiles({
      ...options,
      pattern,
    });
  });

program.parse(process.argv);
