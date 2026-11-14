import { stat } from "node:fs/promises";
import { basename, join, parse } from "node:path";

import { ensureParentDir, logTask } from "@mlaursen/node-utils";
import sharp from "sharp";
import z from "zod";

import * as images from "../../_data/unsplash.js";
import { ASSETS_DIR } from "../constants.js";
import { escapeAttribute } from "../utils/escapeAttribute.js";

const UNSPLASH_PATH = "images/unsplash";
const UNSPLASH_DIR = `${ASSETS_DIR}/${UNSPLASH_PATH}`;

/**
 * @type {(keyof typeof images)[]}
 */
// @ts-expect-error too broad
const IMAGE_NAMES = Object.keys(images);

const schema = z
  .object({
    key: z.enum(IMAGE_NAMES),
    alt: z.string().optional(),
    srcAlt: z.boolean().default(false),
    ignore: z.boolean().default(false),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    position: z.string().default("centre"),
  })
  // any other keys become HTML attributes: `class`, `loading`, `eleventy:ignore`, ...
  .catchall(z.union([z.string(), z.number(), z.boolean()]).nullish())
  .refine(
    (options) =>
      (options.width === undefined) === (options.height === undefined),
    {
      message: "width and height must be passed together",
      path: ["height"],
    },
  );

/**
 * @type {Map<string, Promise<string>>}
 */
const variants = new Map();

/**
 * @param {string} position
 * @returns {string | number}
 */
function getSharpPosition(position) {
  return position === "attention" || position === "entropy"
    ? sharp.strategy[position]
    : position;
}

/**
 * @param {string} input
 * @param {string} output
 * @returns {Promise<boolean>}
 */
async function isUpToDate(input, output) {
  try {
    const [outputStats, inputStats] = await Promise.all([
      stat(output),
      stat(input),
    ]);
    return outputStats.mtimeMs >= inputStats.mtimeMs;
  } catch {
    return false;
  }
}

/**
 * @param {{ fileName: string; width: number; height: number; position: string | number; }} options
 * @returns {Promise<string>}
 */
async function createVariant(options) {
  const { fileName, width, height, position } = options;
  const { name, ext } = parse(fileName);
  const variant = `${name}-${width}-${height}${ext}`;
  const outUrl = `/assets/${UNSPLASH_PATH}/${variant}`;
  const input = join(UNSPLASH_DIR, fileName);
  const output = join(UNSPLASH_DIR, variant);
  if (await isUpToDate(input, output)) {
    return outUrl;
  }

  await ensureParentDir(output);
  await logTask(
    sharp(input)
      .rotate()
      .resize({ width, height, fit: "cover", position })
      .toFile(output),
    "",
    `Wrote ${output}`,
  );
  return outUrl;
}

/**
 * @param {{ fileName: string; width: number; height: number; position: string | number; }} options
 * @returns {Promise<string>}
 */
function getVariant(options) {
  const { fileName, width, height, position } = options;
  const key = `${fileName}:${width}:${height}:${position}`;

  const cached = variants.get(key);
  if (cached) {
    return cached;
  }

  const promise = createVariant(options);
  variants.set(key, promise);
  return promise;
}

/**
 * `https://picsum.photos` went down, so instead just self-host images from
 * unsplash since the license allows it.
 *
 * The steps are:
 * - download image and put in `src/assets/images/unsplash`
 * - update `src/_data/unsplash.js` for the new metadata
 * - restart eleventy
 *
 * Use the shortcode like:
 *
 * ```njk
 * {% unsplash "coffeeCup" %}
 * {% unsplash "coffeeCup", { width: 200, height: 300 } %}
 * ```
 *
 * @param {import("11ty.ts").EleventyConfig} eleventyConfig
 */
export function unsplashPlugin(eleventyConfig) {
  eleventyConfig.on("eleventy.before", () => variants.clear());
  eleventyConfig.addAsyncShortcode(
    "unsplash",
    /**
     * @this {import("#types").SiteData}
     * @param {string} key
     * @param {Partial<z.infer<typeof schema>>} options
     */
    async function unsplashShortcode(key, options = {}) {
      const parsed = schema.safeParse({ ...options, key });
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map(
            (issue) =>
              `  ${issue.path.join(".") || "(root)"}: ${issue.message}`,
          )
          .join("\n");
        throw new Error(
          `Invalid {% unsplash %} in ${this.page?.inputPath}:\n${issues}`,
        );
      }

      const {
        key: imageKey,
        width,
        height,
        position,
        ignore,
        srcAlt,
        alt,
        ...extraAttrs
      } = parsed.data;
      const image = images[imageKey];

      /** @type {Record<string, string | number | boolean | null | undefined>} */
      const attrs = {
        src: image.src,
        alt: alt ?? (srcAlt ? image.alt : ""),
        loading: "lazy",
        decoding: "async",
        "eleventy:ignore": ignore,
        ...extraAttrs,
      };

      if (width !== undefined && height !== undefined) {
        attrs.src = await getVariant({
          width,
          height,
          position: getSharpPosition(position),
          fileName: basename(image.src),
        });
        attrs.width = width;
        attrs.height = height;
      }

      const html = Object.entries(attrs)
        .filter(([_name, value]) => !!value)
        .map(([name, value]) =>
          value === true ? name : `${name}="${escapeAttribute(value)}"`,
        )
        .join(" ");

      return `<img ${html}>`;
    },
  );
}
