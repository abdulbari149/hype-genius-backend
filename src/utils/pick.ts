export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  const ret: any = {};
  keys.forEach((key) => {
    if (key in obj) {
      ret[key] = obj[key];
    }
  });
  return ret;
}
