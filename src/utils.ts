export const replaceBySourceKeys = <T extends object>(target: T, source: T): T => {

  for (const key of Object.keys(source)) {
    const value = source[key as keyof typeof source];
    if (['function', 'object'].includes(typeof value)) {
    } else {
      if (target) {
        target[key as keyof typeof target] = value;
      }
    }
  }
  return target;
}
