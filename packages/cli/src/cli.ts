import {
  type CopyScssFilesOptions,
  copyScssFiles,
} from "@mlaursen/copy-scss-files";
import { Command } from "commander";
import { basename, join } from "node:path";

interface ProgramCopyScssFilesOptions extends Required<
  Omit<CopyScssFilesOptions, "getDistPaths" | "pattern">
> {
  copyToRoot: Set<string>;
}

const program = new Command("@mlaursen/cli");
program
  .command("copy-scss-files")
  .argument("[pattern]", "An optional scss file pattern")
  .option("--src <src>", "An optional src directory", "src")
  .option("-o, --out <dir>", "An optional dist directory", "dist")
  .option("-w, --watch", "Watch mode", false)
  .option<Set<string>>(
    "-r, --copy-to-root <fileName>",
    "Also copy this file to the root directory",
    (value, previous) => {
      previous.add(value);
      return previous;
    },
    new Set()
  )
  .action((pattern: string, options: ProgramCopyScssFilesOptions) => {
    const { copyToRoot, ...copyOptions } = options;
    return copyScssFiles({
      ...copyOptions,
      pattern,
      getDistPaths: (path, renameDist) => {
        const paths = [renameDist(path)];
        if (copyToRoot.size > 0) {
          const name = basename(path);
          if (copyToRoot.has(name)) {
            paths.push(renameDist(join(options.src, name)));
          }
        }

        return paths;
      },
    });
  });

program.parse(process.argv);
