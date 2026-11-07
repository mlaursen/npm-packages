import {
  MATERIAL_SYMBOL_FAMILIES,
  MATERIAL_SYMBOL_FILLS,
  MATERIAL_SYMBOL_GRADES,
  MATERIAL_SYMBOL_OPTICAL_SIZES,
  MATERIAL_SYMBOL_WEIGHTS,
  type MaterialSymbolFill,
  type MaterialSymbolGrade,
  type MaterialSymbolOpticalSize,
  type MaterialSymbolWeight,
} from "@mlaursen/wc";
import z from "zod";

// oxlint-disable-next-line typescript/explicit-function-return-type
const choice = <T extends number>(values: readonly T[], fallback: T) =>
  z.coerce
    .number()
    .pipe(z.union(values.map((v) => z.literal(v))))
    .catch(fallback);

export const materialSymbolsSchema = z.object({
  FILL: choice<MaterialSymbolFill>(MATERIAL_SYMBOL_FILLS, 0),
  GRAD: choice<MaterialSymbolGrade>(MATERIAL_SYMBOL_GRADES, 0),
  wght: choice<MaterialSymbolWeight>(MATERIAL_SYMBOL_WEIGHTS, 400),
  opsz: choice<MaterialSymbolOpticalSize>(MATERIAL_SYMBOL_OPTICAL_SIZES, 24),

  family: z
    .string()
    .pipe(z.union(MATERIAL_SYMBOL_FAMILIES.map((v) => z.literal(v))))
    // oxlint-disable unicorn/prefer-top-level-await
    .catch("outlined"),

  q: z.string().catch(""),
  icon: z.string().catch(""),
});

export const materialSymbolsDefaults = materialSymbolsSchema.parse({});
