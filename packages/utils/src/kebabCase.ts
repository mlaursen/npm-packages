export type KebabCase<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Lowercase<T>}${KebabCase<U>}`
    : `${Lowercase<T>}-${KebabCase<Uncapitalize<U>>}`
  : S;

/**
 * @param s - The string to convert
 */
export const kebabCase = <S extends string>(s: S): KebabCase<S> =>
  s.split(/(?=[A-Z])/).reduce((result, part, i) => {
    return result + (i ? "-" : "") + part.toLowerCase();
  }, "") as KebabCase<S>;
