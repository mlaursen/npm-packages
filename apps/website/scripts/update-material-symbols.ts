import { enableLogger, generateFile, log, logTask } from "@mlaursen/node-utils";
import { alphaNumericSort } from "@mlaursen/utils";
import { join } from "node:path";
import { z } from "zod";

enableLogger();

const METADATA_URL =
  "https://fonts.google.com/metadata/icons?incomplete=1&key=material_symbols";

const IconMetadataSchema = z.object({
  name: z.string(),
  version: z.number(),
  popularity: z.number(),
  codepoint: z.number(),
  unsupported_families: z.array(z.string()),

  // must have one category
  categories: z.array(z.string()).length(1),
  tags: z.array(z.string()),
  sizes_px: z.array(z.number()).refine((sizes) => sizes.includes(24), {
    message: "sizes_px does not have a 24x24 sized icon",
  }),
});

const MaterialSymbolsMetadataSchema = z.object({
  host: z.string(),
  asset_url_pattern: z.string(),
  families: z.array(z.string()),
  icons: z.array(IconMetadataSchema),
});

interface Result {
  tags: ReadonlyMap<string, readonly string[]>;
  families: ReadonlySet<string>;
  categories: ReadonlyMap<string, Set<string>>;
}

async function fetchMaterialSymbols(): Promise<Result> {
  const response = await fetch(METADATA_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch metadata: ${response.status} ${response.statusText}`,
    );
  }

  const raw = await response.text();

  // Strip the XSSI protection prefix ")]}'" before parsing
  const jsonText = raw.replace(/^\)\]\}'\n/, "");
  const metadata = MaterialSymbolsMetadataSchema.parse(JSON.parse(jsonText));

  const byFamily = new Map<string, Set<string>>();
  const tagsByName = new Map<string, readonly string[]>();
  const categories = new Map<string, Set<string>>();
  const families = new Set<string>();
  for (const icon of metadata.icons) {
    const {
      name,
      tags,
      categories: [category = ""],
      unsupported_families,
    } = icon;
    for (const family of metadata.families) {
      if (family.includes("Icons") || unsupported_families.includes(family)) {
        continue;
      }

      families.add(family.replace(/Material Symbols/i, "").trim());
      const familyIconNames = byFamily.get(family) ?? new Set();
      const categoryIcons = categories.get(category) ?? new Set();
      familyIconNames.add(name);
      categoryIcons.add(name);
      byFamily.set(family, familyIconNames);
      tagsByName.set(name, tags);
      categories.set(category, categoryIcons);
    }
  }

  const [first, ...others] = byFamily.values();
  if (
    !first ||
    !others.every(
      (names) =>
        names.size === first.size && first.difference(names).size === 0,
    )
  ) {
    throw new Error("Invalid!!");
  }

  return {
    tags: tagsByName,
    families,
    categories,
  };
}

async function run(): Promise<void> {
  log(`Fetching Material Symbols metadata from:\n  ${METADATA_URL}\n`);

  const { tags, families, categories } = await fetchMaterialSymbols();
  const sortedTags = alphaNumericSort([...tags.entries()], {
    extractor: ([name]) => name,
  });
  const sortedCategories = alphaNumericSort([...categories.entries()], {
    extractor: ([name]) => name,
  });

  await generateFile({
    banner: true,
    fileSize: false,
    filePath: join(process.cwd(), "src", "_data", "materialSymbols.js"),
    contents: `
export const tags = {
  ${sortedTags.map(([name, tags]) => `"${name}": ${JSON.stringify(alphaNumericSort(tags))},`).join("")}
};

export const categories = {
  ${sortedCategories.map(([category, icons]) => `"${category}": ${JSON.stringify(alphaNumericSort([...icons]))},`).join("")}
};

export const families = ${JSON.stringify(alphaNumericSort([...families]))}
`,
  });

  // console.log(`Families (${result.families.length}):`);
  // for (const f of result.families) {
  //   console.log(`  - ${f}`);
  // }
  //
  // console.log(`\nTotal icons: ${result.icons.length}`);
  // console.log("\nSample (first 5 icons):");
  // for (const icon of result.icons.slice(0, 5)) {
  //   console.log(`  ${icon.name}`);
  //   console.log(`    Categories:         ${icon.categories.join(", ") || "—"}`);
  //   console.log(`    Supported families: ${icon.supportedFamilies.join(", ")}`);
  // }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
await logTask(run(), "Updating material symbols", "Material symbols updated!");

// main().catch(console.error);
