/* Source:
   https://stackoverflow.com/a/34749873/7486612
*/

export const isObject = (item: unknown): boolean =>
  !!item && typeof item === "object" && !Array.isArray(item);

export const mergeDeep = <K extends string, T extends { [key in K]: any }>(
  target: T,
  ...sources: T[]
): T => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!(target as any)[key]) Object.assign(target, { [key]: {} });
        mergeDeep((target as any)[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};
