export type LiteralStringUnion<T extends U, U = string> = T | (U & {});

export type OverridableStringUnion<
  Defaults extends string,
  Overrides extends Partial<Record<string, boolean>>,
> =
  | Exclude<Defaults, { [K in keyof Overrides]: K }[keyof Overrides]>
  | {
      [K in keyof Overrides]: Overrides[K] extends false ? never : K;
    }[keyof Overrides];

export type PrefixKeys<
  T extends Record<string, unknown>,
  Prefix extends string,
> = {
  [Key in keyof T & string as `${Prefix}${Key}`]?: T[Key];
};

export type CamelCase<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Lowercase<Head>}${Capitalize<CamelCase<Tail>>}`
    : Lowercase<S>;

export type CamelCaseKeys<T extends Record<string, unknown>> = {
  [Key in keyof T as CamelCase<string & Key>]: T[Key];
};

export type KebabCase<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Lowercase<T>}${KebabCase<U>}`
    : `${Lowercase<T>}-${KebabCase<Uncapitalize<U>>}`
  : S;

export type KebabCaseKeys<T extends Record<string, unknown>> = {
  [Key in keyof T as KebabCase<string & Key>]: T[Key];
};

export type PascalCase<S extends string> = Capitalize<CamelCase<S>>;
