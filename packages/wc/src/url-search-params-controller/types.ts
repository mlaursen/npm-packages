import type { output, ZodType } from "zod";

export type URLSearchParamsControllerValues<
  Schema extends ZodType | undefined,
> = Readonly<
  Schema extends ZodType
    ? output<Schema>
    : Record<string, string | string[] | null>
>;

export interface URLSearchParamsControllerOptions<
  Schema extends ZodType | undefined,
> {
  schema?: Schema;
  omitDefaults?: URLSearchParamsControllerValues<Schema> | boolean;
}
