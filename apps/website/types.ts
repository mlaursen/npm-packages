import type git from "./src/_data/git.js";
import type * as MaterialSymbols from "./src/_data/materialSymbols.js";
import type * as Meta from "./src/_data/meta.js";
import type * as Navigation from "./src/_data/navigation.js";
import type * as WebComponentsData from "./src/packages/wc/wc.11tydata.js";

export interface PageData {
  url: string;
  title?: string;
  fileSlug: string;
  filePathStem: string;
  inputPath: string;
  outputPath: string;
  outputFileExtension: string;
  templateSyntax: string;
  date: Date;
  rawInput: string;
}

export interface CustomEleventyComputed {
  title?: string | null;
  // playground?: (data: SiteData) => null;
  sourcePath?: string | null;
  editPagePath?: string | null;
}

export interface SiteData {
  title?: string | null;
  repoPath: string;
  packageName: string;
  sourcePath: string;

  bodyClassName?: string;

  // the "./src/_layouts/" files
  layout?: "docs" | "page" | "base" | "base-nav";

  page: PageData;

  // data dirs
  git: ReturnType<typeof git>;
  meta: typeof Meta;
  navigation: typeof Navigation;
  materialSymbols?: typeof MaterialSymbols;

  /**
   * Exists if there is code on the page
   */
  shikiCssFile?: string;

  // don't care about this
  eleventy?: Record<string, unknown>;
  // don't care about this
  eleventyComputed?: Record<string, () => unknown>;
  // looks like package.json
  pkg?: Record<string, unknown>;

  eleventyNavigation?: { key: string; parent: string };

  // draft plugin
  draft?: boolean;
  permalink?: string;

  eleventyExcludeFromCollections?: string;
  collections?: Record<string, unknown>;
}

export type WebComponentsMeta = typeof WebComponentsData;

export type ComputedData<Group extends "wc" | null = null> = SiteData &
  (Group extends "wc" ? WebComponentsMeta : object);

export type EleventyComputedCallback<
  Key extends keyof CustomEleventyComputed,
  Group extends "wc" | null = null,
> = (data: ComputedData<Group>) => CustomEleventyComputed[Key];
