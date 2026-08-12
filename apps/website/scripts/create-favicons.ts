import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

import { enableLogger, log, logComplete } from "@mlaursen/node-utils";
import type { ExtendOptions } from "sharp";
import sharp from "sharp";
import { sharpsToIco } from "sharp-ico";

enableLogger();

const outDir = "docs/assets/favicon";
const rawSvg = "docs/assets/raw/favicon.svg";

log(`rm -rf ${outDir}`);
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

interface ResizeOptions {
  size: number;
  name?: string;
  extend?: ExtendOptions;
}

const resizes = [
  { size: 192 },
  { size: 512 },
  { size: 180, name: "apple-touch-icon.png" },
  {
    size: 512,
    name: "maskable-icon.png",
    extend: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
      background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent padding
    },
  },
] satisfies ResizeOptions[];

const svgBuffer = await readFile(rawSvg);
const svgFileName = `${outDir}/favicon.svg`;
const icoFileName = `${outDir}/favicon.ico`;
await Promise.all([
  writeFile(svgFileName, svgBuffer).then(() =>
    logComplete(`Wrote ${svgFileName}`),
  ),

  ...resizes.map(
    async ({ size, extend, name = `icon-${size}x${size}.png` }) => {
      const fileName = `${outDir}/${name}`;
      let chain = sharp(svgBuffer).resize(size, size);
      if (extend) {
        chain = chain.extend(extend);
      }
      await chain.toFile(fileName);

      logComplete(`Wrote ${fileName}`);
    },
  ),

  sharpsToIco([sharp(svgBuffer)], icoFileName, {
    sizes: [32],
    resizeOptions: {},
  }).then(() => logComplete(`Wrote ${icoFileName}`)),
]);
