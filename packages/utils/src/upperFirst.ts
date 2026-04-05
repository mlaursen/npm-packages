/**
 * @param s - the string to update
 * @return the updated string
 */
export const upperFirst = <S extends string>(s: S): Capitalize<S> =>
  (s.slice(0, 1).toUpperCase() + s.slice(1)) as Capitalize<S>;
